/**
 * AUTO-GENERATED — Do not edit manually.
 * Legacy HonorificPack objects derived from address pack data.
 * Generated from data/packs/*.address.yaml by scripts/generate-address-packs.ts
 * Generated at: 2026-03-14T15:05:24.442Z
 */

import type { HonorificPack } from "@salve/types";

export const germanHonorifics: HonorificPack = {
    locale: "de",
    titles: {
        male: "Herr",
        female: "Frau",
        nonBinary: "Mx.",
        unspecified: "M.",
    },
    formats: {
        formal: "{fullHonorific} {lastName}",
        informal: "{firstName}",
        standard: "{firstName} {lastName}",
    },
};

export const greekHonorifics: HonorificPack = {
    locale: "el",
    titles: {
        male: "Κύριε",
        female: "Κυρία",
        nonBinary: "Mx.",
        unspecified: "M.",
    },
    formats: {
        formal: "{fullHonorific} {lastName}",
        informal: "{firstName}",
        standard: "{firstName} {lastName}",
    },
};

export const englishHonorifics: HonorificPack = {
    locale: "en",
    titles: {
        male: "Mr.",
        female: "Ms.",
        nonBinary: "Mx.",
        unspecified: "M.",
    },
    formats: {
        formal: "{fullHonorific} {lastName}",
        informal: "{firstName}",
        standard: "{firstName} {lastName}",
    },
};

export const frenchHonorifics: HonorificPack = {
    locale: "fr",
    titles: {
        male: "Monsieur",
        female: "Madame",
        nonBinary: "Mx.",
        unspecified: "M.",
    },
    formats: {
        formal: "{fullHonorific} {lastName}",
        informal: "{firstName}",
        standard: "{firstName} {lastName}",
    },
};

export const dutchHonorifics: HonorificPack = {
    locale: "nl",
    titles: {
        male: "de heer",
        female: "mevrouw",
        nonBinary: "Mx.",
        unspecified: "M.",
    },
    formats: {
        formal: "{fullHonorific} {lastName}",
        informal: "{firstName}",
        standard: "{firstName} {lastName}",
    },
};

export const globalHonorifics: HonorificPack[] = [
    germanHonorifics,
    greekHonorifics,
    englishHonorifics,
    frenchHonorifics,
    dutchHonorifics,
];
