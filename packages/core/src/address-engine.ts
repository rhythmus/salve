/**
 * SALVE Address Engine (v1)
 *
 * First-class pipeline stage that resolves culturally correct address
 * forms from structured recipient data, baseline address packs, and
 * optional gated protocol packs.
 *
 * Pipeline:
 *   1. Normalize recipient / audience
 *   2. Load locale baseline address data
 *   3. Merge enabled protocol packs
 *   4. Resolve title stack & style precedence
 *   5. Choose address pattern (rule matching)
 *   6. Apply morphology / transforms
 *   7. Emit structured ResolvedAddress
 */

import {
    AddressPack,
    AddressPackTitle,
    AddressRecipient,
    AddressAudience,
    AddressRule,
    AddressOutputForm,
    AddressMode,
    AudienceKind,
    CollectiveFormula,
    Formality,
    ProtocolPack,
    RelationshipContext,
    ResolvedAddress,
    TitleSystem,
    NormalizedContext,
    HonorificPack,
} from "./types";
import { TransformHook } from "./address";

export class AddressEngine {
    private addressPacks = new Map<string, AddressPack>();
    private protocolPacks: ProtocolPack[] = [];
    private transforms = new Map<string, TransformHook[]>();

    registerAddressPack(pack: AddressPack): void {
        this.addressPacks.set(pack.locale, pack);
    }

    registerProtocolPack(pack: ProtocolPack): void {
        this.protocolPacks.push(pack);
    }

    registerTransform(locale: string, hook: TransformHook): void {
        const list = this.transforms.get(locale) ?? [];
        list.push(hook);
        this.transforms.set(locale, list);
    }

    /**
     * Bridge: import existing HonorificPack data as a minimal AddressPack.
     */
    importLegacyHonorifics(pack: HonorificPack): void {
        if (this.addressPacks.has(pack.locale)) return;

        const addrPack: AddressPack = {
            locale: pack.locale,
            honorifics: {
                male: pack.titles.male,
                female: pack.titles.female,
                nonBinary: pack.titles.nonBinary,
                unspecified: pack.titles.unspecified,
            },
            formats: {
                postal: "{honorific} {titleStack} {surname}",
                letterhead: "{honorific} {titleStack} {surname},",
                salutation: "{honorific} {surname}",
                informal: "{firstName}",
            },
        };
        this.addressPacks.set(pack.locale, addrPack);
    }

    /**
     * Resolve a structured address for the given context.
     */
    resolve(
        audience: AddressAudience,
        ctx: AddressResolveContext,
    ): ResolvedAddress {
        const trace: string[] = [];
        const usedRuleIds: string[] = [];
        const usedTitleCodes: string[] = [];

        const pack = this.getAddressPack(ctx.locale, trace);

        if (audience.kind === "group" || audience.kind === "public" || audience.kind === "institution") {
            return this.resolveCollective(audience, pack, ctx, trace);
        }

        if (audience.kind === "pair" && audience.recipients.length === 2) {
            return this.resolvePair(audience, pack, ctx, trace);
        }

        const recipient = audience.recipients[0];
        if (!recipient) {
            trace.push("No recipient data — returning empty address");
            return this.emptyResult(ctx, trace);
        }

        if (ctx.formality === "formal" && !recipient.surname) {
            trace.push("Formal address requires surname — degrading to empty");
            return this.emptyResult(ctx, trace);
        }

        const enabledProtocols = this.getEnabledProtocols(ctx);
        trace.push(`Enabled protocol packs: ${enabledProtocols.length}`);

        const allTitles = this.mergeTitles(pack, enabledProtocols);
        const titleStack = this.buildTitleStack(recipient, allTitles, pack, ctx, usedTitleCodes, trace);

        const honorific = this.resolveHonorific(recipient, pack);
        trace.push(`Honorific: "${honorific}"`);

        const rules = this.collectRules(pack, enabledProtocols);
        const matchedRule = this.matchRule(rules, ctx, recipient, trace);

        let template: string;
        if (matchedRule) {
            template = matchedRule.template;
            usedRuleIds.push(matchedRule.id);
            trace.push(`Matched rule: ${matchedRule.id} (priority ${matchedRule.priority})`);
        } else {
            template = this.getDefaultTemplate(pack, ctx.outputForm, ctx.formality);
            trace.push(`Using default ${ctx.outputForm} template`);
        }

        const tokenMap = this.buildTokenMap(recipient, honorific, titleStack, ctx);
        let text = this.applyTemplate(template, tokenMap);
        text = this.applyTransforms(text, ctx.locale, recipient);

        trace.push(`Resolved: "${text}"`);

        return {
            text,
            outputForm: ctx.outputForm,
            mode: ctx.addressMode,
            audienceKind: audience.kind,
            usedRuleIds,
            usedTitleCodes,
            trace,
        };
    }

    // ── Pack lookup ─────────────────────────────────────────────

    private getAddressPack(locale: string, trace: string[]): AddressPack | null {
        if (this.addressPacks.has(locale)) {
            trace.push(`Address pack found: ${locale}`);
            return this.addressPacks.get(locale)!;
        }
        const base = locale.split("-")[0];
        if (this.addressPacks.has(base)) {
            trace.push(`Address pack fallback: ${base}`);
            return this.addressPacks.get(base)!;
        }
        trace.push("No address pack found");
        return null;
    }

    private getEnabledProtocols(ctx: AddressResolveContext): ProtocolPack[] {
        if (!ctx.allowSubcultureAddressing || !ctx.subcultures?.length) return [];

        return this.protocolPacks.filter(pp => {
            const localeMatch = ctx.locale.startsWith(pp.locale) || pp.locale === ctx.locale.split("-")[0];
            const subcultureMatch = ctx.subcultures!.includes(pp.requiredSubculture);
            return localeMatch && subcultureMatch;
        });
    }

    // ── Title resolution ────────────────────────────────────────

    private mergeTitles(
        pack: AddressPack | null,
        protocols: ProtocolPack[],
    ): AddressPackTitle[] {
        const titles: AddressPackTitle[] = [];
        if (pack?.titles) titles.push(...pack.titles);
        for (const pp of protocols) {
            titles.push(...pp.titles);
        }
        return titles;
    }

    private buildTitleStack(
        recipient: AddressRecipient,
        available: AddressPackTitle[],
        pack: AddressPack | null,
        ctx: AddressResolveContext,
        usedCodes: string[],
        trace: string[],
    ): { postal: string; correspondence: string } {
        if (!recipient.titles?.length) {
            return { postal: "", correspondence: "" };
        }

        if (ctx.formality === "informal" && pack?.titleSuppression?.informalDropsTitles) {
            trace.push("Informal context: titles dropped by suppression rule");
            return { postal: "", correspondence: "" };
        }

        const resolved: AddressPackTitle[] = [];
        for (const rt of recipient.titles) {
            const match = available.find(
                t => t.code === rt.code && t.system === rt.system &&
                    (!rt.gender || !t.gender || t.gender === rt.gender),
            );
            if (match) {
                resolved.push(match);
                usedCodes.push(match.code);
            } else {
                trace.push(`Title not found in packs: ${rt.system}/${rt.code}`);
            }
        }

        resolved.sort((a, b) => a.rank - b.rank);

        if (pack?.titleSuppression?.professorSuppressesDoctor) {
            const hasProf = resolved.some(t => t.code === "prof");
            if (hasProf) {
                const filtered = resolved.filter(t => t.code !== "dr");
                if (filtered.length < resolved.length) {
                    trace.push("Professor suppresses Doctor per locale rule");
                }
                return {
                    postal: filtered.map(t => t.postalAbbrev ?? t.postalForm).join(" "),
                    correspondence: filtered.map(t => t.correspondenceForm).join(" "),
                };
            }
        }

        return {
            postal: resolved.map(t => t.postalAbbrev ?? t.postalForm).join(" "),
            correspondence: resolved.map(t => t.correspondenceForm).join(" "),
        };
    }

    private resolveHonorific(recipient: AddressRecipient, pack: AddressPack | null): string {
        if (!pack) return "";
        const gender = recipient.gender ?? "unknown";
        switch (gender) {
            case "male": return pack.honorifics.male;
            case "female": return pack.honorifics.female;
            case "nonbinary": return pack.honorifics.nonBinary ?? pack.honorifics.unspecified ?? "";
            default: return pack.honorifics.unspecified ?? "";
        }
    }

    // ── Rule matching ───────────────────────────────────────────

    private collectRules(pack: AddressPack | null, protocols: ProtocolPack[]): AddressRule[] {
        const rules: AddressRule[] = [];
        for (const pp of protocols) {
            rules.push(...pp.rules);
        }
        return rules;
    }

    private matchRule(
        rules: AddressRule[],
        ctx: AddressResolveContext,
        recipient: AddressRecipient,
        trace: string[],
    ): AddressRule | null {
        const candidates = rules.filter(r => {
            const w = r.when;
            if (!w) return true;

            if (w.locale) {
                const locales = Array.isArray(w.locale) ? w.locale : [w.locale];
                if (!locales.some(l => ctx.locale.startsWith(l))) return false;
            }

            if (w.formality) {
                const formalities = Array.isArray(w.formality) ? w.formality : [w.formality];
                if (!formalities.includes(ctx.formality)) return false;
            }

            if (w.relationship) {
                const rels = Array.isArray(w.relationship) ? w.relationship : [w.relationship];
                if (ctx.relationship && !rels.includes(ctx.relationship)) return false;
            }

            if (w.audienceKind) {
                const kinds = Array.isArray(w.audienceKind) ? w.audienceKind : [w.audienceKind];
                if (!kinds.includes("single")) return false;
            }

            if (w.addressMode) {
                if (w.addressMode !== ctx.addressMode) return false;
            }

            if (w.outputForm) {
                const forms = Array.isArray(w.outputForm) ? w.outputForm : [w.outputForm];
                if (!forms.includes(ctx.outputForm)) return false;
            }

            if (w.officeRole) {
                const roles = Array.isArray(w.officeRole) ? w.officeRole : [w.officeRole];
                if (!recipient.officeRole || !roles.includes(recipient.officeRole)) return false;
            }

            if (w.titleSystem) {
                const systems = Array.isArray(w.titleSystem) ? w.titleSystem : [w.titleSystem];
                const recipientSystems = recipient.titles?.map(t => t.system) ?? [];
                if (!systems.some(s => recipientSystems.includes(s as TitleSystem))) return false;
            }

            return true;
        });

        if (candidates.length === 0) return null;

        candidates.sort((a, b) => b.priority - a.priority);
        return candidates[0];
    }

    // ── Template expansion ──────────────────────────────────────

    private getDefaultTemplate(
        pack: AddressPack | null,
        form: AddressOutputForm,
        formality: Formality,
    ): string {
        if (!pack) {
            return formality === "informal" ? "{firstName}" : "{honorific} {surname}";
        }

        if (formality === "informal" || formality === "highly informal") {
            return pack.formats.informal;
        }

        switch (form) {
            case "postal": return pack.formats.postal;
            case "letterhead": return pack.formats.letterhead;
            case "email_opening": return pack.formats.email_opening ?? pack.formats.letterhead;
            case "email_closing": return pack.formats.email_closing ?? "{surname}";
            case "salutation": return pack.formats.salutation;
        }
    }

    private buildTokenMap(
        recipient: AddressRecipient,
        honorific: string,
        titleStack: { postal: string; correspondence: string },
        ctx: AddressResolveContext,
    ): Record<string, string> {
        return {
            honorific,
            titleStack: ctx.outputForm === "postal" ? titleStack.postal : titleStack.correspondence,
            postalTitleStack: titleStack.postal,
            correspondenceTitleStack: titleStack.correspondence,
            surname: recipient.surname ?? "",
            firstName: recipient.preferredName ?? recipient.givenNames?.[0] ?? "",
            fullName: [
                ...(recipient.givenNames ?? []),
                recipient.nobilityParticle ?? "",
                recipient.surname ?? "",
            ].filter(Boolean).join(" "),
            officeTitle: recipient.officeRole ?? "",
            initials: recipient.initials ?? "",
            style: "",
            collectiveLabel: "",
        };
    }

    private applyTemplate(template: string, map: Record<string, string>): string {
        let result = template;
        for (const [key, value] of Object.entries(map)) {
            result = result.replaceAll(`{${key}}`, value);
        }
        return result.replace(/\s+/g, " ").trim();
    }

    private applyTransforms(text: string, locale: string, recipient: AddressRecipient): string {
        const hooks = this.transforms.get(locale) ?? this.transforms.get(locale.split("-")[0]) ?? [];
        if (hooks.length === 0) return text;

        const profile = {
            firstName: recipient.preferredName ?? recipient.givenNames?.[0],
            lastName: recipient.surname,
            gender: recipient.gender as any,
        };

        let result = text;
        for (const hook of hooks) {
            result = hook(result, "fullAddress", profile);
        }
        return result;
    }

    // ── Collective / pair / group ───────────────────────────────

    private resolveCollective(
        audience: AddressAudience,
        pack: AddressPack | null,
        ctx: AddressResolveContext,
        trace: string[],
    ): ResolvedAddress {
        if (audience.collectiveLabel) {
            trace.push(`Using explicit collective label: "${audience.collectiveLabel}"`);
            return {
                text: audience.collectiveLabel,
                outputForm: ctx.outputForm,
                mode: ctx.addressMode,
                audienceKind: audience.kind,
                usedRuleIds: [],
                usedTitleCodes: [],
                trace,
            };
        }

        const formula = this.findCollectiveFormula(pack, ctx.formality, audience.kind, trace);
        if (formula) {
            return {
                text: formula.text,
                outputForm: ctx.outputForm,
                mode: ctx.addressMode,
                audienceKind: audience.kind,
                usedRuleIds: [formula.id],
                usedTitleCodes: [],
                trace,
            };
        }

        trace.push("No collective formula found — falling back to generic");
        return {
            text: "",
            outputForm: ctx.outputForm,
            mode: ctx.addressMode,
            audienceKind: audience.kind,
            usedRuleIds: [],
            usedTitleCodes: [],
            trace,
        };
    }

    private resolvePair(
        audience: AddressAudience,
        pack: AddressPack | null,
        ctx: AddressResolveContext,
        trace: string[],
    ): ResolvedAddress {
        const [r1, r2] = audience.recipients;
        const honorific1 = this.resolveHonorific(r1, pack);
        const honorific2 = this.resolveHonorific(r2, pack);

        const n1 = r1.surname ?? r1.preferredName ?? "";
        const n2 = r2.surname ?? r2.preferredName ?? "";

        let text: string;
        if (n1 === n2 && n1) {
            text = `${honorific1} en ${honorific2} ${n1}`.trim();
        } else {
            text = `${honorific1} ${n1} en ${honorific2} ${n2}`.trim();
        }

        trace.push(`Pair address resolved: "${text}"`);
        return {
            text: text.replace(/\s+/g, " "),
            outputForm: ctx.outputForm,
            mode: ctx.addressMode,
            audienceKind: "pair",
            usedRuleIds: [],
            usedTitleCodes: [],
            trace,
        };
    }

    private findCollectiveFormula(
        pack: AddressPack | null,
        formality: Formality,
        kind: AudienceKind,
        trace: string[],
    ): CollectiveFormula | null {
        if (!pack?.collectiveFormulas?.length) return null;

        const exact = pack.collectiveFormulas.find(
            f => f.formality === formality && (!f.audienceKind || f.audienceKind === kind),
        );
        if (exact) {
            trace.push(`Collective formula matched: ${exact.id}`);
            return exact;
        }

        const formalFallback = pack.collectiveFormulas.find(f => f.formality === "formal");
        if (formalFallback) {
            trace.push(`Collective formula fallback: ${formalFallback.id}`);
            return formalFallback;
        }

        return null;
    }

    private emptyResult(ctx: AddressResolveContext, trace: string[]): ResolvedAddress {
        return {
            text: "",
            outputForm: ctx.outputForm,
            mode: ctx.addressMode,
            audienceKind: "single",
            usedRuleIds: [],
            usedTitleCodes: [],
            trace,
        };
    }
}

/**
 * Flattened context for address resolution calls.
 * Derived from NormalizedContext by the integration layer.
 */
export interface AddressResolveContext {
    locale: string;
    formality: Formality;
    relationship?: RelationshipContext;
    addressMode: AddressMode;
    outputForm: AddressOutputForm;
    allowSubcultureAddressing?: boolean;
    subcultures?: string[];
}
