/**
 * Salve Core Types & Interfaces
 */

export interface TransformPlugin {
    id: string;
    locales: string[];
    transform(value: string, key: string, profile: AddressProfile): string;
}

export type Formality = "informal" | "formal" | "neutral";

export type GreetingPhase = "open" | "close";

export type InteractionRole = "initiator" | "responder";

export type RelationshipContext =
    | "stranger"
    | "acquaintance"
    | "friend"
    | "family"
    | "superior"
    | "subordinate";

export type InteractionSetting =
    | "direct_address"
    | "group_address"
    | "public_announcement"
    | "chat_message"
    | "email_opening"
    | "email_closing";

export type EventDomain =
    | "personal"
    | "religious"
    | "civil"
    | "temporal"
    | "cultural_baseline";

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
    domain: EventDomain;
    tradition?: string;
    priority?: number; // Optional override
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
    relationship?: RelationshipContext[];
    setting?: InteractionSetting[];
    phase?: GreetingPhase;
    role?: InteractionRole;
    eventRef?: string; // Links to a CelebrationEvent ID
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
        domain?: EventDomain;
        locale: string;
        score: number;
        trace: string[]; // For developer transparency
    };
}

/**
 * Interface for calendar resolution plugins
 */
export interface CalendarPlugin {
    id: string;
    resolveEvents(now: Date, context: GreetingContext): CelebrationEvent[];
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
 * Maps a specific date to one or more Saints
 */
export interface NameDayEntry {
    month: number; // 1-12
    day: number;
    saintQids: string[];
}

/**
 * Specific celebration result for a name-day
 */
export interface NameDayCelebration extends CelebrationEvent {
    saintQid: string;
    targetName: string;
}
