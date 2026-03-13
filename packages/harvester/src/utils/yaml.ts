const yaml = require("js-yaml");

/**
 * YAML serialization utilities with Salve-standard formatting
 */
export function stringifyYaml(data: any): string {
    let output = yaml.dump(data, {
        lineWidth: -1,
        noRefs: true,
        quotingType: "'",
        forceQuotes: false,
    });

    // Post-process to restore month headings if this is an events file
    if (data.events && Array.isArray(data.events)) {
        output = restoreMonthHeadings(output, data.events);
    }

    return output;
}

function restoreMonthHeadings(yamlStr: string, events: any[]): string {
    const months = ["January", "February", "March", "April", "May", "June",
        "July", "August", "September", "October", "November", "December"];

    const lines = yamlStr.split("\n");
    const finalLines: string[] = [];
    let currentMonthIndex = -1;
    let eventIdx = 0;
    let inEventsBlock = false;

    for (let i = 0; i < lines.length; i++) {
        const line = lines[i];

        if (line.trim() === "events:") {
            inEventsBlock = true;
            finalLines.push(line);
            continue;
        }

        // Detect start of a new top-level event in the list
        if (inEventsBlock && line.match(/^  - /)) {
            const eventData = events[eventIdx++];

            if (eventData && eventData.date) {
                const dateStr = eventData.date.toString().toLowerCase();
                let monthIdx = -1;

                // Handle "D Month" format
                const monthMatch = dateStr.match(/[a-z]+/);
                if (monthMatch && months.some(m => m.toLowerCase() === monthMatch[0])) {
                    monthIdx = months.findIndex(m => m.toLowerCase() === monthMatch[0]);
                }
                // Handle "pascha:X" format
                else if (dateStr.startsWith('pascha:')) {
                    const offset = parseInt(dateStr.split(':')[1], 10);
                    if (offset < 39) monthIdx = 3; // April approx
                    else if (offset < 49) monthIdx = 4; // May approx
                    else monthIdx = 5; // June approx
                }
                // Handle "MM:sun:N" or "MM:DD:next:weekday" formats
                else if (dateStr.match(/^\d{2}:/)) {
                    monthIdx = parseInt(dateStr.split(':')[0], 10) - 1;
                }

                if (monthIdx !== -1 && monthIdx > currentMonthIndex) {
                    const monthName = months[monthIdx];
                    // Add spacer before heading if not the very first event in the block
                    if (finalLines.length > 0 && finalLines[finalLines.length - 1].trim() !== "events:") {
                        finalLines.push("");
                    }
                    finalLines.push(`    # ─── ${monthName} ─────────────────────────────────────────────────────`);
                    finalLines.push("");
                    currentMonthIndex = monthIdx;
                } else if (eventIdx > 1) {
                    // Add a blank line between events in the same month
                    finalLines.push("");
                }
            }
        }

        // Decode Unicode escapes (e.g. \U0001F4DA -> 📚)
        let processedLine = line.replace(/\\U([0-9A-F]{8})/gi, (_, hex) => {
            return String.fromCodePoint(parseInt(hex, 16));
        }).replace(/\\u([0-9A-F]{4})/gi, (_, hex) => {
            return String.fromCharCode(parseInt(hex, 16));
        });

        finalLines.push(processedLine);
    }

    return finalLines.join("\n");
}
