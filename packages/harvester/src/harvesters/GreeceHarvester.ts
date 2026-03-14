import * as cheerio from 'cheerio';
import * as fs from 'fs';
import * as path from 'path';
import { SalveHarvester, HarvesterOptions } from '../types';
import { fetchText } from '../utils/web';
import { normalizeDateToSalve } from '../utils/date';

export class GreeceHarvester implements SalveHarvester {
    id = 'greece-holidays';
    defaultOutputPath = 'data/packs/events/country/GR.events.yaml';

    private url = 'https://en.wikipedia.org/wiki/Public_holidays_in_Greece';

    constructor(private options: HarvesterOptions = {}) { }

    async harvest(): Promise<any> {
        console.log(`Harvesting Greek holidays from ${this.url}...`);
        const html = await fetchText(this.url);
        const $ = cheerio.load(html);

        const harvestedEvents: any[] = [];

        // Target the main "Public holidays" table
        // It's the first wikitable after the "Public holidays" header
        const mainTable = $('h2:contains("Public holidays")').nextAll('table.wikitable').first();
        if (mainTable.length) {
            this.parseTable($, mainTable, harvestedEvents, true);
        }

        // Target profession-specific holidays
        const professionTable = $('h2:contains("Profession-specific holidays")').nextAll('table.wikitable').first();
        if (professionTable.length) {
            this.parseTable($, professionTable, harvestedEvents, false);
        }

        // ─── Merge & Sort ──────────────────────────────────────────────────
        const root = this.findProjectRoot();
        const fullPath = path.resolve(root, this.defaultOutputPath);
        let existingEvents: any[] = [];
        let existingCountry: string = 'GR';

        if (fs.existsSync(fullPath)) {
            const yamlData = require('js-yaml');
            const data = yamlData.load(fs.readFileSync(fullPath, 'utf8')) || { events: [] };
            existingEvents = data.events || [];
            existingCountry = data.country || 'GR';
        }

        const finalEvents = this.mergeEvents(existingEvents, harvestedEvents);

        return {
            country: existingCountry,
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

    private parseTable($: any, table: any, events: any[], isMain: boolean) {
        const rows = table.find('tbody tr');

        rows.each((i: number, row: any) => {
            const cols = $(row).find('td');
            if (cols.length < 4) return; // Header or invalid row

            let dateStr = $(cols[0]).text().trim();
            let date = this.mapDate(dateStr);
            if (!date) return;

            const nameIdx = 1;
            const eventName = $(cols[nameIdx]).text().replace(/\[\d+\]/g, '').trim();
            const greekName = $(cols[3]).text().trim();

            const event: any = {
                date,
                category: isMain ? 'official' : 'observance',
                label: {
                    en: eventName,
                    el: greekName
                }
            };

            if (!isMain) {
                // Profession-specific column is usually 4
                const appliesTo = $(cols[4]).text().trim().toLowerCase();
                if (appliesTo.includes('teacher') || appliesTo.includes('student') || appliesTo.includes('education')) {
                    event.professions = ['teacher', 'student'];
                } else if (appliesTo.includes('custom')) {
                    event.professions = ['customs_officer'];
                }
            }

            events.push(event);
        });
    }

    private mapDate(str: string): string | null {
        str = str.toLowerCase().replace(/[\s\u00a0]+/g, ' ').trim();

        // Fixed dates
        if (str.includes('1 january')) return '1 January';
        if (str.includes('6 january')) return '6 January';
        if (str.includes('30 january')) return '30 January';
        if (str.includes('25 march')) return '25 March';
        if (str.includes('1 may')) return '1 May';
        if (str.includes('15 august')) return '15 August';
        if (str.includes('28 october')) return '28 October';
        if (str.includes('17 november')) return '17 November';
        if (str.includes('25 december')) return '25 December';
        if (str.includes('26 december')) return '26 December';

        // Moveable dates (Orthodox)
        if (str.includes('clean monday')) return 'pascha:-48';
        if (str.includes('good friday')) return 'pascha:-2';
        if (str.includes('easter monday')) return 'pascha:1';
        if (str.includes('whit monday')) return 'pascha:50';

        // Try general normalization
        try {
            return normalizeDateToSalve(str);
        } catch {
            return null;
        }
    }

    private mergeEvents(existing: any[], harvested: any[]): any[] {
        const merged: any[] = [...existing];

        for (const h of harvested) {
            const hLabelEn = h.label.en;

            // Search by label or date
            const index = merged.findIndex(e => {
                const eLabelEn = typeof e.label === 'object' ? e.label.en : e.label;
                return eLabelEn === hLabelEn || (e.date === h.date && e.category === h.category);
            });

            if (index >= 0) {
                // Update date and label
                merged[index].date = h.date;
                if (typeof merged[index].label !== 'object') {
                    merged[index].label = { en: merged[index].label };
                }
                merged[index].label.el = h.label.el;

                // Transfer professions if missing
                if (h.professions && !merged[index].professions) {
                    merged[index].professions = h.professions;
                }
            } else {
                merged.push(h);
            }
        }

        // Sort by approximate date
        return merged.sort((a, b) => {
            const scoreA = this.getSortScore(a.date);
            const scoreB = this.getSortScore(b.date);
            return scoreA - scoreB;
        });
    }

    private getSortScore(date: string): number {
        if (date.startsWith('pascha:')) {
            const offset = parseInt(date.split(':')[1], 10);
            return 100 + offset; // Easter is around 100th day
        }
        const months = ["january", "february", "march", "april", "may", "june",
            "july", "august", "september", "october", "november", "december"];
        for (let i = 0; i < months.length; i++) {
            if (date.toLowerCase().includes(months[i])) {
                const dayMatch = date.match(/\d+/);
                const day = dayMatch ? parseInt(dayMatch[0], 10) : 1;
                return (i * 31) + day;
            }
        }
        return 999;
    }
}
