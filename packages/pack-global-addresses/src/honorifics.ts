import { HonorificPack } from "@salve/types";

/**
 * English (en) Honorific Pack
 */
export const englishHonorifics: HonorificPack = {
    locale: "en",
    titles: {
        male: "Mr.",
        female: "Ms.",
        nonBinary: "Mx.",
        unspecified: "M."
    },
    formats: {
        formal: "{fullHonorific} {lastName}",
        informal: "{firstName}",
        standard: "{firstName} {lastName}"
    }
};

/**
 * German (de) Honorific Pack
 */
export const germanHonorifics: HonorificPack = {
    locale: "de",
    titles: {
        male: "Herr",
        female: "Frau",
        nonBinary: "Mx.",
        unspecified: "M."
    },
    formats: {
        formal: "{fullHonorific} {lastName}",
        informal: "{firstName}",
        standard: "{firstName} {lastName}"
    }
};

/**
 * Greek (el) Honorific Pack
 */
export const greekHonorifics: HonorificPack = {
    locale: "el",
    titles: {
        male: "Κύριε",
        female: "Κυρία",
        nonBinary: "Mx.",
        unspecified: "M."
    },
    formats: {
        formal: "{fullHonorific} {lastName}",
        informal: "{firstName}",
        standard: "{firstName} {lastName}"
    }
};

export const globalHonorifics: HonorificPack[] = [
    englishHonorifics,
    germanHonorifics,
    greekHonorifics
];
