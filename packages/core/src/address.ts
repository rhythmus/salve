/**
 * SALVE Address Resolver
 */

import {
    AddressProfile,
    HonorificPack,
    GreetingContext
} from "./types";

export type TransformHook = (value: string, key: string, profile: AddressProfile) => string;

export class AddressResolver {
    private honorifics: Map<string, HonorificPack> = new Map();
    private transforms: Map<string, TransformHook[]> = new Map();

    /**
     * Register a localized honorific pack
     */
    public registerHonorifics(pack: HonorificPack): void {
        this.honorifics.set(pack.locale, pack);
    }

    /**
     * Register a localized name transform hook
     */
    public registerTransform(locale: string, hook: TransformHook): void {
        const list = this.transforms.get(locale) || [];
        list.push(hook);
        this.transforms.set(locale, list);
    }

    /**
     * Resolve a localized address string for a profile
     */
    public resolve(context: GreetingContext): string {
        const { locale, formality, profile } = context;
        if (!profile) return "";

        const pack = this.getPack(locale);
        if (!pack) return this.fallbackResolve(context);

        // Safety Ladder: If no surname in formal context, drop address block
        if (formality === "formal" && !profile.lastName) {
            return "";
        }

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

        // Apply localized transforms to the map components
        const transformedMap = this.applyTransforms(locale, map, profile);

        const template = isFormal ? pack.formats.formal : pack.formats.informal;
        return this.applyTemplate(template, transformedMap);
    }

    private applyTransforms(locale: string, map: Record<string, string>, profile: AddressProfile): Record<string, string> {
        const hooks = this.getHooks(locale);
        if (hooks.length === 0) return map;

        const result = { ...map };
        for (const key of Object.keys(result)) {
            for (const hook of hooks) {
                result[key] = hook(result[key], key, profile);
            }
        }
        // The provided snippet contained unrelated code for 'filteredEvents' and 'calculateEventScore'.
        // This code has been omitted as it does not belong in this method and would cause syntax errors.
        // The commented-out log from the snippet is also omitted as it was tied to the unrelated code.
        return result;
    }

    private getHooks(locale: string): TransformHook[] {
        if (this.transforms.has(locale)) return this.transforms.get(locale)!;
        const base = locale.split("-")[0];
        return this.transforms.get(base) || [];
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

        // Replace other keys
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
