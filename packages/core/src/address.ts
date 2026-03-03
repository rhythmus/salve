/**
 * SALVE Address Resolver
 */

import {
    AddressProfile,
    HonorificPack,
    GreetingContext
} from "./types";

export class AddressResolver {
    private honorifics: Map<string, HonorificPack> = new Map();

    /**
     * Register a localized honorific pack
     */
    public registerHonorifics(pack: HonorificPack): void {
        this.honorifics.set(pack.locale, pack);
    }

    /**
     * Resolve a localized address string for a profile
     */
    public resolve(context: GreetingContext): string {
        const { locale, formality, profile } = context;
        if (!profile) return "";

        const pack = this.getPack(locale);
        if (!pack) return this.fallbackResolve(context);

        const isFormal = formality === "formal";
        const honorific = this.getHonorific(profile, pack);

        // Construct formatting map
        const map: Record<string, string> = {
            firstName: profile.firstName || "",
            lastName: profile.lastName || "",
            honorific: honorific,
            academicTitles: profile.academicTitles?.join(" ") || "",
            role: profile.professionalRole || ""
        };

        // Concatenate academic titles with honorific for formal address
        // e.g. German: "Herr" + "Dr." -> "Herr Dr."
        const fullHonorific = [honorific, map.academicTitles]
            .filter(s => s.length > 0)
            .join(" ");

        map.fullHonorific = fullHonorific;

        const template = isFormal ? pack.formats.formal : pack.formats.informal;
        return this.applyTemplate(template, map);
    }

    private getPack(locale: string): HonorificPack | null {
        // Exact match
        if (this.honorifics.has(locale)) return this.honorifics.get(locale)!;

        // Base locale match (e.g. "de" for "de-DE")
        const base = locale.split("-")[0];
        return this.honorifics.get(base) || null;
    }

    private getHonorific(profile: AddressProfile, pack: HonorificPack): string {
        const gender = profile.gender || "unspecified";
        return pack.titles[gender] || pack.titles.unspecified || "";
    }

    private applyTemplate(template: string, map: Record<string, string>): string {
        // Very simple template expansion: replace {key} with map[key]
        let result = template;

        // Explicitly handle fullHonorific which combines honorific + academicTitles
        result = result.replace("{fullHonorific}", map.fullHonorific || "");

        for (const [key, value] of Object.entries(map)) {
            result = result.replace(`{${key}}`, value);
        }

        // Cleanup extra spaces
        return result.replace(/\s+/g, " ").trim();
    }

    private fallbackResolve(context: GreetingContext): string {
        const profile = context.profile!;
        if (context.formality === "informal") {
            return profile.firstName || "";
        }
        return profile.lastName ? `Mx. ${profile.lastName}` : (profile.firstName || "");
    }
}
