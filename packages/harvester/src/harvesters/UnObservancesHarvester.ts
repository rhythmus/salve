import * as cheerio from "cheerio";
import * as fs from "fs";
import * as path from "path";
const yaml = require("js-yaml");
import { SalveHarvester, HarvesterOptions } from "../types";
import { fetchText, sleep } from "../utils/web";
import { normalizeDateToSalve } from "../utils/date";
import { lookupWikidataQid } from "../utils/wikidata";

export class UnObservancesHarvester implements SalveHarvester {
    public readonly id = "un-observances";
    public readonly defaultOutputPath = "data/packs/events/shared/international.secular.events.yaml";

    private readonly WIKI_URL = "https://en.wikipedia.org/wiki/List_of_United_Nations_observances";

    constructor(private options: HarvesterOptions = {}) { }

    public async harvest(): Promise<any> {
        console.log(`📡 Fetching Wikipedia page for ${this.id}...`);
        const html = await fetchText(this.WIKI_URL);
        const $ = cheerio.load(html);

        const table = this.findTable($);
        if (!table) {
            throw new Error("Could not find the International Days table on Wikipedia.");
        }

        const harvestedEvents = this.parseTable($, table);
        console.log(`✅ Parsed ${harvestedEvents.length} events from Wikipedia.`);

        // ─── Merge with Existing Data ───────────────────────────────────────
        let finalEvents = harvestedEvents;
        const root = this.findProjectRoot();
        const existingPath = path.resolve(root, this.defaultOutputPath);

        if (fs.existsSync(existingPath)) {
            console.log(`📖 Loading existing data from ${this.defaultOutputPath} for merging...`);
            const existingData = yaml.load(fs.readFileSync(existingPath, "utf-8"));
            if (existingData && Array.isArray(existingData.events)) {
                finalEvents = this.mergeEvents(existingData.events, harvestedEvents);
            }
        }

        if (!this.options.skipWikidata) {
            console.log("🔗 Enriching missing Wikidata IDs...");
            for (let i = 0; i < finalEvents.length; i++) {
                if (!finalEvents[i].WikiData) {
                    const qid = await lookupWikidataQid(finalEvents[i].label);
                    if (qid) finalEvents[i].WikiData = qid;
                    await sleep(80);
                }
                if (i % 10 === 0) process.stdout.write(`\r  ${i + 1}/${finalEvents.length}`);
            }
            console.log("\n✅ Enrichment complete.");
        }

        return {
            tradition: ["international", "secular"],
            events: finalEvents
        };
    }

    private mergeEvents(existing: any[], harvested: any[]): any[] {
        const merged: any[] = [...existing];

        for (const h of harvested) {
            const index = merged.findIndex(e => e.label === h.label || (e.WikiData && e.WikiData === h.WikiData));
            if (index !== -1) {
                // Update existing event with new date if it changed, but preserve everything else
                if (merged[index].date !== h.date) {
                    console.log(`  🔄 Updated date for "${h.label}": ${merged[index].date} -> ${h.date}`);
                    merged[index].date = h.date;
                }
            } else {
                // Add new event
                console.log(`  ➕ Added new event: "${h.label}" (${h.date})`);
                merged.push(h);
            }
        }

        // Sort by month (roughly)
        return this.sortByDate(merged);
    }

    private sortByDate(events: any[]): any[] {
        const months = ["January", "February", "March", "April", "May", "June",
            "July", "August", "September", "October", "November", "December"];

        return events.sort((a, b) => {
            const parse = (d: string) => {
                const p = d.split(" ");
                const day = parseInt(p[0], 10) || 1;
                const month = months.indexOf(p[1]) || 0;
                return month * 100 + day;
            };
            return parse(a.date) - parse(b.date);
        });
    }

    private findProjectRoot(): string {
        let root = process.cwd();
        while (root !== "/" && !fs.existsSync(path.join(root, "package.json"))) {
            root = path.dirname(root);
        }
        if (root.endsWith("packages/harvester")) root = path.join(root, "../../");
        return root;
    }

    private findTable($: any): any {
        const headingIds = ["International_Days_and_Weeks", "International_days_and_weeks", "International_days"];
        let heading: any = null;
        for (const hid of headingIds) {
            const found = $(`#${hid}`);
            if (found.length > 0) {
                heading = found;
                break;
            }
        }
        if (!heading) return null;

        let el = heading.closest(".mw-heading, h2").length > 0
            ? heading.closest(".mw-heading").next()
            : heading.parent().next();

        for (let i = 0; i < 20 && el.length > 0; i++) {
            if (el.is("table")) return el;
            el = el.next();
        }
        return heading.parent().nextAll("table.wikitable").first();
    }

    private parseTable($: any, table: any): any[] {
        const events: any[] = [];
        const rows = table.find("tbody tr");

        rows.each((_i: number, row: any) => {
            const cells = $(row).find("td");
            if (cells.length < 2) return;

            const dateCell = cells.eq(0);
            const dateSpan = dateCell.find("span[data-sort-value]");
            const rawDate = dateSpan.length > 0 ? dateSpan.text().trim() : dateCell.text().trim();

            const nameCell = cells.eq(1);
            nameCell.find("sup.reference").remove();
            let rawName = nameCell.text().trim()
                .replace(/\[(?:Footnote\s*)?\d+\]/g, "")
                .replace(/\s+/g, " ")
                .replace(/\s+\d{4}$/, "");

            if (!rawDate || !rawName || rawName.length < 3) return;

            events.push({
                label: rawName,
                date: normalizeDateToSalve(rawDate)
            });
        });

        return events;
    }
}
