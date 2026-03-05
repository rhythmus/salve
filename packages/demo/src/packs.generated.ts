/**
 * AUTO-GENERATED — Do not edit manually.
 * Generated from data/packs/*.json by scripts/generate-demo-packs.ts
 * Generated at: 2026-03-05T21:14:47.190Z
 */

import type { GreetingPack } from "@salve/types";

export const DEMO_PACKS: GreetingPack[] = [
  {
    locale: "ar",
    greetings: [
      {
        id: "ar_eid",
        text: "عيد مبارك",
        eventRef: "eid_al_fitr",
      },
      {
        id: "ar_ramadan",
        text: "رمضان كريم",
        eventRef: "ramadan_start",
      },
      {
        id: "ar_fallback",
        text: "مرحباً",
      },
    ],
  },
  {
    locale: "de-DE",
    greetings: [
      {
        id: "de_unity",
        text: "Alles Gute zum Tag der Deutschen Einheit!",
        eventRef: "german_unity_day",
      },
      {
        id: "de_unity_formal",
        text: "Einen schönen Tag der Deutschen Einheit.",
        eventRef: "german_unity_day",
        formality: "formal" as const,
      },
      {
        id: "de_newyear",
        text: "Frohes neues Jahr!",
        eventRef: "new_year",
      },
      {
        id: "de_morning",
        text: "Guten Morgen",
        eventRef: "morning",
      },
      {
        id: "de_midday",
        text: "Mahlzeit",
        eventRef: "midday",
        formality: "informal" as const,
      },
      {
        id: "de_afternoon",
        text: "Guten Tag",
        eventRef: "afternoon",
      },
      {
        id: "de_evening",
        text: "Guten Abend",
        eventRef: "evening",
      },
      {
        id: "de_night",
        text: "Gute Nacht",
        eventRef: "night",
      },
      {
        id: "de_christmas",
        text: "Frohe Weihnachten!",
        eventRef: "christmas",
      },
      {
        id: "de_fallback",
        text: "Hallo",
      },
    ],
  },
  {
    locale: "el-GR",
    greetings: [
      {
        id: "el_morning",
        text: "Καλημέρα",
        eventRef: "morning",
      },
      {
        id: "el_afternoon",
        text: "Καλησπέρα",
        eventRef: "afternoon",
      },
      {
        id: "el_evening",
        text: "Καλησπέρα",
        eventRef: "evening",
      },
      {
        id: "el_night",
        text: "Καληνύχτα",
        eventRef: "night",
      },
      {
        id: "el_independence",
        text: "Χρόνια Πολλά!",
        eventRef: "gr_independence_day",
      },
      {
        id: "el_fallback",
        text: "Γεια σας",
      },
    ],
  },
  {
    locale: "en-GB",
    greetings: [
      {
        id: "en_morning",
        text: "Good morning",
        eventRef: "morning",
      },
      {
        id: "en_afternoon",
        text: "Good afternoon",
        eventRef: "afternoon",
      },
      {
        id: "en_evening",
        text: "Good evening",
        eventRef: "evening",
      },
      {
        id: "en_eid",
        text: "Eid Mubarak!",
        eventRef: "eid_al_fitr",
      },
      {
        id: "en_ramadan",
        text: "Ramadan Kareem!",
        eventRef: "ramadan_start",
      },
      {
        id: "en_cny",
        text: "Happy Chinese New Year!",
        eventRef: "chinese_new_year",
      },
      {
        id: "en_christmas",
        text: "Merry Christmas!",
        eventRef: "christmas",
      },
      {
        id: "en_fallback",
        text: "Hello",
      },
    ],
  },
  {
    locale: "tr-TR",
    greetings: [
      {
        id: "tr_eid",
        text: "Bayramınız kutlu olsun!",
        eventRef: "eid_al_fitr",
      },
      {
        id: "tr_ramadan",
        text: "Hayırlı Ramazanlar!",
        eventRef: "ramadan_start",
      },
      {
        id: "tr_morning",
        text: "Günaydın",
        eventRef: "morning",
      },
      {
        id: "tr_afternoon",
        text: "İyi günler",
        eventRef: "afternoon",
      },
      {
        id: "tr_fallback",
        text: "Merhaba",
      },
    ],
  },
  {
    locale: "zh-CN",
    greetings: [
      {
        id: "zh_cny",
        text: "新年快乐！",
        eventRef: "chinese_new_year",
      },
      {
        id: "zh_lantern",
        text: "元宵节快乐！",
        eventRef: "lantern_festival",
      },
      {
        id: "zh_fallback",
        text: "你好",
      },
    ],
  },
];
