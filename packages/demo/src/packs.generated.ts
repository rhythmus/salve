/**
 * AUTO-GENERATED — Do not edit manually.
 * Generated from data/packs/*.{greetings,regions}.{json,yaml} by scripts/generate-demo-packs.ts
 * Generated at: 2026-03-09T11:28:42.396Z
 */

import type { GreetingPack, RegionDefinition } from "@salve/types";

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
        id: "de_de_de_unity",
        text: "Alles Gute zum Tag der Deutschen Einheit!",
        eventRef: "german_unity_day",
      },
      {
        id: "de_de_de_unity_formal",
        text: "Einen schönen Tag der Deutschen Einheit.",
        eventRef: "german_unity_day",
        formality: "formal" as const,
      },
      {
        id: "de_de_de_newyear",
        text: "Frohes neues Jahr!",
        eventRef: "new_year",
      },
      {
        id: "de_de_de_morning",
        text: "Guten Morgen",
        eventRef: "morning",
      },
      {
        id: "de_de_de_midday",
        text: "Mahlzeit",
        eventRef: "midday",
        formality: "informal" as const,
      },
      {
        id: "de_de_de_afternoon",
        text: "Guten Tag",
        eventRef: "afternoon",
      },
      {
        id: "de_de_de_evening",
        text: "Guten Abend",
        eventRef: "evening",
      },
      {
        id: "de_de_de_night",
        text: "Gute Nacht",
        eventRef: "night",
      },
      {
        id: "de_de_de_christmas",
        text: "Frohe Weihnachten!",
        eventRef: "christmas",
      },
      {
        id: "de_de_de_fallback",
        text: "Hallo",
      },
    ],
  },
  {
    locale: "el-GR",
    greetings: [
      {
        id: "el_gr_el_morning",
        text: "Καλημέρα",
        eventRef: "morning",
      },
      {
        id: "el_gr_el_afternoon",
        text: "Καλησπέρα",
        eventRef: "afternoon",
      },
      {
        id: "el_gr_el_evening",
        text: "Καλησπέρα",
        eventRef: "evening",
      },
      {
        id: "el_gr_el_night",
        text: "Καληνύχτα",
        eventRef: "night",
      },
      {
        id: "el_gr_el_independence",
        text: "Χρόνια Πολλά!",
        eventRef: "gr_independence_day",
      },
      {
        id: "el_gr_el_fallback",
        text: "Γεια σας",
      },
    ],
  },
  {
    locale: "en-GB",
    greetings: [
      {
        id: "en_gb_en_morning",
        text: "Good morning",
        eventRef: "morning",
      },
      {
        id: "en_gb_en_afternoon",
        text: "Good afternoon",
        eventRef: "afternoon",
      },
      {
        id: "en_gb_en_evening",
        text: "Good evening",
        eventRef: "evening",
      },
      {
        id: "en_gb_en_eid",
        text: "Eid Mubarak!",
        eventRef: "eid_al_fitr",
      },
      {
        id: "en_gb_en_ramadan",
        text: "Ramadan Kareem!",
        eventRef: "ramadan_start",
      },
      {
        id: "en_gb_en_cny",
        text: "Happy Chinese New Year!",
        eventRef: "chinese_new_year",
      },
      {
        id: "en_gb_en_christmas",
        text: "Merry Christmas!",
        eventRef: "christmas",
      },
      {
        id: "en_gb_en_fallback",
        text: "Hello",
      },
    ],
  },
  {
    locale: "nl",
    greetings: [
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
    locale: "tr-TR",
    greetings: [
      {
        id: "tr_tr_tr_eid",
        text: "Bayramınız kutlu olsun!",
        eventRef: "eid_al_fitr",
      },
      {
        id: "tr_tr_tr_ramadan",
        text: "Hayırlı Ramazanlar!",
        eventRef: "ramadan_start",
      },
      {
        id: "tr_tr_tr_morning",
        text: "Günaydın",
        eventRef: "morning",
      },
      {
        id: "tr_tr_tr_afternoon",
        text: "İyi günler",
        eventRef: "afternoon",
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
        id: "zh_cn_zh_cny",
        text: "新年快乐！",
        eventRef: "chinese_new_year",
      },
      {
        id: "zh_cn_zh_lantern",
        text: "元宵节快乐！",
        eventRef: "lantern_festival",
      },
      {
        id: "zh_cn_zh_fallback",
        text: "你好",
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
