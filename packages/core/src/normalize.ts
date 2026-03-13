/**
 * SALVE Context Normalization Algorithm (SCNA)
 *
 * Converts incomplete developer input into a fully normalized context
 * that the greeting engine can reliably use.
 */

import {
    SalveContextV1,
    NormalizedContext,
    SalveInteraction,
    SalveMemberships,
    SalveAffinities,
    SalvePolicy,
    SalvePerson,
    GreetingStyle,
    EventDomainV1
} from "./types";
import { resolveDayPeriod } from "./day-period";
import { buildLocaleChain } from "./locale-chain";

// ── Lookup Tables ───────────────────────────────────────────────

/** Language → default region mapping */
const DEFAULT_REGIONS: Record<string, string> = {
    nl: "NL",
    de: "DE",
    el: "GR",
    es: "ES",
    fr: "FR",
    en: "US",
    pt: "PT",
    ar: "EG",
    it: "IT",
    ja: "JP",
    ko: "KR",
    zh: "CN",
    ru: "RU",
    bg: "BG",
    tr: "TR",
    pl: "PL",
    ro: "RO",
    sv: "SE",
    da: "DK",
    fi: "FI",
    no: "NO",
    cs: "CZ",
    hu: "HU",
    hr: "HR",
    sk: "SK",
    sl: "SI",
    uk: "UA",
};

/** Region → default IANA timezone */
const DEFAULT_TIMEZONES: Record<string, string> = {
    NL: "Europe/Amsterdam",
    BE: "Europe/Brussels",
    GR: "Europe/Athens",
    DE: "Europe/Berlin",
    FR: "Europe/Paris",
    US: "America/New_York",
    GB: "Europe/London",
    ES: "Europe/Madrid",
    IT: "Europe/Rome",
    PT: "Europe/Lisbon",
    JP: "Asia/Tokyo",
    KR: "Asia/Seoul",
    CN: "Asia/Shanghai",
    RU: "Europe/Moscow",
    BG: "Europe/Sofia",
    TR: "Europe/Istanbul",
    PL: "Europe/Warsaw",
    RO: "Europe/Bucharest",
    SE: "Europe/Stockholm",
    DK: "Europe/Copenhagen",
    FI: "Europe/Helsinki",
    NO: "Europe/Oslo",
    EG: "Africa/Cairo",
};

// ── Default Policy ──────────────────────────────────────────────

const DEFAULT_ALLOWED_DOMAINS: EventDomainV1[] = [
    "bank",
    "civil",
    "personal",
    "temporal",
    "cultural_baseline",
    "seasonal",
];

const DEFAULT_POLICY: Required<SalvePolicy> = {
    allowDomains: DEFAULT_ALLOWED_DOMAINS,
    allowExtras: false,
    allowSubcultureAddressing: false,
    requireExplicitTraditionsForReligious: true,
    allowGenderInference: false,
    showEmojis: false,
    repetition: {
        windowedGreetings: false,
        maxSameRulePerDays: 3,
    },
};

// ── Default Interaction ─────────────────────────────────────────

const DEFAULT_INTERACTION: Required<SalveInteraction> = {
    phase: "encounter",
    setting: "ui",
    role: "initiator",
    relationship: "stranger",
    formality: "neutral",
    style: "neutral" as GreetingStyle,
    audienceSize: undefined as unknown as number,
};

// ── Main Normalization Function ─────────────────────────────────

import { LocationResolver } from "./location";

/**
 * Normalize a partial SalveContextV1 into a fully resolved NormalizedContext.
 */
export function normalizeContext(input: SalveContextV1, locationResolver?: LocationResolver): NormalizedContext {
    // Step 1 — Normalize locale (BCP-47 casing)
    let locale = normalizeLocale(input.env.locale);

    // Step 1.1 — Geographic locale resolution (M9.1)
    let regions: string[] = [];
    if (input.env.location && locationResolver) {
        regions = locationResolver.resolveRegions(input.env.location.lat, input.env.location.lng);
        const resolvedLocale = locationResolver.resolveLocale(input.env.location.lat, input.env.location.lng);
        if (resolvedLocale) {
            locale = resolvedLocale;
        }
    }

    // Step 2 — Derive region
    const region = input.env.region?.toUpperCase() ?? deriveRegion(locale);

    // Step 3 — Resolve output locale
    const outputLocale = input.env.outputLocale
        ? normalizeLocale(input.env.outputLocale)
        : locale;

    // Step 4 — Timezone
    const timeZone = input.env.timeZone ?? deriveTimezone(region);

    // Step 5 — Date / day period
    const now = input.env.now;
    const hour = getLocalHour(now, timeZone);
    const dayPeriod = resolveDayPeriod(hour);

    // Step 6 — Locale fallback chain
    const localeChain = buildLocaleChain(outputLocale);

    // Step 7 — Interaction defaults
    const interaction: Required<SalveInteraction> = {
        phase: input.interaction?.phase ?? DEFAULT_INTERACTION.phase,
        setting: input.interaction?.setting ?? DEFAULT_INTERACTION.setting,
        role: input.interaction?.role ?? DEFAULT_INTERACTION.role,
        relationship: input.interaction?.relationship ?? DEFAULT_INTERACTION.relationship,
        formality: input.interaction?.formality ?? DEFAULT_INTERACTION.formality,
        style: input.interaction?.style ?? DEFAULT_INTERACTION.style,
        audienceSize: input.interaction?.audienceSize ?? DEFAULT_INTERACTION.audienceSize,
    };

    // Step 8 — Person normalization
    const person = normalizePerson(input.person ?? null);

    // Step 9 — Memberships
    const memberships: Required<SalveMemberships> = {
        traditions: (input.memberships?.traditions ?? []).map((s: string) => s.toLowerCase()),
        subcultures: (input.memberships?.subcultures ?? []).map((s: string) => s.toLowerCase()),
        professions: (input.memberships?.professions ?? []).map((s: string) => s.toLowerCase()),
    };

    // Step 10 — Affinities
    const affinities: Required<SalveAffinities> = {
        locales: (input.affinities?.locales ?? []).map((s: string) => normalizeLocale(s)),
        tags: (input.affinities?.tags ?? []).map((s: string) => s.toLowerCase()),
    };

    // Step 11 — Policy
    const policy: Required<SalvePolicy> = {
        allowDomains: input.policy?.allowDomains ?? DEFAULT_POLICY.allowDomains,
        allowExtras: input.policy?.allowExtras ?? DEFAULT_POLICY.allowExtras,
        allowSubcultureAddressing: input.policy?.allowSubcultureAddressing ?? DEFAULT_POLICY.allowSubcultureAddressing,
        requireExplicitTraditionsForReligious: input.policy?.requireExplicitTraditionsForReligious ?? DEFAULT_POLICY.requireExplicitTraditionsForReligious,
        allowGenderInference: input.policy?.allowGenderInference ?? DEFAULT_POLICY.allowGenderInference,
        showEmojis: input.policy?.showEmojis ?? DEFAULT_POLICY.showEmojis,
        repetition: input.policy?.repetition ?? DEFAULT_POLICY.repetition,
    };

    return {
        env: {
            now,
            locale,
            outputLocale,
            region,
            timeZone,
            dayPeriod,
            location: input.env.location,
        },
        interaction,
        person,
        memberships,
        affinities,
        policy,
        localeChain,
        regions,
    };
}

// ── Helper Functions ────────────────────────────────────────────

/**
 * Normalize a BCP-47 locale string: language lowercase, region uppercase.
 */
function normalizeLocale(locale: string): string {
    const parts = locale.split("-");
    if (parts.length === 1) return parts[0].toLowerCase();
    return `${parts[0].toLowerCase()}-${parts.slice(1).map(p => p.toUpperCase()).join("-")}`;
}

/**
 * Derive ISO region from a BCP-47 locale string.
 */
function deriveRegion(locale: string): string {
    const parts = locale.split("-");
    if (parts.length >= 2) return parts[1].toUpperCase();
    return DEFAULT_REGIONS[parts[0].toLowerCase()] ?? "US";
}

/**
 * Derive IANA timezone from region code.
 */
function deriveTimezone(region: string): string {
    return DEFAULT_TIMEZONES[region] ?? "UTC";
}

/**
 * Get local hour for a timezone. Falls back to UTC hour if Intl is unavailable.
 */
function getLocalHour(date: Date, timeZone: string): number {
    try {
        const formatter = new Intl.DateTimeFormat("en-US", {
            timeZone,
            hour: "numeric",
            hour12: false,
        });
        const parts = formatter.formatToParts(date);
        const hourPart = parts.find(p => p.type === "hour");
        return hourPart ? parseInt(hourPart.value, 10) : date.getUTCHours();
    } catch {
        return date.getUTCHours();
    }
}

/**
 * Normalize a person profile: trim names, set defaults.
 */
function normalizePerson(person: SalvePerson | null): SalvePerson | null {
    if (!person) return null;

    const givenNames = person.givenNames?.map((n: string) => n.trim()).filter((n: string) => n.length > 0);
    const surname = person.surname?.trim() || undefined;
    const preferredName = person.preferredName?.trim() || givenNames?.[0] || undefined;

    return {
        ...person,
        givenNames: givenNames && givenNames.length > 0 ? givenNames : undefined,
        surname,
        preferredName,
        gender: person.gender ?? "unknown",
        genderSource: person.genderSource ?? (person.gender ? "explicit" : "unknown"),
        titles: person.titles?.map((t: any) => ({ ...t, code: t.code.toLowerCase() })),
    };
}
