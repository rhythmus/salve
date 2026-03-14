/**
 * Salve Core Types & Interfaces
 */

export interface TransformPlugin {
    id: string;
    locales: string[];
    transform(value: string, key: string, profile: AddressProfile): string;
}

export type Formality = "informal" | "highly informal" | "formal" | "hyperformal" | "neutral";

export type TimeOfDay = "morning" | "midday" | "afternoon" | "evening" | "night";

export type GreetingPhase = "encounter" | "parting" | "making acquaintance";

export type InteractionRole = "initiator" | "responder";

export type RelationshipContext =
    | "stranger"
    | "acquaintance"
    | "friend"
    | "family"
    | "superior"
    | "subordinate"
    | "intimate";

export type InteractionSetting =
    | "direct_address"
    | "group_address"
    | "public_announcement"
    | "chat_message"
    | "email_opening"
    | "email_closing"
    | "ui"
    | "chat"
    | "email"
    | "phone";

export type EventCategory =
    | "personal"
    | "religious"
    | "official"
    | "observance"
    | "temporal"
    | "cultural_baseline"
    | "civil";

export type EventDomain = EventCategory;

/**
 * Recipient Address Profile for formal salutations
 */
export interface AddressProfile {
    firstName?: string;
    lastName?: string;
    gender?: "male" | "female" | "nonBinary" | "unspecified";
    academicTitles?: string[];
    professionalRole?: string;
    nobilityParticle?: string;
}

/**
 * Input context for the resolution engine
 */
export interface GreetingContext {
    now: Date;
    locale: string; // BCP 47
    location?: { lat: number; lng: number };
    affiliations?: string[]; // e.g., ["orthodox", "islamic"]
    relationship?: RelationshipContext;
    setting?: InteractionSetting;
    phase?: GreetingPhase;
    role?: InteractionRole;
    formality?: Formality;
    profile?: AddressProfile;
    suppressions?: string[]; // Array of event IDs to suppress
}

/**
 * A semantic event that triggers greetings
 */
export interface CelebrationEvent {
    id: string;
    category?: EventCategory;
    domain?: string;
    tradition?: string;
    priority?: number;
    emoji?: string;
    requiredRegions?: string[];
    requiredProfessions?: string[];
    wikiDataId?: string;
    WikiData?: string;
    metadata?: Record<string, any>;
}

/**
 * A single greeting candidate from a lexicon
 */
export interface GreetingLexiconEntry {
    id: string;
    text: string;
    expectedResponse?: string;
    formality?: Formality;
    relationship?: RelationshipContext | RelationshipContext[];
    setting?: InteractionSetting | InteractionSetting[];
    phase?: GreetingPhase | GreetingPhase[];
    role?: InteractionRole;
    eventRef?: string; // Links to a CelebrationEvent ID
    timeOfDay?: TimeOfDay | TimeOfDay[];
    audienceSize?: string | number;
    locale?: string | string[];
    professions?: string[];
    emoji?: string;
    notes?: string | string[];
    sources?: string | string[];
    transliterations?: Record<string, string | string[]>;
    metadata?: Record<string, unknown>;
}

/**
 * The final output of the Salve resolution engine
 */
export interface GreetingResult {
    greeting: string;
    address?: string;
    salutation: string;
    expectedResponse?: string;
    metadata: {
        eventId?: string;
        category?: string;
        domain?: EventDomain;
        locale: string;
        score: number;
        trace: string[];
    };
}

/**
 * Interface for calendar resolution plugins
 */
export interface CalendarPlugin {
    id: string;
    resolveEvents(now: Date, context: GreetingContext): CelebrationEvent[] | Promise<CelebrationEvent[]>;
}

/**
 * Interface for anti-repetition memory providers
 */
export interface GreetingMemory {
    has(key: string): boolean;
    record(key: string, ttlMs?: number): void;
    clear(): void;
}

/**
 * Localized honorifics (Mr, Ms, Mx, etc.)
 */
export interface HonorificPack {
    locale: string;
    titles: {
        male: string;
        female: string;
        nonBinary?: string;
        unspecified?: string;
    };
    formats: {
        formal: string; // e.g. "{honorific} {lastName}"
        informal: string; // e.g. "{firstName}"
        standard: string; // e.g. "{firstName} {lastName}"
    };
}

/**
 * A collection of greetings for a locale
 */
export interface GreetingPack {
    locale: string;
    extends?: string;
    sources?: string | string[];
    greetings: GreetingLexiconEntry[];
}
/**
 * Saint definition with WikiData QID
 */
export interface SaintDefinition {
    qid: string; // e.g., "Q43431"
    canonicalName: string; // e.g., "George"
    traditions: string[]; // e.g., ["orthodox", "catholic"]
    aliases: string[]; // e.g., ["Γιώργος", "Georgios"]
}

/**
 * Maps a fixed date to one or more Saints
 */
export interface NameDayEntry {
    month: number; // 1-12
    day: number;
    saintQids: string[];
}

/**
 * A movable name-day entry resolved relative to an anchor feast (e.g. Pascha).
 * The runtime must compute the concrete date for a given year.
 */
export interface MovableNameDayEntry {
    relativeTo: "pascha";
    offset: number;
    label?: string;
    saintQids?: string[];
    names?: string[];
}

/**
 * Specific celebration result for a name-day
 */
export interface NameDayCelebration extends CelebrationEvent {
    saintQid: string;
    targetName: string;
}

// ═══════════════════════════════════════════════════════════════════
// Milestone 9 — Advanced Architecture Types
// ═══════════════════════════════════════════════════════════════════

// ── Greeting Ontology Enums ──────────────────────────────────────

/** Speech‐act type of a greeting utterance */
export type GreetingAct =
    | "salutation"
    | "valediction"
    | "welcome"
    | "congratulation"
    | "observance"
    | "acclamation"
    | "address_only"
    | "checkin"
    | "acknowledge";

/** Structural output form */
export type GreetingForm =
    | "greeting_only"
    | "address_only"
    | "salutation"
    | "email_opening"
    | "email_closing";

/** Rhetorical register / style — never inferred, always configured */
export type GreetingStyle =
    | "neutral"
    | "formal"
    | "ceremonial"
    | "liturgical"
    | "poetic"
    | "playful"
    | "archaic"
    | "bureaucratic"
    | "minimal";

/** Time-of-day period for greeting selection */
export type DayPeriod =
    | "morning"
    | "midday"
    | "afternoon"
    | "evening"
    | "night";

/** Expanded event category taxonomy (v1) */
export type EventDomainV1 =
    | "bank"
    | "civil"
    | "religious"
    | "personal"
    | "seasonal"
    | "protocol"
    | "affinity"
    | "custom"
    | "temporal"
    | "cultural_baseline"
    | "official"
    | "observance";

// ── Greeting Rule (Ontology‐Aware) ──────────────────────────────

/** Selection conditions for a greeting rule */
export interface GreetingRuleWhen {
    eventRef?: string;
    dayPeriod?: DayPeriod;
    phase?: GreetingPhase | GreetingPhase[];
    setting?: ("ui" | "chat" | "email")[];
    relationship?: RelationshipContext[];
    formality?: Formality;
    affiliationsAny?: string[];
    subculturesAny?: string[];
    professionsAny?: string[];
    audienceSize?: string | number;
}

/** A single ontology-aware greeting rule inside a pack */
export interface GreetingRule {
    id: string;
    act: GreetingAct;
    form: GreetingForm;
    style: GreetingStyle;
    priority: number;
    template: string;
    when?: GreetingRuleWhen;
    expectedResponseTemplate?: string;
    addressTemplate?: string;
    timeOfDay?: TimeOfDay | TimeOfDay[];
    audienceSize?: string;
    locale?: string | string[];
    notes?: string | string[];
    sources?: string | string[];
    transliterations?: Record<string, string>;
    metadata?: Record<string, unknown>;
}

// ── Namespaced Events ───────────────────────────────────────────

/** A namespaced event emitted by providers (salve.event.domain.region.name) */
export interface SalveEvent {
    id: string;
    kind?: EventDomainV1;
    category?: string;
    start?: string;   // ISO date
    end?: string;     // ISO date
    label?: string;
    source?: string;
    emoji?: string;
    precedence?: number;
    confidence?: number;
    wikiDataId?: string;
    requiredRegions?: string[];
    requiredProfessions?: string[];
    metadata?: Record<string, unknown>;
}

/** Entry in the Event Namespace Registry */
export interface EventRegistryEntry {
    id: string;
    path?: string;
    domain: string;
    country?: string;
    description?: string;
    scope?: string;
    aliases?: string[];
    emoji?: string;
    event?: SalveEvent;
}

// ── Context Normalization ───────────────────────────────────────

/** Memberships inferred from profile */
export interface SalveMemberships {
    traditions?: string[];
    professions?: string[];
    subcultures?: string[];
}

/** Abstract affinities (configured, not inferred) */
export interface SalveAffinities {
    locales?: string[];
    tags?: string[];
}

/** Privacy and behavioral policy */
export interface SalvePolicy {
    allowDomains?: EventDomainV1[];
    allowExtras?: boolean;
    allowSubcultureAddressing?: boolean;
    requireExplicitTraditionsForReligious?: boolean;
    allowGenderInference?: boolean;
    showEmojis?: boolean;
    repetition?: {
        windowedGreetings?: boolean;
        maxSameRulePerDays?: number;
    };
}

/** Unified input context (v1) */
export interface SalveContextV1 {
    env: SalveEnv;
    interaction?: SalveInteraction;
    person?: SalvePerson;
    memberships?: SalveMemberships;
    affinities?: SalveAffinities;
    policy?: SalvePolicy;
}

/** Title on a person profile */
export interface SalveTitle {
    system: "academic" | "civil" | "religious" | "military" | "other";
    code: string;
}

/** Person being addressed */
export interface SalvePerson {
    givenNames?: string[];
    surname?: string;
    preferredName?: string;
    gender?: "male" | "female" | "nonbinary" | "unknown";
    genderSource?: "explicit" | "inferred" | "unknown";
    titles?: SalveTitle[];
    birthday?: string;
    nameday?: {
        enabled?: boolean;
        locale?: string;
        saintIds?: string[];
    };
}

/** Result of normalizeContext */
export interface NormalizedContext {
    env: Omit<Required<SalveEnv>, "location" | "outputLocale"> & {
        dayPeriod: DayPeriod;
        location?: { lat: number; lng: number };
        outputLocale: string;
    };
    interaction: Required<SalveInteraction> & { audienceSize?: number };
    person: SalvePerson | null;
    memberships: Required<SalveMemberships>;
    affinities: Required<SalveAffinities>;
    policy: Required<SalvePolicy>;
    localeChain: string[];
    regions: string[];
}

// ── Internal Normalization Support Types ───────────────────────

export interface SalveEnv {
    now: Date;
    locale: string;
    timeZone?: string;
    location?: { lat: number; lng: number };
    outputLocale?: string;
    region?: string;
}

export interface SalveInteraction {
    phase?: GreetingPhase;
    setting?: "ui" | "chat" | "email";
    role?: "initiator" | "responder";
    relationship?: RelationshipContext;
    formality?: Formality;
    style?: GreetingStyle;
    audienceSize?: number;
}

// ── Structured Output ───────────────────────────────────────────

/** Primary greeting result */
export interface SalvePrimaryOutput {
    text: string;
    act: GreetingAct;
    eventId?: string;
    ruleId?: string;
}

/** Additional context or secondary greetings */
export interface SalveExtra {
    text: string;
    kind: "affinity" | "context" | "followup";
    eventId?: string;
    ruleId?: string;
}

/** Complete output for v1 resolution */
export interface SalveOutputV1 {
    primary: SalvePrimaryOutput;
    extras?: SalveExtra[];
    activeEvents?: SalveEvent[];
    trace: {
        candidates: SalveTraceEntry[];
        usedEvents: string[];
        normalizedContext: NormalizedContext;
    };
}

/** Debugging entry for transparency */
export interface SalveTraceEntry {
    packId?: string;
    ruleId: string;
    eventId?: string;
    score?: number;
    reasons?: string[];
    tuple?: ScoreTuple;
}

export interface ScoreTuple {
    domainRank: number;
    eventRank: number;
    packPrecedence: number;
    rulePriority: number;
    localeMatchScore: number;
    stableTieBreak?: string;
}

// ═══════════════════════════════════════════════════════════════════
// Address Protocol Architecture — v1 Types
// ═══════════════════════════════════════════════════════════════════

// ── Title Systems ───────────────────────────────────────────────

/** Institutional domain a title belongs to */
export type TitleSystem =
    | "academic"
    | "civil"
    | "judicial"
    | "diplomatic"
    | "religious"
    | "military"
    | "noble"
    | "organizational"
    | "other";

/**
 * A structured title token with locale-aware display forms.
 * Titles carry both an abbreviated postal form and a spelled-out
 * correspondence form, because these differ in many traditions
 * (e.g. postal "Prof. Dr." vs letterhead "Hooggeleerde Heer").
 */
export interface AddressTitleToken {
    system: TitleSystem;
    code: string;
    rank?: number;
    display: string;
    abbrev?: string;
    gender?: "male" | "female" | "neutral";
    number?: "singular" | "plural";
    directForm?: string;
    referenceForm?: string;
}

// ── Audience & Recipient ────────────────────────────────────────

/** Kind of audience being addressed */
export type AudienceKind = "single" | "pair" | "group" | "public" | "institution";

/** Address mode: direct speech vs third-person reference */
export type AddressMode = "direct" | "reference";

/**
 * Rendering target: determines which formatting rules apply.
 * Postal addresses use abbreviated titles ("Herrn Prof. Dr."),
 * letterhead uses correspondence forms ("Sehr geehrter Herr Professor"),
 * and salutation combines greeting + address.
 */
export type AddressOutputForm = "postal" | "letterhead" | "salutation" | "email_opening" | "email_closing";

/** One recipient in a potentially multi-person audience */
export interface AddressRecipient {
    givenNames?: string[];
    initials?: string;
    surname?: string;
    preferredName?: string;
    gender?: "male" | "female" | "nonbinary" | "unknown";
    genderSource?: "explicit" | "inferred" | "unknown";
    titles?: AddressTitleToken[];
    officeRole?: string;
    nobilityParticle?: string;
}

/** An audience of one or more recipients */
export interface AddressAudience {
    kind: AudienceKind;
    recipients: AddressRecipient[];
    collectiveLabel?: string;
}

// ── Address Rules & Patterns ────────────────────────────────────

/**
 * Selection conditions for an address formatting rule.
 * Rules are matched by locale, formality, relationship,
 * audience kind, address mode, and optional office role.
 */
export interface AddressRuleWhen {
    locale?: string | string[];
    formality?: Formality | Formality[];
    relationship?: RelationshipContext | RelationshipContext[];
    audienceKind?: AudienceKind | AudienceKind[];
    addressMode?: AddressMode;
    outputForm?: AddressOutputForm | AddressOutputForm[];
    officeRole?: string | string[];
    titleSystem?: TitleSystem | TitleSystem[];
}

/**
 * A single address formatting rule.
 * Templates use tokens like {honorific}, {titleStack}, {surname},
 * {officeTitle}, {style}, {collectiveLabel}, {firstName}.
 */
export interface AddressRule {
    id: string;
    priority: number;
    template: string;
    when?: AddressRuleWhen;
    notes?: string;
}

// ── Address Packs ───────────────────────────────────────────────

/** Locale-specific gender-keyed honorific forms */
export interface AddressHonorifics {
    male: string;
    female: string;
    nonBinary?: string;
    unspecified?: string;
}

/** Collective address formulas for groups */
export interface CollectiveFormula {
    id: string;
    formality: Formality;
    text: string;
    audienceKind?: AudienceKind;
    gender?: "male" | "female" | "mixed" | "neutral";
    notes?: string;
}

/** Title definition within a pack */
export interface AddressPackTitle {
    system: TitleSystem;
    code: string;
    rank: number;
    postalForm: string;
    correspondenceForm: string;
    postalAbbrev?: string;
    gender?: "male" | "female" | "neutral";
}

/**
 * Baseline civility address data for a locale.
 * Contains honorifics, format patterns, title definitions,
 * and collective formulas for group addressing.
 */
export interface AddressPack {
    locale: string;
    extends?: string;
    sources?: string | string[];
    honorifics: AddressHonorifics;
    formats: {
        postal: string;
        letterhead: string;
        salutation: string;
        email_opening?: string;
        email_closing?: string;
        informal: string;
    };
    titles?: AddressPackTitle[];
    collectiveFormulas?: CollectiveFormula[];
    titleSuppression?: {
        informalDropsTitles?: boolean;
        professorSuppressesDoctor?: boolean;
    };
}

/**
 * Gated institutional protocol overlay.
 * Activated only when memberships.subcultures matches
 * the requiredSubculture tag and policy allows it.
 */
export interface ProtocolPack {
    id: string;
    locale: string;
    extends?: string;
    requiredSubculture: string;
    domain: TitleSystem;
    sources?: string | string[];
    titles: AddressPackTitle[];
    rules: AddressRule[];
    notes?: string;
}

// ── Resolved Address Output ─────────────────────────────────────

/** Structured result from address resolution */
export interface ResolvedAddress {
    text: string;
    outputForm: AddressOutputForm;
    mode: AddressMode;
    audienceKind: AudienceKind;
    usedRuleIds: string[];
    usedTitleCodes: string[];
    trace: string[];
}

// ── Composition & Rendering Policy ──────────────────────────────

/** How terminal punctuation in greeting text should be handled */
export type TerminalPunctuationPolicy = "preserve" | "strip" | "move_to_end";

/** What separator to use between greeting and address */
export type SeparatorPolicy = "comma" | "space" | "newline" | "none" | "template";

/** Capitalization handling */
export type CapitalizationPolicy = "preserve" | "lowercase_address" | "sentence_case";

/**
 * Rendering policy for composing greeting + address into a
 * final salutation string.  Locale packs provide defaults;
 * developers can override at runtime.
 */
export interface SalveRenderPolicy {
    separator?: SeparatorPolicy;
    terminalPunctuation?: TerminalPunctuationPolicy;
    capitalization?: CapitalizationPolicy;
    outputForm?: AddressOutputForm;
    customTemplate?: string;
}

/**
 * Extended v1 output that includes structured address data
 * and rendering metadata alongside the primary greeting.
 */
export interface SalveOutputV1WithAddress extends SalveOutputV1 {
    address?: ResolvedAddress;
    postalAddressText?: string;
    letterheadAddressText?: string;
    fullSalutationText?: string;
    renderPolicy?: SalveRenderPolicy;
}
