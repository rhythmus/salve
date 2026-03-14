import * as cheerio from 'cheerio';
import * as fs from 'fs';
import * as path from 'path';
import { SalveHarvester, HarvesterOptions } from '../types';
import { fetchText } from '../utils/web';
import { normalizeDateToSalve } from '../utils/date';

export class BelgiumHarvester implements SalveHarvester {
    id = 'belgium-holidays';
    defaultOutputPath = 'data/packs/events/country/BE.events.yaml';

    private url = 'https://en.wikipedia.org/wiki/Public_holidays_in_Belgium';

    constructor(private options: HarvesterOptions = {}) { }

    async harvest(): Promise<any> {
        console.log(`Harvesting Belgian holidays from ${this.url}...`);
        const html = await fetchText(this.url);
        const $ = cheerio.load(html);

        const harvestedEvents: any[] = [];

        // Target the main "Public holidays" table
        let mainTable = $('h2#Public_holidays').closest('.mw-heading').nextAll('table.wikitable').first();
        if (!mainTable.length) {
            mainTable = $('h2#Public_holidays').nextAll('table.wikitable').first();
        }

        if (mainTable.length) {
            this.parseTable($, mainTable, harvestedEvents, true);
        }

        // Target regional/particular holidays table
        let particularTable = $('h2#Particular_days_celebrated_in_Belgium_that_are_not_official_public_holidays').closest('.mw-heading').nextAll('table.wikitable').first();
        if (!particularTable.length) {
            particularTable = $('h2#Particular_days_celebrated_in_Belgium_that_are_not_official_public_holidays').nextAll('table.wikitable').first();
        }

        if (particularTable.length) {
            this.parseTable($, particularTable, harvestedEvents, false);
        }

        // ─── Manual Additions ──────────────────────────────────────────────
        // Verloren Maandag (Lost Monday) - First Monday after Epiphany
        // Observed in Antwerp and Kempen regions
        if (!harvestedEvents.some(e => e.label.nl === "Verloren Maandag")) {
            harvestedEvents.push({
                date: '01:06:next:monday',
                category: 'observance',
                label: {
                    nl: ['Verloren Maandag', 'Verzworen Maandag'],
                    fr: ['Lundi Perdu', 'Lundi Parjuré'],
                    de: ['Verlorener Montag', 'Verzworener Montag'],
                    en: 'Verloren Maandag'
                },
                greetings: {
                    nl: 'Gezellige Verloren Maandag! Smakelijk!',
                },
                requiredRegions: ['be_antwerpen', 'be_kempen'],
                WikiData: 'Q3267494'
            });
        }

        // Koppermaandag - For the printing trade
        if (!harvestedEvents.some(e => e.label.nl === "Koppermaandag")) {
            harvestedEvents.push({
                date: '01:06:next:monday',
                category: 'observance',
                label: {
                    en: 'Koppermaandag',
                    nl: ['Koppermaandag', 'Koppertjesmaandag', 'Raasmaandag']
                },
                greetings: {
                    nl: 'God zegene de kunst!',
                    de: 'Gott grüß die Kunst!'
                },
                requiredProfessions: ['printer', 'typographer', 'lithographer', 'graphic_artist'],
                WikiData: 'Q2382689'
            });
        }

        // Day of the French Community - 27 September
        if (!harvestedEvents.some(e => e.label.nl === "Feest van de Franse Gemeenschap")) {
            harvestedEvents.push({
                date: '27 September',
                category: 'observance',
                label: {
                    en: 'Day of the French Community',
                    nl: 'Feest van de Franse Gemeenschap',
                    fr: 'Fête de la Communauté française',
                    de: 'Tag der Französischen Gemeinschaft'
                },
                greetings: {},
                requiredRegions: ['be_brussels', 'be_wallonia'],
                WikiData: 'Q2007253'
            });
        }

        // Mother's Day (Antwerp Region) - 15 August
        if (!harvestedEvents.some(e => e.label.nl === "Moederkesdag")) {
            harvestedEvents.push({
                date: '15 August',
                category: 'observance',
                label: {
                    en: "Mother's Day (Antwerp)",
                    nl: ['Moederkensdag', 'Moederdag (Antwerpen)']
                },
                greetings: {
                    nl: ['Gelukkige Moederdag!', 'Gelukkig Moederkesdag!']
                },
                requiredRegions: ['be_antwerpen', 'be_kempen'],
                WikiData: 'Q16069165'
            });
        }

        // ─── Merge & Sort ──────────────────────────────────────────────────
        const root = this.findProjectRoot();
        const fullPath = path.resolve(root, this.defaultOutputPath);
        let existingEvents: any[] = [];
        if (fs.existsSync(fullPath)) {
            const yamlData = require('js-yaml');
            const data = yamlData.load(fs.readFileSync(fullPath, 'utf8')) || { events: [] };
            existingEvents = data.events || [];
        }
        const finalEvents = this.mergeEvents(existingEvents, harvestedEvents);

        // ─── Wikidata Enrichment ───────────────────────────────────────────
        if (!this.options.skipWikidata) {
            const { lookupWikidataQid } = require('../utils/wikidata');
            const { sleep } = require('../utils/web');
            console.log("🔗 Enriching missing Wikidata IDs...");
            for (let i = 0; i < finalEvents.length; i++) {
                if (!finalEvents[i].WikiData) {
                    const label = typeof finalEvents[i].label === 'object' ? finalEvents[i].label.en : finalEvents[i].label;
                    const qid = await lookupWikidataQid(label);
                    if (qid) finalEvents[i].WikiData = qid;
                    await sleep(80);
                }
                if (i % 5 === 0) process.stdout.write(`\r  ${i + 1}/${finalEvents.length}`);
            }
            console.log("\n✅ Enrichment complete.");
        }

        return {
            sources: [this.url],
            events: finalEvents
        };
    }

    private findProjectRoot(): string {
        let root = process.cwd();
        while (root !== "/" && !fs.existsSync(path.join(root, "package.json"))) {
            root = path.dirname(root);
        }
        if (root.endsWith("packages/harvester")) root = path.join(root, "../../");
        return root;
    }

    private parseTable($: any, table: any, events: any[], isOfficial: boolean) {
        const rows = table.find('tbody tr');

        // Detect headers for localized names
        const headers: string[] = [];
        const headerRow = table.find('thead tr').length ? table.find('thead tr').first() : table.find('tbody tr').first();
        headerRow.find('th, td').each((_: number, cell: any) => {
            headers.push($(cell).text().trim().toLowerCase());
        });

        rows.each((_: number, row: any) => {
            const cols = $(row).find('td, th');
            if (cols.length < 2) return;

            // Skip rows that look like headers
            const firstColText = $(cols[0]).text().trim().toLowerCase();
            const secondColText = $(cols[1]).text().trim().toLowerCase();
            if (firstColText.includes('date') || firstColText.includes('holiday') ||
                firstColText.includes('english') || secondColText.includes('english') ||
                secondColText.includes('holiday') || secondColText.includes('name') ||
                firstColText.includes('dutch') || secondColText.includes('dutch') ||
                firstColText === '' || secondColText === '') return;

            let dateStr = $(cols[isOfficial ? 0 : 1]).text().trim();
            // Clean up Wikipedia citations like [1]
            dateStr = dateStr.replace(/\[\d+\]/g, '');

            let date = this.mapDate(dateStr);
            if (!date) return;

            const nameIdx = isOfficial ? 1 : 0;
            const nameCol = $(cols[nameIdx]);
            // Extract text but remove citations and handle multi-line labels
            const eventName = nameCol.text().trim().replace(/\[\d+\]/g, '').split('\n')[0].trim();

            const event: any = {
                date,
                category: isOfficial ? 'official' : 'observance',
                label: {
                    en: eventName
                },
                greetings: {}
            };

            // Capture localized names into the label object
            if (isOfficial) {
                if (cols.length >= 3) event.label.nl = $(cols[2]).text().trim();
                if (cols.length >= 4) event.label.fr = $(cols[3]).text().trim();
                if (cols.length >= 5) event.label.de = $(cols[4]).text().trim();
            } else {
                if (cols.length >= 4) event.label.nl = $(cols[3]).text().trim();
                if (cols.length >= 5) event.label.fr = $(cols[4]).text().trim();
                if (cols.length >= 6) event.label.de = $(cols[5]).text().trim();
            }

            events.push(event);
        });
    }

    private mapDate(str: string): string | null {
        str = str.toLowerCase().replace(/[\s\u00a0]+/g, ' ').trim();

        // Match specific Wikipedia phrases and return "D Month" format
        if (str.includes('1 january')) return '1 January';
        if (str.includes('easter monday')) return 'pascha:1';
        if (str.includes('1 may')) return '1 May';
        if (str.includes('40 days after easter')) return 'pascha:39';
        if (str.includes('50 days after easter')) return 'pascha:50';
        if (str.includes('21 july')) return '21 July';
        if (str.includes('15 august')) return '15 August';
        if (str.includes('1 november')) return '1 November';
        if (str.includes('11 november')) return '11 November';
        if (str.includes('25 december')) return '25 December';

        // Regional/Particular
        if (str.match(/^6\s+january/)) return '6 January';
        if (str.match(/^14\s+february/)) return '14 February';
        if (str.match(/^7\s+april/)) return '7 April';
        if (str.match(/^8\s+may/)) return '8 May';
        if (str.match(/^11\s+july/)) return '11 July';
        if (str.match(/^9\s+august/)) return '9 August';
        if (str.match(/^27\s+september/)) return '27 September';
        if (str.match(/^31\s+october/)) return '31 October';
        if (str.match(/^2\s+november/)) return '2 November';
        if (str.match(/^15\s+november/)) return '15 November';
        if (str.match(/^20\s+november/)) return '20 November';
        if (str.match(/^6\s+december/)) return '6 December';
        if (str.match(/^26\s+december/)) return '26 December';

        if (str.includes('third sunday of september')) return '09:sun:3';
        if (str.includes('easter')) return 'pascha:0';
        if (str.includes('pentecost')) return 'pascha:49';
        if (str.includes('king\'s feast')) return '15 November';
        if (str.includes('national')) return '21 July';

        // Handle floating ranges like "23 March – 26 April" (Easter Monday row)
        if (str.includes('23 march') && str.includes('26 april')) return 'pascha:1';

        // Try simple date normalization but keep "D Month" format
        try {
            const normalized = normalizeDateToSalve(str);
            if (normalized && !normalized.includes('-')) return normalized;
        } catch { }

        return null;
    }

    private slugify(str: string): string {
        return str.toLowerCase().replace(/[^a-z0-9]/g, '_').replace(/_+/g, '_').replace(/^_+|_+$/g, '');
    }

    private mergeEvents(existing: any[], harvested: any[]): any[] {
        const merged: any[] = [...existing];
        for (const h of harvested) {
            const hLabelEn = typeof h.label === 'object' ? h.label.en : h.label;
            const hId = `belgium.${this.slugify(hLabelEn || "")}`;

            const index = merged.findIndex(e => {
                const eLabelEn = typeof e.label === 'object' ? (e.label.en || e.label.name) : e.label;
                return eLabelEn === hLabelEn ||
                    e.id === hId ||
                    (e.WikiData && h.WikiData && e.WikiData === h.WikiData);
            });

            if (index >= 0) {
                // Update date and domain
                merged[index].date = h.date;
                merged[index].domain = h.domain;

                // Merge labels (names from Wikipedia)
                if (typeof h.label === 'object') {
                    if (typeof merged[index].label !== 'object') {
                        merged[index].label = { en: merged[index].label };
                    }
                    for (const lang of Object.keys(h.label)) {
                        merged[index].label[lang] = h.label[lang];
                    }
                }

                // Merge categories and WikiData
                if (h.category) merged[index].category = h.category;
                if (h.requiredRegions) merged[index].requiredRegions = h.requiredRegions;
                if (h.requiredProfessions) merged[index].requiredProfessions = h.requiredProfessions;
                if (h.WikiData) merged[index].WikiData = h.WikiData;

                // Cleanup redundant fields
                delete (merged[index] as any).domain;
                delete (merged[index] as any).regions;
                delete (merged[index] as any).professions;

                // Add cultural overrides for specific known events
                const nlLabel = merged[index].label.nl?.toString() || "";
                if (nlLabel.includes("Vlaamse Gemeenschap")) merged[index].requiredRegions = ["be_flanders"];
                if (nlLabel.includes("Waalse Gewest")) merged[index].requiredRegions = ["be_wallonia"];
                if (nlLabel.includes("Duitstalige Gemeenschap")) merged[index].requiredRegions = ["be_ostbelgien"];
                if (nlLabel.includes("Sint-Maarten")) merged[index].requiredRegions = ["be_ostbelgien", "be_flanders_westhoek"];
                if (nlLabel.includes("Irisfeest")) merged[index].requiredRegions = ["be_brussels"];

                // Preserve existing manual greetings, only add if missing
                if (h.greetings && typeof h.greetings === 'object') {
                    if (!merged[index].greetings) merged[index].greetings = {};
                    for (const lang of Object.keys(h.greetings)) {
                        if (!merged[index].greetings[lang]) {
                            merged[index].greetings[lang] = h.greetings[lang];
                        }
                    }
                }

                // Remove legacy id if label exists
                if (merged[index].label) delete merged[index].id;
            } else {
                merged.push(h);
            }
        }

        // Final sorted copy
        const final = [...merged].sort((a, b) => {
            const sA = this.getSortScore(a.date);
            const sB = this.getSortScore(b.date);
            if (sA !== sB) return sA - sB;

            const labelA = typeof a.label === 'object' ? a.label.en : (a.label || "");
            const labelB = typeof b.label === 'object' ? b.label.en : (b.label || "");
            return labelA.localeCompare(labelB);
        });

        return final;
    }

    private getSortScore(date: any): number {
        if (!date) return 9999;
        const months = ["january", "february", "march", "april", "may", "june",
            "july", "august", "september", "october", "november", "december"];
        const monthOffsets = [0, 31, 59, 90, 120, 151, 181, 212, 243, 273, 304, 334];

        const str = date.toString().toLowerCase();

        // Handle "pascha:X"
        if (str.startsWith('pascha:')) {
            const offset = parseInt(str.split(':')[1], 10);
            // Avg Easter is April 12 = 90 + 12 = 102
            return 102 + offset;
        }

        // Handle "MM:sun:N"
        if (str.match(/^\d{2}:/)) {
            const month = parseInt(str.split(':')[0], 10);
            return monthOffsets[month - 1] + 15;
        }

        // Handle "D Month"
        for (let i = 0; i < months.length; i++) {
            if (str.includes(months[i])) {
                const dayMatch = str.match(/\d+/);
                const day = dayMatch ? parseInt(dayMatch[0], 10) : 1;
                return monthOffsets[i] + day;
            }
        }

        return 9999;
    }
}
