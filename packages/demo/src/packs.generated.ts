/**
 * AUTO-GENERATED — Do not edit manually.
 * Generated from data/packs/*.{greetings,regions}.{json,yaml} by scripts/generate-demo-packs.ts
 * Generated at: 2026-03-09T12:31:27.627Z
 */

import type { GreetingPack, RegionDefinition } from "@salve/types";

export const DEMO_PACKS: GreetingPack[] = [
  {
    locale: "ar",
    greetings: [
      {
        id: "ar_fallback",
        text: "مرحباً",
        notes: "General welcome / hello",
      },
      {
        id: "ar_eid_ar",
        text: "عيد مبارك",
        eventRef: "salve.event.religious.muslim.eid_al_fitr",
        locale: "ar",
        notes: "Arabic: Eid Mubarak",
      },
      {
        id: "ar_ramadan_ar",
        text: "رمضان كريم",
        eventRef: "salve.event.religious.muslim.ramadan_start",
        locale: "ar",
      },
    ],
  },
  {
    locale: "el-GR",
    greetings: [
      {
        id: "el_gr_christmas_el",
        text: "Καλά Χριστούγεννα!",
        eventRef: "salve.event.religious.christian.christmas",
        locale: "el-GR",
        formality: "neutral" as const,
        notes: "Greek: Merry Christmas",
      },
      {
        id: "el_gr_easter_el",
        text: "Χριστός Ανέστη!",
        eventRef: "salve.event.religious.christian.easter",
        locale: "el-GR",
        expectedResponse: "Αληθώς Ανέστη!",
        formality: "neutral" as const,
        notes: "Greek: Christ is Risen!",
      },
      {
        id: "el_gr_el_ya_informal",
        text: "Γεια!",
        locale: "el-GR",
        formality: "informal" as const,
        notes: "Basic 'Hi/Hello'. Often short for Γεια σου/σας.",
      },
      {
        id: "el_gr_el_ya_su",
        text: "Γεια σου!",
        locale: "el-GR",
        formality: "informal" as const,
        notes: "Informal 'Hello' to one person.",
      },
      {
        id: "el_gr_el_ya_sas",
        text: "Γεια σας!",
        locale: "el-GR",
        formality: "formal" as const,
        notes: "Formal 'Hello' to one person or informal to a group.",
      },
      {
        id: "el_gr_el_herete",
        text: "Χαίρετε!",
        locale: "el-GR",
        formality: "formal" as const,
        notes: "Polite/Formal 'Hello'. Can sound slightly old-fashioned to young people.",
      },
      {
        id: "el_gr_el_ya_bye",
        text: "Γεια!",
        locale: "el-GR",
        phase: "close",
        notes: "'Bye!'. Note: Γεια also means Hello.",
      },
      {
        id: "el_gr_el_ta_leme",
        text: "Τα λέμε!",
        locale: "el-GR",
        phase: "close",
        notes: "See you!",
      },
      {
        id: "el_gr_el_adio",
        text: "Αντίο",
        locale: "el-GR",
        formality: "formal" as const,
        phase: "close",
        notes: "Goodbye. Used for permanent or long-term separation.",
      },
      {
        id: "el_gr_el_epanidin",
        text: "Εις το επανιδείν!",
        locale: "el-GR",
        formality: "formal" as const,
        phase: "close",
        notes: "Farewell. More sophisticated version of 'See you again'.",
      },
      {
        id: "el_gr_el_morning",
        text: "Καλημέρα!",
        eventRef: "salve.event.temporal.morning",
        locale: "el-GR",
        notes: "Good morning! (Usually until 12pm)",
      },
      {
        id: "el_gr_el_afternoon",
        text: "Καλησπέρα!",
        eventRef: "salve.event.temporal.afternoon",
        locale: "el-GR",
        notes: "Good afternoon! (12pm until late evening)",
      },
      {
        id: "el_gr_el_kalo_apogevma",
        text: "Καλό απόγευμα!",
        locale: "el-GR",
        phase: "close",
        notes: "Have a good afternoon! (Used when parting)",
      },
      {
        id: "el_gr_el_kalo_vradi",
        text: "Καλό βράδυ!",
        locale: "el-GR",
        phase: "close",
        notes: "Have a good evening! (Used when parting)",
      },
      {
        id: "el_gr_el_night",
        text: "Καληνύχτα!",
        eventRef: "salve.event.temporal.night",
        locale: "el-GR",
        notes: "Goodnight!",
      },
      {
        id: "el_gr_el_onira_glika",
        text: "Όνειρα γλυκά",
        locale: "el-GR",
        formality: "informal" as const,
        notes: "Sweet dreams. Usually follows Καληνύχτα.",
      },
      {
        id: "el_gr_el_ya_hara",
        text: "Γεια χαρά!",
        locale: "el-GR",
        formality: "highly informal" as const,
        notes: "Hey! (Slang)",
      },
      {
        id: "el_gr_el_yo",
        text: "Γιο!",
        locale: "el-GR",
        formality: "highly informal" as const,
        notes: "Yo! (Slang)",
      },
      {
        id: "el_gr_el_hronia_ke_zamania",
        text: "Χρόνια και ζαμάνια!",
        locale: "el-GR",
        notes: "Long time no see!",
      },
      {
        id: "el_gr_el_hero_poli",
        text: "Χαίρω πολύ!",
        locale: "el-GR",
        notes: "Pleased to meet you!",
      },
      {
        id: "el_gr_el_harika",
        text: "Χάρηκα!",
        locale: "el-GR",
        notes: "Pleased (to have met you)!",
      },
      {
        id: "el_gr_el_herome_gnorimia",
        text: "Χαίρομαι για τη γνωριμία!",
        locale: "el-GR",
        notes: "Pleased to make your acquaintance!",
      },
      {
        id: "el_gr_el_phone_ne",
        text: "Ναι;",
        locale: "el-GR",
        setting: ["chat"],
        notes: "Answering phone: 'Yes?' (Informal)",
      },
      {
        id: "el_gr_el_phone_parakalo",
        text: "Παρακαλώ;",
        locale: "el-GR",
        setting: ["chat"],
        notes: "Answering phone: 'Please?' (Universal)",
      },
      {
        id: "el_gr_el_phone_legete",
        text: "Λέγετε",
        locale: "el-GR",
        setting: ["chat"],
        notes: "Answering phone: 'Speak' (Standard)",
      },
      {
        id: "el_gr_el_independence",
        text: "Χρόνια Πολλά!",
        eventRef: "salve.event.civil.national.gr.independence_day",
        locale: "el-GR",
        notes: "Greek Independence Day / Anniversary. Literal: 'Many years!'",
      },
      {
        id: "el_gr_el_fallback",
        text: "Γεια σας",
        locale: "el-GR",
        notes: "Standard respectful greeting.",
      },
      {
        id: "el_latn_ya",
        text: "Ya!",
        locale: "el-Latn",
        formality: "informal" as const,
      },
      {
        id: "el_latn_ya_su",
        text: "Ya su!",
        locale: "el-Latn",
        formality: "informal" as const,
      },
      {
        id: "el_latn_ya_sas",
        text: "Ya sas!",
        locale: "el-Latn",
        formality: "formal" as const,
      },
      {
        id: "el_latn_kalimera",
        text: "Kalimera!",
        eventRef: "salve.event.temporal.morning",
        locale: "el-Latn",
      },
      {
        id: "el_latn_kalispera",
        text: "Kalispera!",
        eventRef: "salve.event.temporal.afternoon",
        locale: "el-Latn",
      },
      {
        id: "el_latn_kalinihta",
        text: "Kaliníhta!",
        eventRef: "salve.event.temporal.night",
        locale: "el-Latn",
      },
      {
        id: "el_latn_ta_leme",
        text: "Ta leme!",
        locale: "el-Latn",
        phase: "close",
      },
      {
        id: "el_latn_adio",
        text: "Adio",
        locale: "el-Latn",
        phase: "close",
      },
      {
        id: "el_latn_harika",
        text: "Harika!",
        locale: "el-Latn",
        notes: "Pleased to meet you",
      },
    ],
  },
  {
    locale: "el-Latn",
    greetings: [
      {
        id: "el_latn_christmas_el_latn",
        text: "Kala Christougenna!",
        eventRef: "salve.event.religious.christian.christmas",
        locale: "el-Latn",
        formality: "neutral" as const,
        notes: "Greek (Transliterated): Merry Christmas",
      },
      {
        id: "el_latn_easter_el_latn",
        text: "Christos Anesti!",
        eventRef: "salve.event.religious.christian.easter",
        locale: "el-Latn",
        expectedResponse: "Alithos Anesti!",
        formality: "neutral" as const,
        notes: "Greek (Transliterated): Christ is Risen!",
      },
    ],
  },
  {
    locale: "nl",
    greetings: [
      {
        id: "nl_christmas_nl",
        text: "Zalig Kerstmis!",
        eventRef: "salve.event.religious.christian.christmas",
        locale: "nl",
        formality: "neutral" as const,
        notes: "Dutch: Blessed Christmas",
      },
      {
        id: "nl_easter_nl",
        text: "Zalig Pasen!",
        eventRef: "salve.event.religious.christian.easter",
        locale: "nl",
        formality: "neutral" as const,
        notes: "General Dutch Easter greeting",
      },
      {
        id: "nl_easter_nl_orthodox",
        text: "Christus is verrezen!",
        eventRef: "salve.event.religious.christian.easter",
        locale: "nl",
        expectedResponse: "Hij is waarlijk verrezen!",
        formality: "neutral" as const,
        notes: "Dutch Eastern Orthodox Easter greeting",
      },
      {
        id: "nl_welkom",
        text: "Welkom",
        phase: "open",
        notes: "een ontvangende groet",
      },
      {
        id: "nl_greeter_heet_u_welkom",
        text: "{greeter} heet u welkom",
        phase: "open",
        notes: "meestal schriftelijk (op borden e.d.), met een anders verouderde betekenis van heten (benoemen, bevelen, wensen, niet als gewoon genoemd worden)",
        sources: "https://nl.wikipedia.org/wiki/Groet_(etiquette)#Nederlandstalige_verbale_begroetingen",
      },
      {
        id: "nl_weest_welgekomen",
        text: "Weest welgekomen",
        formality: "hyperformal" as const,
        phase: "open",
      },
      {
        id: "nl_goedendag_1",
        text: "Goedendag",
        timeOfDay: ["morning", "midday", "afternoon"],
        formality: "formal" as const,
        phase: "open",
        notes: "Een algemene begroeting met een middeleeuws verleden toen zij voluit luidde: God geve u een goede dag! Met 'goeder dag' werd 'geluk' bedoeld",
        sources: "https://nl.wikipedia.org/wiki/Groet_(etiquette)#Nederlandstalige_verbale_begroetingen",
      },
      {
        id: "nl_goeiendag_2",
        text: "Goeiendag",
        timeOfDay: ["morning", "midday", "afternoon"],
        formality: "formal" as const,
        phase: "open",
        notes: "Een algemene begroeting met een middeleeuws verleden toen zij voluit luidde: God geve u een goede dag! Met 'goeder dag' werd 'geluk' bedoeld",
        sources: "https://nl.wikipedia.org/wiki/Groet_(etiquette)#Nederlandstalige_verbale_begroetingen",
      },
      {
        id: "nl_hallo_1",
        text: "Hallo",
        formality: "informal" as const,
        phase: "open",
      },
      {
        id: "nl_dag_2",
        text: "Dag",
        formality: "informal" as const,
        phase: "open",
      },
      {
        id: "nl_gedag_1",
        text: "Gedag",
        formality: "highly informal" as const,
        phase: "open",
        sources: "https://nl.wikipedia.org/wiki/Groet_(etiquette)#Nederlandstalige_verbale_begroetingen",
      },
      {
        id: "nl_daag_2",
        text: "Daag",
        formality: "highly informal" as const,
        phase: "open",
        sources: "https://nl.wikipedia.org/wiki/Groet_(etiquette)#Nederlandstalige_verbale_begroetingen",
      },
      {
        id: "nl_hoi_3",
        text: "Hoi",
        formality: "highly informal" as const,
        phase: "open",
        sources: "https://nl.wikipedia.org/wiki/Groet_(etiquette)#Nederlandstalige_verbale_begroetingen",
      },
      {
        id: "nl_he_4",
        text: "Hé",
        formality: "highly informal" as const,
        phase: "open",
        sources: "https://nl.wikipedia.org/wiki/Groet_(etiquette)#Nederlandstalige_verbale_begroetingen",
      },
      {
        id: "nl_hey_5",
        text: "Hey",
        formality: "highly informal" as const,
        phase: "open",
        sources: "https://nl.wikipedia.org/wiki/Groet_(etiquette)#Nederlandstalige_verbale_begroetingen",
      },
      {
        id: "nl_dag_allemaal_1",
        text: "Dag allemaal!",
        audienceSize: ">4",
        phase: "open",
      },
      {
        id: "nl_dag_iedereen_2",
        text: "Dag iedereen!",
        audienceSize: ">4",
        phase: "open",
      },
      {
        id: "nl_hallo_allemaal_3",
        text: "Hallo allemaal!",
        audienceSize: ">4",
        phase: "open",
      },
      {
        id: "nl_hallo_iedereen_4",
        text: "Hallo iedereen!",
        audienceSize: ">4",
        phase: "open",
      },
      {
        id: "nl_goedemorgen",
        text: "Goedemorgen",
        timeOfDay: "morning",
        formality: "formal" as const,
        phase: "open",
      },
      {
        id: "nl_goeiemorgen",
        text: "Goeiemorgen",
        timeOfDay: "morning",
        formality: "informal" as const,
        phase: "open",
      },
      {
        id: "nl_goedemiddag",
        text: "Goedemiddag",
        timeOfDay: ["midday", "afternoon"],
        formality: "formal" as const,
        phase: "open",
      },
      {
        id: "nl_goeiemiddag",
        text: "Goeiemiddag",
        timeOfDay: ["midday", "afternoon"],
        formality: "informal" as const,
        phase: "open",
      },
      {
        id: "nl_goedenavond",
        text: "Goedenavond",
        timeOfDay: "evening",
        formality: "formal" as const,
        phase: "open",
      },
      {
        id: "nl_goeieavond",
        text: "Goeieavond",
        timeOfDay: "evening",
        formality: "informal" as const,
        phase: "open",
      },
      {
        id: "nl_goedenacht",
        text: "Goedenacht",
        timeOfDay: "night",
        formality: "formal" as const,
        phase: "open",
      },
      {
        id: "nl_goeienacht",
        text: "Goeienacht",
        timeOfDay: "night",
        formality: "informal" as const,
        phase: "open",
      },
      {
        id: "nl_een_fijne_dag_nog",
        text: "Een fijne dag nog",
        phase: "close",
      },
      {
        id: "nl_tot_ziens",
        text: "Tot ziens",
        phase: "close",
        notes: "Alternatieven: Doeg, Doei, Later, Aju",
      },
      {
        id: "nl_vaarwel",
        text: "Vaarwel",
        phase: "close",
        notes: "enigszins formele afscheidsgroet, bijvoorbeeld bij de marine",
      },
      {
        id: "nl_welterusten",
        text: "Welterusten",
        timeOfDay: "night",
        phase: "close",
      },
      {
        id: "nl_hoogachtend",
        text: "Hoogachtend",
        setting: ["email_closing"],
        notes: "formeel en schriftelijk, boven de handtekening op een brief",
      },
      {
        id: "nl_met_collegiale_groet_1",
        text: "Met collegiale groet",
        formality: "formal" as const,
        relationship: ["subordinate", "superior"],
        setting: ["email_closing"],
        notes: "between colleagues",
      },
      {
        id: "nl_met_collegiale_groeten_2",
        text: "Met collegiale groeten",
        formality: "formal" as const,
        relationship: ["subordinate", "superior"],
        setting: ["email_closing"],
        notes: "between colleagues",
      },
      {
        id: "nl_collegiale_groeten_3",
        text: "Collegiale groeten",
        formality: "formal" as const,
        relationship: ["subordinate", "superior"],
        setting: ["email_closing"],
        notes: "between colleagues",
      },
      {
        id: "nl_collegiale_groet_4",
        text: "Collegiale groet",
        formality: "formal" as const,
        relationship: ["subordinate", "superior"],
        setting: ["email_closing"],
        notes: "between colleagues",
      },
      {
        id: "nl_met_vriendelijke_groet_1",
        text: "Met vriendelijke groet",
        setting: ["email_closing"],
      },
      {
        id: "nl_met_vriendelijke_groeten_2",
        text: "Met vriendelijke groeten",
        setting: ["email_closing"],
      },
      {
        id: "nl_vriendelijke_groeten_3",
        text: "Vriendelijke groeten",
        setting: ["email_closing"],
      },
      {
        id: "nl_vriendelijke_groet_4",
        text: "Vriendelijke groet",
        setting: ["email_closing"],
      },
      {
        id: "nl_met_beleefde_groeten_1",
        text: "Met beleefde groeten",
        setting: ["email_closing"],
      },
      {
        id: "nl_met_beleefde_groet_2",
        text: "Met beleefde groet",
        setting: ["email_closing"],
      },
      {
        id: "li_nl_x_kerkraads_adiee_wa",
        text: "Adieë wa",
        locale: "li-NL-x-kerkraads",
        formality: "highly informal" as const,
        phase: "close",
        notes: "regionale (uit het Kerkraads dialect afkomstig) Limburgse afscheidsgroet, veel gebruikt in Zuid-Limburg",
        sources: "https://nl.wikipedia.org/wiki/Groet_(etiquette)#Nederlandstalige_verbale_begroetingen",
      },
      {
        id: "nl_be_ajiu_1",
        text: "Ajiu",
        locale: "nl-BE",
        formality: "highly informal" as const,
        notes: "informele verbastering van àdieu",
        sources: "https://nl.wikipedia.org/wiki/Groet_(etiquette)#Nederlandstalige_verbale_begroetingen",
      },
      {
        id: "nl_be_ajuus_2",
        text: "Ajuus",
        locale: "nl-BE",
        formality: "highly informal" as const,
        notes: "informele verbastering van àdieu",
        sources: "https://nl.wikipedia.org/wiki/Groet_(etiquette)#Nederlandstalige_verbale_begroetingen",
      },
      {
        id: "nl_nl_x_zaans_doeg",
        text: "Doeg",
        locale: "nl-NL-x-zaans",
        formality: "highly informal" as const,
        notes: "regionale afscheidsgroet, veel gebruikt in de Zaanstreek",
        sources: "https://nl.wikipedia.org/wiki/Groet_(etiquette)#Nederlandstalige_verbale_begroetingen",
      },
      {
        id: "nl_be_x_oostvlaams_dzjuir",
        text: "Dzjuir",
        locale: "nl-BE-x-oostvlaams",
        formality: "highly informal" as const,
        notes: "centraal Oost-Vlaamse verbastering van het Franse Bonjour",
        sources: "https://nl.wikipedia.org/wiki/Groet_(etiquette)#Nederlandstalige_verbale_begroetingen",
      },
      {
        id: "li_haije_1",
        text: "Haije",
        locale: "li",
        formality: "highly informal" as const,
        phase: "close",
        notes: "regionale Limburgse afscheidsgroet",
        sources: "https://nl.wikipedia.org/wiki/Groet_(etiquette)#Nederlandstalige_verbale_begroetingen",
      },
      {
        id: "li_haije_wah_2",
        text: "Haije wah",
        locale: "li",
        formality: "highly informal" as const,
        phase: "close",
        notes: "regionale Limburgse afscheidsgroet",
        sources: "https://nl.wikipedia.org/wiki/Groet_(etiquette)#Nederlandstalige_verbale_begroetingen",
      },
      {
        id: "li_nl_houje",
        text: "Houje",
        locale: ["li-NL", "nl-NL-x-brabants"],
        formality: "highly informal" as const,
        notes: "rondom Nijmegen gebruikt men meestal Houje, als mengvorm tussen Brabants en Limburgs",
        sources: "https://nl.wikipedia.org/wiki/Groet_(etiquette)#Nederlandstalige_verbale_begroetingen",
      },
      {
        id: "fy_nl_harre_1",
        text: "Harre",
        locale: "fy-NL",
        formality: "highly informal" as const,
        notes: "in delen van Friesland",
        sources: "https://nl.wikipedia.org/wiki/Groet_(etiquette)#Nederlandstalige_verbale_begroetingen",
      },
      {
        id: "fy_nl_ha_goeie_2",
        text: "Ha goeie",
        locale: "fy-NL",
        formality: "highly informal" as const,
        notes: "in delen van Friesland",
        sources: "https://nl.wikipedia.org/wiki/Groet_(etiquette)#Nederlandstalige_verbale_begroetingen",
      },
      {
        id: "nl_nl_x_brabants_houdoe",
        text: "Houdoe",
        locale: ["nl-NL-x-brabants", "nds-NL-x-gelders"],
        formality: "highly informal" as const,
        phase: "close",
        notes: "regionale afscheidsgroet in Noord-Brabant en het zuiden van Gelderland",
        sources: "https://nl.wikipedia.org/wiki/Groet_(etiquette)#Nederlandstalige_verbale_begroetingen",
      },
      {
        id: "nl_joehoe",
        text: "Joehoe",
        formality: "highly informal" as const,
        notes: "een uitroep om iemands aandacht te krijgen tijdens de begroeting",
        sources: "https://nl.wikipedia.org/wiki/Groet_(etiquette)#Nederlandstalige_verbale_begroetingen",
      },
      {
        id: "nl_nl_x_rijnmond_milguh_1",
        text: "Milguh",
        locale: "nl-NL-x-rijnmond",
        formality: "highly informal" as const,
        notes: "regionale groet bij jongeren uit de regio Rijnmond (verbastering van het woord Môguh)",
        sources: "https://nl.wikipedia.org/wiki/Groet_(etiquette)#Nederlandstalige_verbale_begroetingen",
      },
      {
        id: "nl_nl_x_rijnmond_mellguh_2",
        text: "Mellguh",
        locale: "nl-NL-x-rijnmond",
        formality: "highly informal" as const,
        notes: "regionale groet bij jongeren uit de regio Rijnmond (verbastering van het woord Môguh)",
        sources: "https://nl.wikipedia.org/wiki/Groet_(etiquette)#Nederlandstalige_verbale_begroetingen",
      },
      {
        id: "nl_moaj",
        text: "Moaj",
        formality: "highly informal" as const,
        notes: "regionale groet in West-Friesland (waarschijnlijk afkomstig uit het Nedersaksisch)",
        sources: "https://nl.wikipedia.org/wiki/Groet_(etiquette)#Nederlandstalige_verbale_begroetingen",
      },
      {
        id: "nl_nl_x_westland_moh_1",
        text: "Môh",
        locale: "nl-NL-x-westland",
        formality: "highly informal" as const,
        notes: "West-Nederland, Westland",
        sources: "https://nl.wikipedia.org/wiki/Groet_(etiquette)#Nederlandstalige_verbale_begroetingen",
      },
      {
        id: "nl_nl_x_westland_moguh_2",
        text: "Môguh",
        locale: "nl-NL-x-westland",
        formality: "highly informal" as const,
        notes: "West-Nederland, Westland",
        sources: "https://nl.wikipedia.org/wiki/Groet_(etiquette)#Nederlandstalige_verbale_begroetingen",
      },
      {
        id: "nl_nl_noordoost_moi",
        text: "Moi",
        locale: "nl-NL-noordoost",
        formality: "highly informal" as const,
        notes: "regionale groet in Noord- en Oostelijk Nederland en goedgaon bij het afscheid",
        sources: "https://nl.wikipedia.org/wiki/Groet_(etiquette)#Nederlandstalige_verbale_begroetingen",
      },
      {
        id: "nl_morrie",
        text: "Morrie",
        formality: "highly informal" as const,
        notes: "regionale groet in West-Friesland",
        sources: "https://nl.wikipedia.org/wiki/Groet_(etiquette)#Nederlandstalige_verbale_begroetingen",
      },
      {
        id: "fy_nl_no_heui",
        text: "No heui",
        locale: "fy-NL",
        formality: "highly informal" as const,
        notes: "regionale groet in West-Friesland",
        sources: "https://nl.wikipedia.org/wiki/Groet_(etiquette)#Nederlandstalige_verbale_begroetingen",
      },
      {
        id: "nl_be_x_antwerps_salut_1",
        text: "Salut",
        locale: ["nl-BE-x-antwerps", "nl-BE-x-kempens", "nl-BE-x-mechels", "nl-BE-x-leuvens"],
        formality: "highly informal" as const,
        notes: "Vlaamse en (oost) Zeeuws-Vlaamse afscheidsgroet (afkomstig uit het Frans)",
        sources: "https://nl.wikipedia.org/wiki/Groet_(etiquette)#Nederlandstalige_verbale_begroetingen",
      },
      {
        id: "nl_be_x_antwerps_salukes_2",
        text: "Salukes",
        locale: ["nl-BE-x-antwerps", "nl-BE-x-kempens", "nl-BE-x-mechels", "nl-BE-x-leuvens"],
        formality: "highly informal" as const,
        notes: "Vlaamse en (oost) Zeeuws-Vlaamse afscheidsgroet (afkomstig uit het Frans)",
        sources: "https://nl.wikipedia.org/wiki/Groet_(etiquette)#Nederlandstalige_verbale_begroetingen",
      },
      {
        id: "nl_nl_tjeu_1",
        text: "Tjeu",
        locale: "nl-NL",
        formality: "highly informal" as const,
        phase: "close",
        notes: "bij afscheid (lokaal)",
        sources: "https://nl.wikipedia.org/wiki/Groet_(etiquette)#Nederlandstalige_verbale_begroetingen",
      },
      {
        id: "nl_nl_tjo_2",
        text: "Tjo",
        locale: "nl-NL",
        formality: "highly informal" as const,
        phase: "close",
        notes: "bij afscheid (lokaal)",
        sources: "https://nl.wikipedia.org/wiki/Groet_(etiquette)#Nederlandstalige_verbale_begroetingen",
      },
      {
        id: "nl_nl_jo_3",
        text: "Jo",
        locale: "nl-NL",
        formality: "highly informal" as const,
        phase: "close",
        notes: "bij afscheid (lokaal)",
        sources: "https://nl.wikipedia.org/wiki/Groet_(etiquette)#Nederlandstalige_verbale_begroetingen",
      },
      {
        id: "nl_nl_mazzel_4",
        text: "Mazzel",
        locale: "nl-NL",
        formality: "highly informal" as const,
        phase: "close",
        notes: "bij afscheid (lokaal)",
        sources: "https://nl.wikipedia.org/wiki/Groet_(etiquette)#Nederlandstalige_verbale_begroetingen",
      },
      {
        id: "nl_nl_de_mazzel_5",
        text: "de mazzel",
        locale: "nl-NL",
        formality: "highly informal" as const,
        phase: "close",
        notes: "bij afscheid (lokaal)",
        sources: "https://nl.wikipedia.org/wiki/Groet_(etiquette)#Nederlandstalige_verbale_begroetingen",
      },
      {
        id: "nl_be_x_aalsters_zjeur",
        text: "Zjeur",
        locale: "nl-BE-x-aalsters",
        formality: "highly informal" as const,
        notes: "Aalsters: informele verbastering van het Franse Bonjour",
        sources: "https://nl.wikipedia.org/wiki/Groet_(etiquette)#Nederlandstalige_verbale_begroetingen",
      },
    ],
  },
  {
    locale: "en-GB",
    greetings: [
      {
        id: "en_gb_christmas_en",
        text: "Merry Christmas!",
        eventRef: "salve.event.religious.christian.christmas",
        locale: "en-GB",
        formality: "neutral" as const,
      },
      {
        id: "en_gb_easter_en",
        text: "Happy Easter!",
        eventRef: "salve.event.religious.christian.easter",
        locale: "en-GB",
        formality: "neutral" as const,
      },
      {
        id: "en_gb_easter_en_orthodox",
        text: "Christ is Risen!",
        eventRef: "salve.event.religious.christian.easter",
        locale: "en-GB",
        expectedResponse: "Indeed, He is Risen!",
        formality: "neutral" as const,
        notes: "English Eastern Orthodox Easter greeting",
      },
      {
        id: "en_gb_en_morning",
        text: "Good morning",
        eventRef: "salve.event.temporal.morning",
      },
      {
        id: "en_gb_en_afternoon",
        text: "Good afternoon",
        eventRef: "salve.event.temporal.afternoon",
      },
      {
        id: "en_gb_en_evening",
        text: "Good evening",
        eventRef: "salve.event.temporal.evening",
      },
      {
        id: "en_gb_en_fallback",
        text: "Hello",
      },
      {
        id: "en_gb_eid_en",
        text: "Eid Mubarak!",
        eventRef: "salve.event.religious.muslim.eid_al_fitr",
        locale: "en-GB",
      },
      {
        id: "en_gb_ramadan_en",
        text: "Ramadan Kareem!",
        eventRef: "salve.event.religious.muslim.ramadan_start",
        locale: "en-GB",
      },
      {
        id: "en_gb_cny_en",
        text: "Happy Chinese New Year!",
        eventRef: "salve.event.civil.secular.chinese_new_year",
        locale: "en-GB",
      },
    ],
  },
  {
    locale: "de-DE",
    greetings: [
      {
        id: "de_de_christmas_de",
        text: "Frohe Weihnachten!",
        eventRef: "salve.event.religious.christian.christmas",
        locale: "de-DE",
        formality: "neutral" as const,
      },
      {
        id: "de_de_easter_de",
        text: "Frohe Ostern!",
        eventRef: "salve.event.religious.christian.easter",
        locale: "de-DE",
        formality: "neutral" as const,
        notes: "German: Happy Easter",
      },
      {
        id: "de_de_de_unity",
        text: "Alles Gute zum Tag der Deutschen Einheit!",
        eventRef: "salve.event.civil.national.de.unity_day",
        notes: "German Unity Day",
      },
      {
        id: "de_de_de_unity_formal",
        text: "Einen schönen Tag der Deutschen Einheit.",
        eventRef: "salve.event.civil.national.de.unity_day",
        formality: "formal" as const,
      },
      {
        id: "de_de_de_newyear",
        text: "Frohes neues Jahr!",
        eventRef: "salve.event.temporal.new_year",
      },
      {
        id: "de_de_de_morning",
        text: "Guten Morgen",
        eventRef: "salve.event.temporal.morning",
      },
      {
        id: "de_de_de_midday",
        text: "Mahlzeit",
        eventRef: "salve.event.temporal.midday",
        formality: "informal" as const,
      },
      {
        id: "de_de_de_afternoon",
        text: "Guten Tag",
        eventRef: "salve.event.temporal.afternoon",
      },
      {
        id: "de_de_de_evening",
        text: "Guten Abend",
        eventRef: "salve.event.temporal.evening",
      },
      {
        id: "de_de_de_night",
        text: "Gute Nacht",
        eventRef: "salve.event.temporal.night",
      },
      {
        id: "de_de_de_fallback",
        text: "Hallo",
      },
    ],
  },
  {
    locale: "tr-TR",
    greetings: [
      {
        id: "tr_tr_eid_tr",
        text: "Bayramınız kutlu olsun!",
        eventRef: "salve.event.religious.muslim.eid_al_fitr",
        locale: "tr-TR",
        notes: "Turkish: Holiday greetings",
      },
      {
        id: "tr_tr_ramadan_tr",
        text: "Hayırlı Ramazanlar!",
        eventRef: "salve.event.religious.muslim.ramadan_start",
        locale: "tr-TR",
      },
      {
        id: "tr_tr_tr_morning",
        text: "Günaydın",
        eventRef: "salve.event.temporal.morning",
      },
      {
        id: "tr_tr_tr_afternoon",
        text: "İyi günler",
        eventRef: "salve.event.temporal.afternoon",
      },
      {
        id: "tr_tr_tr_fallback",
        text: "Merhaba",
      },
    ],
  },
  {
    locale: "zh-CN",
    greetings: [
      {
        id: "zh_cn_cny_zh",
        text: "新年快乐！",
        eventRef: "salve.event.civil.secular.chinese_new_year",
        locale: "zh-CN",
      },
      {
        id: "zh_cn_lantern_zh",
        text: "元宵节快乐！",
        eventRef: "salve.event.civil.secular.lantern_festival",
        locale: "zh-CN",
      },
      {
        id: "zh_cn_zh_fallback",
        text: "你好",
        notes: "General welcome / hello",
      },
    ],
  },
];

export const DEMO_REGIONS: RegionDefinition[] = [
  {
    "id": "grc_macro",
    "name": "Greece",
    "locale": "el-GR",
    "priority": 100,
    "polygon": [
      [
        41.8,
        19.3
      ],
      [
        41.8,
        28.5
      ],
      [
        34.7,
        28.5
      ],
      [
        34.7,
        19.3
      ],
      [
        41.8,
        19.3
      ]
    ]
  },
  {
    "id": "nld_macro",
    "name": "Dutch speaking area (NL + BE-vls)",
    "locale": "nl",
    "priority": 100,
    "polygon": [
      [
        53.6,
        2.5
      ],
      [
        53.6,
        7.2
      ],
      [
        50.7,
        7.2
      ],
      [
        50.7,
        2.5
      ],
      [
        53.6,
        2.5
      ]
    ]
  },
  {
    "id": "vls_macro",
    "name": "Flanders (Belgium)",
    "locale": "nl-BE",
    "priority": 80,
    "polygon": [
      [
        51.5,
        2.5
      ],
      [
        51.5,
        5.9
      ],
      [
        50.7,
        5.9
      ],
      [
        50.7,
        2.5
      ],
      [
        51.5,
        2.5
      ]
    ]
  },
  {
    "id": "nld_brabant",
    "name": "North Brabant (Netherlands)",
    "locale": "nl-NL-x-brabants",
    "priority": 50,
    "polygon": [
      [
        51.8,
        4.3
      ],
      [
        51.8,
        6.1
      ],
      [
        51.3,
        6.1
      ],
      [
        51.3,
        4.3
      ],
      [
        51.8,
        4.3
      ]
    ]
  },
  {
    "id": "nld_friesland",
    "name": "Friesland (Netherlands)",
    "locale": "fy-NL",
    "priority": 50,
    "polygon": [
      [
        53.5,
        5.2
      ],
      [
        53.5,
        6.3
      ],
      [
        52.8,
        6.3
      ],
      [
        52.8,
        5.2
      ],
      [
        53.5,
        5.2
      ]
    ]
  },
  {
    "id": "nld_noordoost",
    "name": "Northeast Netherlands",
    "locale": "nl-NL-noordoost",
    "priority": 50,
    "polygon": [
      [
        53.6,
        6
      ],
      [
        53.6,
        7.2
      ],
      [
        52.4,
        7.2
      ],
      [
        52.4,
        6
      ],
      [
        53.6,
        6
      ]
    ]
  },
  {
    "id": "limburg_macro",
    "name": "Limburg (BE + NL)",
    "locale": "li",
    "priority": 80,
    "polygon": [
      [
        51.8,
        5.1
      ],
      [
        51.8,
        6.2
      ],
      [
        50.7,
        6.2
      ],
      [
        50.7,
        5.1
      ],
      [
        51.8,
        5.1
      ]
    ]
  },
  {
    "id": "limburg_nl",
    "name": "Dutch Limburg",
    "locale": "li-NL",
    "priority": 50,
    "polygon": [
      [
        51.8,
        5.6
      ],
      [
        51.8,
        6.2
      ],
      [
        50.7,
        6.2
      ],
      [
        50.7,
        5.6
      ],
      [
        51.8,
        5.6
      ]
    ]
  },
  {
    "id": "be_oostvlaams",
    "name": "East Flanders",
    "locale": "nl-BE-x-oostvlaams",
    "priority": 50,
    "polygon": [
      [
        51.4,
        3.3
      ],
      [
        51.4,
        4.2
      ],
      [
        50.7,
        4.2
      ],
      [
        50.7,
        3.3
      ],
      [
        51.4,
        3.3
      ]
    ]
  },
  {
    "id": "be_antwerpen",
    "name": "Antwerp (Region)",
    "locale": "nl-BE-x-antwerps",
    "priority": 50,
    "polygon": [
      [
        51.5,
        4.1
      ],
      [
        51.5,
        4.9
      ],
      [
        51,
        4.9
      ],
      [
        51,
        4.1
      ],
      [
        51.5,
        4.1
      ]
    ]
  },
  {
    "id": "be_kempen",
    "name": "De Kempen",
    "locale": "nl-BE-x-kempens",
    "priority": 40,
    "polygon": [
      [
        51.4,
        4.7
      ],
      [
        51.4,
        5.3
      ],
      [
        51.1,
        5.3
      ],
      [
        51.1,
        4.7
      ],
      [
        51.4,
        4.7
      ]
    ]
  },
  {
    "id": "be_mechelen",
    "name": "Mechelen",
    "locale": "nl-BE-x-mechels",
    "priority": 30,
    "polygon": [
      [
        51.1,
        4.4
      ],
      [
        51.1,
        4.6
      ],
      [
        51,
        4.6
      ],
      [
        51,
        4.4
      ],
      [
        51.1,
        4.4
      ]
    ]
  },
  {
    "id": "be_leuven",
    "name": "Leuven",
    "locale": "nl-BE-x-leuvens",
    "priority": 30,
    "polygon": [
      [
        50.9,
        4.6
      ],
      [
        50.9,
        4.8
      ],
      [
        50.8,
        4.8
      ],
      [
        50.8,
        4.6
      ],
      [
        50.9,
        4.6
      ]
    ]
  },
  {
    "id": "nld_westland",
    "name": "Westland (Netherlands)",
    "locale": "nl-NL-x-westland",
    "priority": 5,
    "polygon": [
      [
        52.1,
        4.1
      ],
      [
        52.1,
        4.4
      ],
      [
        51.9,
        4.4
      ],
      [
        51.9,
        4.1
      ],
      [
        52.1,
        4.1
      ]
    ]
  },
  {
    "id": "nld_gelders",
    "name": "Gelders",
    "locale": "nds-NL-x-gelders",
    "priority": 50,
    "polygon": [
      [
        52.3,
        5.3
      ],
      [
        52.3,
        6.8
      ],
      [
        51.8,
        6.8
      ],
      [
        51.8,
        5.3
      ],
      [
        52.3,
        5.3
      ]
    ]
  },
  {
    "id": "li_kerkrade",
    "name": "Kerkrade (Limburg)",
    "locale": "li-NL-x-kerkraads",
    "priority": 10,
    "polygon": [
      [
        50.9,
        6
      ],
      [
        50.9,
        6.1
      ],
      [
        50.8,
        6.1
      ],
      [
        50.8,
        6
      ],
      [
        50.9,
        6
      ]
    ]
  },
  {
    "id": "be_aalst",
    "name": "Aalst (Belgium)",
    "locale": "nl-BE-x-aalsters",
    "priority": 10,
    "polygon": [
      [
        50.96,
        4.01
      ],
      [
        50.96,
        4.06
      ],
      [
        50.91,
        4.06
      ],
      [
        50.91,
        4.01
      ],
      [
        50.96,
        4.01
      ]
    ]
  },
  {
    "id": "nld_zaanstreek",
    "name": "Zaanstreek (Netherlands)",
    "locale": "nl-NL-x-zaans",
    "priority": 10,
    "polygon": [
      [
        52.51,
        4.78
      ],
      [
        52.51,
        4.88
      ],
      [
        52.42,
        4.88
      ],
      [
        52.42,
        4.78
      ],
      [
        52.51,
        4.78
      ]
    ]
  },
  {
    "id": "nld_rijnmond",
    "name": "Rijnmond (Netherlands)",
    "locale": "nl-NL-x-rijnmond",
    "priority": 10,
    "polygon": [
      [
        52,
        4.2
      ],
      [
        52,
        4.6
      ],
      [
        51.8,
        4.6
      ],
      [
        51.8,
        4.2
      ],
      [
        52,
        4.2
      ]
    ]
  }
];
