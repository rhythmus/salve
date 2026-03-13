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

    let result = yamlStr;
    const lines = result.split("\n");
    const finalLines: string[] = [];
    let currentMonthIndex = -1;

    for (let i = 0; i < lines.length; i++) {
        const line = lines[i];
        const labelMatch = line.match(/^\s+-\s+label:\s*'?(.+?)'?\s*$/);

        if (labelMatch) {
            // Add a blank line before every event except the first one in a block
            if (finalLines.length > 0 && finalLines[finalLines.length - 1].trim() !== "" && finalLines[finalLines.length - 1].trim() !== "events:") {
                // But only if we didn't just add a heading (which already has a blank after it)
                if (!finalLines[finalLines.length - 1].includes("───")) {
                    finalLines.push("");
                }
            }

            // Find the date for this event 
            const label = labelMatch[1];
            const eventData = events.find(e => e.label === label);
            if (eventData && eventData.date) {
                const monthMatch = eventData.date.match(/[A-Za-z]+/);
                if (monthMatch) {
                    const monthName = monthMatch[0];
                    const monthIdx = months.indexOf(monthName);
                    if (monthIdx !== -1 && monthIdx > currentMonthIndex) {
                        // Add spacer and heading
                        if (finalLines.length > 0 && finalLines[finalLines.length - 1].trim() !== "" && finalLines[finalLines.length - 1].trim() !== "events:") {
                            finalLines.push("");
                        }
                        finalLines.push(`    # ─── ${monthName} ─────────────────────────────────────────────────────`);
                        finalLines.push("");
                        currentMonthIndex = monthIdx;
                    }
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
