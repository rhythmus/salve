/**
 * AUTO-GENERATED — Do not edit manually.
 * Generated from data/packs/*.{greetings,regions}.{json,yaml} by scripts/generate-demo-packs.ts
 * Generated at: 2026-03-09T12:47:37.043Z
 */

import type { GreetingPack, RegionDefinition } from "@salve/types";

export const DEMO_PACKS: GreetingPack[] = [
  {
    locale: "ar",
    greetings: [
      {
        id: "ar_general_welcome_hello",
        text: "مرحباً",
        notes: "General welcome / hello",
      },
      {
        id: "ar_eid_al_fitr",
        text: "عيد مبارك",
        eventRef: "salve.event.religious.muslim.eid_al_fitr",
        locale: "ar",
        notes: "Arabic: Eid Mubarak",
        sources: "https://en.wikipedia.org/wiki/Eid_Mubarak",
      },
      {
        id: "ar_ramadan_start",
        text: "رمضان كريم",
        eventRef: "salve.event.religious.muslim.ramadan_start",
        locale: "ar",
        sources: "https://en.wikipedia.org/wiki/Ramadan",
      },
    ],
  },
  {
    locale: "el-GR",
    greetings: [
      {
        id: "el_gr_christmas",
        text: "Καλά Χριστούγεννα!",
        eventRef: "salve.event.religious.christian.christmas",
        locale: "el-GR",
        formality: "neutral" as const,
        notes: "Greek: Merry Christmas",
        sources: "https://www.greekpod101.com/blog/2019/01/12/how-to-say-hello-in-greek/",
      },
      {
        id: "el_gr_easter",
        text: "Χριστός Ανέστη!",
        eventRef: "salve.event.religious.christian.easter",
        locale: "el-GR",
        expectedResponse: "Αληθώς Ανέστη!",
        formality: "neutral" as const,
        notes: "Greek: Christ is Risen!",
        sources: "https://www.greekpod101.com/blog/2019/01/12/how-to-say-hello-in-greek/",
      },
      {
        id: "el_gr_basic_hi_hello_often_short_for",
        text: "Γεια!",
        locale: "el-GR",
        formality: "informal" as const,
        notes: "Basic 'Hi/Hello'. Often short for Γεια σου/σας.",
        sources: "https://www.greekpod101.com/blog/2019/01/12/how-to-say-hello-in-greek/",
      },
      {
        id: "el_gr_informal_hello_to_one_person",
        text: "Γεια σου!",
        locale: "el-GR",
        formality: "informal" as const,
        notes: "Informal 'Hello' to one person.",
        sources: "https://www.greekpod101.com/blog/2019/01/12/how-to-say-hello-in-greek/",
      },
      {
        id: "el_gr_formal_hello_to_one_person_or_in",
        text: "Γεια σας!",
        locale: "el-GR",
        formality: "formal" as const,
        notes: "Formal 'Hello' to one person or informal to a group.",
        sources: "https://www.greekpod101.com/blog/2019/01/12/how-to-say-hello-in-greek/",
      },
      {
        id: "el_gr_polite_formal_hello_can_sound_sl",
        text: "Χαίρετε!",
        locale: "el-GR",
        formality: "formal" as const,
        notes: "Polite/Formal 'Hello'. Can sound slightly old-fashioned to young people.",
        sources: "https://www.greekpod101.com/blog/2019/01/12/how-to-say-hello-in-greek/",
      },
      {
        id: "el_gr_also_means_hello",
        text: "Γεια!",
        locale: "el-GR",
        phase: "close",
        notes: "'Bye!'. Note: Γεια also means Hello.",
        sources: "https://www.greekpod101.com/blog/2019/01/12/how-to-say-hello-in-greek/",
      },
      {
        id: "el_gr_see_you",
        text: "Τα λέμε!",
        locale: "el-GR",
        phase: "close",
        notes: "See you!",
        sources: "https://www.greekpod101.com/blog/2019/01/12/how-to-say-hello-in-greek/",
      },
      {
        id: "el_gr_goodbye_used_for_permanent_or_lo",
        text: "Αντίο",
        locale: "el-GR",
        formality: "formal" as const,
        phase: "close",
        notes: "Goodbye. Used for permanent or long-term separation.",
        sources: "https://www.greekpod101.com/blog/2019/01/12/how-to-say-hello-in-greek/",
      },
      {
        id: "el_gr_farewell_more_sophisticated_vers",
        text: "Εις το επανιδείν!",
        locale: "el-GR",
        formality: "formal" as const,
        phase: "close",
        notes: "Farewell. More sophisticated version of 'See you again'.",
        sources: "https://www.greekpod101.com/blog/2019/01/12/how-to-say-hello-in-greek/",
      },
      {
        id: "el_gr_morning",
        text: "Καλημέρα!",
        eventRef: "salve.event.temporal.morning",
        locale: "el-GR",
        notes: "Good morning! (Usually until 12pm)",
        sources: "https://www.greekpod101.com/blog/2019/01/12/how-to-say-hello-in-greek/",
      },
      {
        id: "el_gr_afternoon",
        text: "Καλησπέρα!",
        eventRef: "salve.event.temporal.afternoon",
        locale: "el-GR",
        notes: "Good afternoon! (12pm until late evening)",
        sources: "https://www.greekpod101.com/blog/2019/01/12/how-to-say-hello-in-greek/",
      },
      {
        id: "el_gr_have_a_good_afternoon_used_when_",
        text: "Καλό απόγευμα!",
        locale: "el-GR",
        phase: "close",
        notes: "Have a good afternoon! (Used when parting)",
        sources: "https://www.greekpod101.com/blog/2019/01/12/how-to-say-hello-in-greek/",
      },
      {
        id: "el_gr_have_a_good_evening_used_when_pa",
        text: "Καλό βράδυ!",
        locale: "el-GR",
        phase: "close",
        notes: "Have a good evening! (Used when parting)",
        sources: "https://www.greekpod101.com/blog/2019/01/12/how-to-say-hello-in-greek/",
      },
      {
        id: "el_gr_night",
        text: "Καληνύχτα!",
        eventRef: "salve.event.temporal.night",
        locale: "el-GR",
        notes: "Goodnight!",
        sources: "https://www.greekpod101.com/blog/2019/01/12/how-to-say-hello-in-greek/",
      },
      {
        id: "el_gr_sweet_dreams_usually_follows",
        text: "Όνειρα γλυκά",
        locale: "el-GR",
        formality: "informal" as const,
        notes: "Sweet dreams. Usually follows Καληνύχτα.",
        sources: "https://www.greekpod101.com/blog/2019/01/12/how-to-say-hello-in-greek/",
      },
      {
        id: "el_gr_hey_slang",
        text: "Γεια χαρά!",
        locale: "el-GR",
        formality: "highly informal" as const,
        notes: "Hey! (Slang)",
        sources: "https://www.greekpod101.com/blog/2019/01/12/how-to-say-hello-in-greek/",
      },
      {
        id: "el_gr_yo_slang",
        text: "Γιο!",
        locale: "el-GR",
        formality: "highly informal" as const,
        notes: "Yo! (Slang)",
        sources: "https://www.greekpod101.com/blog/2019/01/12/how-to-say-hello-in-greek/",
      },
      {
        id: "el_gr_long_time_no_see",
        text: "Χρόνια και ζαμάνια!",
        locale: "el-GR",
        notes: "Long time no see!",
        sources: "https://www.greekpod101.com/blog/2019/01/12/how-to-say-hello-in-greek/",
      },
      {
        id: "el_gr_pleased_to_meet_you",
        text: "Χαίρω πολύ!",
        locale: "el-GR",
        notes: "Pleased to meet you!",
        sources: "https://www.greekpod101.com/blog/2019/01/12/how-to-say-hello-in-greek/",
      },
      {
        id: "el_gr_pleased_to_have_met_you",
        text: "Χάρηκα!",
        locale: "el-GR",
        notes: "Pleased (to have met you)!",
        sources: "https://www.greekpod101.com/blog/2019/01/12/how-to-say-hello-in-greek/",
      },
      {
        id: "el_gr_pleased_to_make_your_acquaintanc",
        text: "Χαίρομαι για τη γνωριμία!",
        locale: "el-GR",
        notes: "Pleased to make your acquaintance!",
        sources: "https://www.greekpod101.com/blog/2019/01/12/how-to-say-hello-in-greek/",
      },
      {
        id: "el_gr_yes_informal",
        text: "Ναι;",
        locale: "el-GR",
        setting: ["chat"],
        notes: "Answering phone: 'Yes?' (Informal)",
        sources: "https://www.greekpod101.com/blog/2019/01/12/how-to-say-hello-in-greek/",
      },
      {
        id: "el_gr_please_universal",
        text: "Παρακαλώ;",
        locale: "el-GR",
        setting: ["chat"],
        notes: "Answering phone: 'Please?' (Universal)",
        sources: "https://www.greekpod101.com/blog/2019/01/12/how-to-say-hello-in-greek/",
      },
      {
        id: "el_gr_speak_standard",
        text: "Λέγετε",
        locale: "el-GR",
        setting: ["chat"],
        notes: "Answering phone: 'Speak' (Standard)",
        sources: "https://www.greekpod101.com/blog/2019/01/12/how-to-say-hello-in-greek/",
      },
      {
        id: "el_gr_independence_day",
        text: "Χρόνια Πολλά!",
        eventRef: "salve.event.civil.national.gr.independence_day",
        locale: "el-GR",
        notes: "Greek Independence Day / Anniversary. Literal: 'Many years!'",
      },
      {
        id: "el_gr_standard_respectful_greeting",
        text: "Γεια σας",
        locale: "el-GR",
        notes: "Standard respectful greeting.",
      },
      {
        id: "el_latn_ya",
        text: "Ya!",
        locale: "el-Latn",
        formality: "informal" as const,
        sources: "https://www.greekpod101.com/blog/2019/01/12/how-to-say-hello-in-greek/",
      },
      {
        id: "el_latn_ya_su",
        text: "Ya su!",
        locale: "el-Latn",
        formality: "informal" as const,
        sources: "https://www.greekpod101.com/blog/2019/01/12/how-to-say-hello-in-greek/",
      },
      {
        id: "el_latn_ya_sas",
        text: "Ya sas!",
        locale: "el-Latn",
        formality: "formal" as const,
        sources: "https://www.greekpod101.com/blog/2019/01/12/how-to-say-hello-in-greek/",
      },
      {
        id: "el_latn_kalimera",
        text: "Kalimera!",
        eventRef: "salve.event.temporal.morning",
        locale: "el-Latn",
        sources: "https://www.greekpod101.com/blog/2019/01/12/how-to-say-hello-in-greek/",
      },
      {
        id: "el_latn_kalispera",
        text: "Kalispera!",
        eventRef: "salve.event.temporal.afternoon",
        locale: "el-Latn",
        sources: "https://www.greekpod101.com/blog/2019/01/12/how-to-say-hello-in-greek/",
      },
      {
        id: "el_latn_kalinihta",
        text: "Kaliníhta!",
        eventRef: "salve.event.temporal.night",
        locale: "el-Latn",
        sources: "https://www.greekpod101.com/blog/2019/01/12/how-to-say-hello-in-greek/",
      },
      {
        id: "el_latn_ta_leme",
        text: "Ta leme!",
        locale: "el-Latn",
        phase: "close",
        sources: "https://www.greekpod101.com/blog/2019/01/12/how-to-say-hello-in-greek/",
      },
      {
        id: "el_latn_adio",
        text: "Adio",
        locale: "el-Latn",
        phase: "close",
        sources: "https://www.greekpod101.com/blog/2019/01/12/how-to-say-hello-in-greek/",
      },
      {
        id: "el_latn_harika",
        text: "Harika!",
        locale: "el-Latn",
        notes: "Pleased to meet you",
        sources: "https://www.greekpod101.com/blog/2019/01/12/how-to-say-hello-in-greek/",
      },
    ],
  },
  {
    locale: "el-Latn",
    greetings: [
      {
        id: "el_latn_kala_christougenna",
        text: "Kala Christougenna!",
        eventRef: "salve.event.religious.christian.christmas",
        locale: "el-Latn",
        formality: "neutral" as const,
        notes: "Greek (Transliterated): Merry Christmas",
        sources: "https://www.greekpod101.com/blog/2019/01/12/how-to-say-hello-in-greek/",
      },
      {
        id: "el_latn_christos_anesti",
        text: "Christos Anesti!",
        eventRef: "salve.event.religious.christian.easter",
        locale: "el-Latn",
        expectedResponse: "Alithos Anesti!",
        formality: "neutral" as const,
        notes: "Greek (Transliterated): Christ is Risen!",
        sources: "https://www.greekpod101.com/blog/2019/01/12/how-to-say-hello-in-greek/",
      },
    ],
  },
  {
    locale: "nl",
    greetings: [
      {
        id: "nl_zalig_kerstmis",
        text: "Zalig Kerstmis!",
        eventRef: "salve.event.religious.christian.christmas",
        locale: "nl",
        formality: "neutral" as const,
        notes: "Dutch: Blessed Christmas",
        sources: "https://nl.wikipedia.org/wiki/Kerstmis#Begroeting",
      },
      {
        id: "nl_zalig_pasen",
        text: "Zalig Pasen!",
        eventRef: "salve.event.religious.christian.easter",
        locale: "nl",
        formality: "neutral" as const,
        notes: "General Dutch Easter greeting",
        sources: "https://nl.wikipedia.org/wiki/Pasen#Gebruiken",
      },
      {
        id: "nl_christus_is_verrezen",
        text: "Christus is verrezen!",
        eventRef: "salve.event.religious.christian.easter",
        locale: "nl",
        expectedResponse: "Hij is waarlijk verrezen!",
        formality: "neutral" as const,
        notes: "Dutch Eastern Orthodox Easter greeting",
        sources: "https://nl.wikipedia.org/wiki/Pasen#Gebruiken",
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
        id: "nl_houje",
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
        id: "nl_houdoe",
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
        id: "nl_salut_1",
        text: "Salut",
        locale: ["nl-BE-x-antwerps", "nl-BE-x-kempens", "nl-BE-x-mechels", "nl-BE-x-leuvens"],
        formality: "highly informal" as const,
        notes: "Vlaamse en (oost) Zeeuws-Vlaamse afscheidsgroet (afkomstig uit het Frans)",
        sources: "https://nl.wikipedia.org/wiki/Groet_(etiquette)#Nederlandstalige_verbale_begroetingen",
      },
      {
        id: "nl_salukes_2",
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
        id: "en_gb_merry_christmas",
        text: "Merry Christmas!",
        eventRef: "salve.event.religious.christian.christmas",
        locale: "en-GB",
        formality: "neutral" as const,
      },
      {
        id: "en_gb_happy_easter",
        text: "Happy Easter!",
        eventRef: "salve.event.religious.christian.easter",
        locale: "en-GB",
        formality: "neutral" as const,
      },
      {
        id: "en_gb_christ_is_risen",
        text: "Christ is Risen!",
        eventRef: "salve.event.religious.christian.easter",
        locale: "en-GB",
        expectedResponse: "Indeed, He is Risen!",
        formality: "neutral" as const,
        notes: "English Eastern Orthodox Easter greeting",
      },
      {
        id: "en_gb_good_morning",
        text: "Good morning",
        eventRef: "salve.event.temporal.morning",
      },
      {
        id: "en_gb_good_afternoon",
        text: "Good afternoon",
        eventRef: "salve.event.temporal.afternoon",
      },
      {
        id: "en_gb_good_evening",
        text: "Good evening",
        eventRef: "salve.event.temporal.evening",
      },
      {
        id: "en_gb_hello",
        text: "Hello",
      },
      {
        id: "en_gb_eid_mubarak",
        text: "Eid Mubarak!",
        eventRef: "salve.event.religious.muslim.eid_al_fitr",
        locale: "en-GB",
        sources: "https://en.wikipedia.org/wiki/Eid_Mubarak",
      },
      {
        id: "en_gb_ramadan_kareem",
        text: "Ramadan Kareem!",
        eventRef: "salve.event.religious.muslim.ramadan_start",
        locale: "en-GB",
        sources: "https://en.wikipedia.org/wiki/Ramadan",
      },
      {
        id: "en_gb_happy_chinese_new_year",
        text: "Happy Chinese New Year!",
        eventRef: "salve.event.civil.secular.chinese_new_year",
        locale: "en-GB",
        sources: "https://en.wikipedia.org/wiki/Chinese_New_Year#Greetings",
      },
    ],
  },
  {
    locale: "de-DE",
    greetings: [
      {
        id: "de_de_frohe_weihnachten",
        text: "Frohe Weihnachten!",
        eventRef: "salve.event.religious.christian.christmas",
        locale: "de-DE",
        formality: "neutral" as const,
      },
      {
        id: "de_de_frohe_ostern",
        text: "Frohe Ostern!",
        eventRef: "salve.event.religious.christian.easter",
        locale: "de-DE",
        formality: "neutral" as const,
        notes: "German: Happy Easter",
      },
      {
        id: "de_de_alles_gute_zum_tag_der_deutschen",
        text: "Alles Gute zum Tag der Deutschen Einheit!",
        eventRef: "salve.event.civil.national.de.unity_day",
        notes: "German Unity Day",
      },
      {
        id: "de_de_einen_schonen_tag_der_deutschen_",
        text: "Einen schönen Tag der Deutschen Einheit.",
        eventRef: "salve.event.civil.national.de.unity_day",
        formality: "formal" as const,
      },
      {
        id: "de_de_frohes_neues_jahr",
        text: "Frohes neues Jahr!",
        eventRef: "salve.event.temporal.new_year",
      },
      {
        id: "de_de_guten_morgen",
        text: "Guten Morgen",
        eventRef: "salve.event.temporal.morning",
      },
      {
        id: "de_de_mahlzeit",
        text: "Mahlzeit",
        eventRef: "salve.event.temporal.midday",
        formality: "informal" as const,
      },
      {
        id: "de_de_guten_tag",
        text: "Guten Tag",
        eventRef: "salve.event.temporal.afternoon",
      },
      {
        id: "de_de_guten_abend",
        text: "Guten Abend",
        eventRef: "salve.event.temporal.evening",
      },
      {
        id: "de_de_gute_nacht",
        text: "Gute Nacht",
        eventRef: "salve.event.temporal.night",
      },
      {
        id: "de_de_hallo",
        text: "Hallo",
      },
    ],
  },
  {
    locale: "tr-TR",
    greetings: [
      {
        id: "tr_tr_bayram_n_z_kutlu_olsun",
        text: "Bayramınız kutlu olsun!",
        eventRef: "salve.event.religious.muslim.eid_al_fitr",
        locale: "tr-TR",
        notes: "Turkish: Holiday greetings",
        sources: "https://en.wikipedia.org/wiki/Eid_Mubarak",
      },
      {
        id: "tr_tr_hay_rl_ramazanlar",
        text: "Hayırlı Ramazanlar!",
        eventRef: "salve.event.religious.muslim.ramadan_start",
        locale: "tr-TR",
        sources: "https://en.wikipedia.org/wiki/Ramadan",
      },
      {
        id: "tr_tr_gunayd_n",
        text: "Günaydın",
        eventRef: "salve.event.temporal.morning",
      },
      {
        id: "tr_tr_iyi_gunler",
        text: "İyi günler",
        eventRef: "salve.event.temporal.afternoon",
      },
      {
        id: "tr_tr_merhaba",
        text: "Merhaba",
      },
    ],
  },
  {
    locale: "zh-CN",
    greetings: [
      {
        id: "zh_cn_chinese_new_year",
        text: "新年快乐！",
        eventRef: "salve.event.civil.secular.chinese_new_year",
        locale: "zh-CN",
        sources: "https://en.wikipedia.org/wiki/Chinese_New_Year#Greetings",
      },
      {
        id: "zh_cn_lantern_festival",
        text: "元宵节快乐！",
        eventRef: "salve.event.civil.secular.lantern_festival",
        locale: "zh-CN",
        sources: "https://en.wikipedia.org/wiki/Lantern_Festival",
      },
      {
        id: "zh_cn_general_welcome_hello",
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
