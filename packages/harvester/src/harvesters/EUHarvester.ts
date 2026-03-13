import * as cheerio from 'cheerio';
import * as fs from 'fs';
import * as path from 'path';
import { SalveHarvester, HarvesterOptions } from '../types';
import { fetchText, fetchJSON } from '../utils/web';
import { normalizeDateToSalve } from '../utils/date';

export class EUHarvester implements SalveHarvester {
    id = 'eu-holidays';
    defaultOutputPath = 'data/packs/EU.events.yaml';

    private url = 'https://en.wikipedia.org/wiki/Public_holidays_in_the_European_Union';

    // Official EU languages
    private euLangs = 'bg,cs,da,de,el,en,es,et,fi,fr,ga,hr,hu,it,lt,lv,mt,nl,pl,pt,ro,sk,sl,sv';

    // Mapping of event keywords/labels to Wikidata QIDs
    private qidMap: Record<string, string> = {
        "new year's day": "Q196627",
        "day following new year's day": "", // specific exclusion to prevent matching 'new year's day'
        "maundy thursday": "Q106333",
        "good friday": "Q40317",
        "easter monday": "Q209663",
        "labour day": "Q47499",
        "europe day": "Q207811",
        "ascension thursday": "Q51638",
        "whit monday": "Q2512993",
        "belgian national day": "Q2190144",
        "assumption": "Q162691",
        "all saints' day": "Q587",
        "all souls' day": "Q1033140",
        "christmas": "Q19809",
        "st. stephen's day": "Q1366863"
    };

    constructor(private options: HarvesterOptions = {}) { }

    async harvest(): Promise<any> {
        console.log(`Harvesting EU institutional holidays from ${this.url}...`);
        const html = await fetchText(this.url);
        const $ = cheerio.load(html);

        const harvestedEvents: any[] = [];

        const table = $('caption:contains("Public holidays for the institutions of the European Union")').parent();
        if (!table.length) {
            throw new Error("Could not find the EU institutional holidays table.");
        }

        const rows = table.find('tbody tr');
        for (let i = 0; i < rows.length; i++) {
            const row = rows[i];
            const cols = $(row).find('td');
            if (cols.length < 2) continue;

            const dateStr = $(cols[0]).text().trim();
            const labelStr = $(cols[1]).text().trim().replace(/\[\d+\]/g, '');

            // Handle end-of-year range
            if (dateStr.includes('24 to 31 December')) {
                const rangeHolidays = [
                    { day: 24, label: "End-of-year holiday" },
                    { day: 25, label: "Christmas Day", qid: "Q19809" },
                    { day: 26, label: "St. Stephen's Day", qid: "Q1366863" },
                    { day: 27, label: "End-of-year holiday" },
                    { day: 28, label: "End-of-year holiday" },
                    { day: 29, label: "End-of-year holiday" },
                    { day: 30, label: "End-of-year holiday" },
                    { day: 31, label: "End-of-year holiday" }
                ];
                for (const h of rangeHolidays) {
                    const event = await this.buildEvent(`${h.day} December`, h.label, h.qid);
                    harvestedEvents.push(event);
                }
                continue;
            }

            const date = this.mapDate(dateStr, labelStr);
            if (!date) continue;

            const qid = this.findQid(labelStr);
            const event = await this.buildEvent(date, labelStr, qid);
            harvestedEvents.push(event);
        }

        return {
            tradition: "european-union",
            sources: [this.url],
            events: harvestedEvents
        };
    }

    private async buildEvent(date: string, label: string, qid?: string): Promise<any> {
        const event: any = { date, category: 'official' };

        if (qid) {
            event.WikiData = qid;
            if (!this.options.skipWikidata) {
                const multilingualLabels = await this.fetchMultilingualLabels(qid);
                if (multilingualLabels && Object.keys(multilingualLabels).length > 0) {
                    event.label = multilingualLabels;
                    return event;
                }
            }
        }

        event.label = { en: label };
        return event;
    }

    private findQid(label: string): string | undefined {
        const lower = label.toLowerCase();
        // Sort keys by length descending to match most specific first
        const sortedKeys = Object.keys(this.qidMap).sort((a, b) => b.length - a.length);
        for (const key of sortedKeys) {
            if (lower.includes(key)) return this.qidMap[key];
        }
        return undefined;
    }

    private async fetchMultilingualLabels(qid: string): Promise<Record<string, string> | null> {
        try {
            const url = `https://www.wikidata.org/w/api.php?action=wbgetentities&ids=${qid}&props=labels&languages=${this.euLangs}&format=json`;
            const data = await fetchJSON(url);
            if (!data.entities || !data.entities[qid] || !data.entities[qid].labels) return null;
            const labels = data.entities[qid].labels;
            const result: Record<string, string> = {};
            for (const lang of this.euLangs.split(',')) {
                if (labels[lang]) {
                    result[lang] = labels[lang].value;
                }
            }
            return result;
        } catch (err) {
            console.warn(`  ⚠️ Failed to fetch multilingual labels for ${qid}:`, err instanceof Error ? err.message : err);
            return null;
        }
    }

    private mapDate(str: string, label?: string): string | null {
        const combined = (str + ' ' + (label || '')).toLowerCase().replace(/[\s\u00a0]+/g, ' ').trim();

        if (combined.includes('1 january')) return '1 January';
        if (combined.includes('2 january')) return '2 January';
        if (combined.includes('1 may')) return '1 May';
        if (combined.includes('9 may')) return '9 May';
        if (combined.includes('21 july')) return '21 July';
        if (combined.includes('15 august')) return '15 August';
        if (combined.includes('1 november')) return '1 November';
        if (combined.includes('2 november')) return '2 November';

        if (combined.includes('maundy thursday') || combined.includes('thursday before easter')) return 'pascha:-3';
        if (combined.includes('good friday') || combined.includes('friday before easter')) return 'pascha:-2';
        if (combined.includes('easter monday') || combined.includes('monday after easter')) return 'pascha:1';
        if (combined.includes('friday following ascension')) return 'pascha:40';
        if (combined.includes('ascension thursday') || combined.includes('ascension day')) return 'pascha:39';
        if (combined.includes('whit monday')) return 'pascha:50';

        try {
            return normalizeDateToSalve(str.replace(/\s\d{4}$/, ''));
        } catch {
            return null;
        }
    }
}
