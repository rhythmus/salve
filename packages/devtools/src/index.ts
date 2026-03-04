import { SalveEngine, GreetingResult, GreetingContext } from "@salve/core";

export class SalveDevTools {
    private container: HTMLDivElement;
    private engine: SalveEngine;
    private onContextChange?: (context: Partial<GreetingContext>) => void;

    constructor(engine: SalveEngine) {
        this.engine = engine;
        this.container = document.createElement("div");
        this.setupStyles();
        this.render();
    }

    public mount(parent: HTMLElement = document.body) {
        parent.appendChild(this.container);
    }

    public setOnContextChange(callback: (context: Partial<GreetingContext>) => void) {
        this.onContextChange = callback;
    }

    private setupStyles() {
        const style = document.createElement("style");
        style.textContent = `
            .salve-devtools {
                position: fixed;
                bottom: 20px;
                right: 20px;
                width: 350px;
                max-height: 80vh;
                background: rgba(255, 255, 255, 0.95);
                backdrop-filter: blur(10px);
                border: 1px solid #ddd;
                border-radius: 12px;
                box-shadow: 0 8px 32px rgba(0,0,0,0.15);
                font-family: ui-sans-serif, system-ui, sans-serif;
                z-index: 9999;
                display: flex;
                flex-direction: column;
                overflow: hidden;
                transition: transform 0.3s ease;
            }
            .salve-devtools.minimized {
                transform: translateY(calc(100% - 40px));
            }
            .salve-devtools-header {
                padding: 10px 15px;
                background: #f8f9fa;
                border-bottom: 1px solid #eee;
                display: flex;
                justify-content: space-between;
                align-items: center;
                cursor: pointer;
            }
            .salve-devtools-title {
                font-weight: bold;
                font-size: 14px;
                color: #333;
            }
            .salve-devtools-body {
                padding: 15px;
                overflow-y: auto;
                flex-grow: 1;
            }
            .salve-devtools-section {
                margin-bottom: 20px;
            }
            .salve-devtools-label {
                display: block;
                font-size: 11px;
                color: #666;
                margin-bottom: 5px;
                text-transform: uppercase;
                letter-spacing: 0.5px;
            }
            .salve-devtools-input {
                width: 100%;
                padding: 8px;
                border: 1px solid #ddd;
                border-radius: 6px;
                font-size: 13px;
                margin-bottom: 10px;
            }
            .salve-devtools-trace {
                background: #1e1e1e;
                color: #d4d4d4;
                padding: 10px;
                border-radius: 6px;
                font-family: ui-monospace, monospace;
                font-size: 12px;
                white-space: pre-wrap;
            }
            .salve-devtools-score {
                display: flex;
                justify-content: space-between;
                padding: 4px 0;
                border-bottom: 1px solid #eee;
            }
            .salve-devtools-score.winner {
                color: #28a745;
                font-weight: bold;
            }
        `;
        document.head.appendChild(style);
    }

    private render() {
        this.container.className = "salve-devtools";
        this.container.innerHTML = `
            <div class="salve-devtools-header" id="salve-dev-header">
                <span class="salve-devtools-title">Salve DevTools</span>
                <span id="salve-dev-toggle">▼</span>
            </div>
            <div class="salve-devtools-body">
                <div class="salve-devtools-section">
                    <span class="salve-devtools-label">Context Mocking</span>
                    <input type="date" class="salve-devtools-input" id="salve-dev-date">
                    <select class="salve-devtools-input" id="salve-dev-formality">
                        <option value="formal">Formal</option>
                        <option value="informal">Informal</option>
                    </select>
                </div>
                <div class="salve-devtools-section">
                    <span class="salve-devtools-label">Resolution Trace</span>
                    <div class="salve-devtools-trace" id="salve-dev-trace">No trace data available.</div>
                </div>
                <div class="salve-devtools-section">
                    <span class="salve-devtools-label">Candidates</span>
                    <div id="salve-dev-candidates"></div>
                </div>
            </div>
        `;

        const header = this.container.querySelector("#salve-dev-header") as HTMLElement;
        header.onclick = () => this.container.classList.toggle("minimized");

        const dateInput = this.container.querySelector("#salve-dev-date") as HTMLInputElement;
        dateInput.onchange = () => this.emitChange();

        const formalityInput = this.container.querySelector("#salve-dev-formality") as HTMLSelectElement;
        formalityInput.onchange = () => this.emitChange();
    }

    private emitChange() {
        if (this.onContextChange) {
            const dateInput = this.container.querySelector("#salve-dev-date") as HTMLInputElement;
            const formalityInput = this.container.querySelector("#salve-dev-formality") as HTMLSelectElement;

            this.onContextChange({
                now: dateInput.value ? new Date(dateInput.value) : undefined,
                formality: formalityInput.value as "formal" | "informal"
            });
        }
    }

    public updateTrace(result: GreetingResult) {
        const traceEl = this.container.querySelector("#salve-dev-trace") as HTMLElement;
        traceEl.textContent = JSON.stringify({
            eventId: result.metadata.eventId,
            domain: result.metadata.domain,
            score: result.metadata.score,
            address: result.address,
            salutation: result.salutation
        }, null, 2);

        // TODO: Render actual candidates list if we expose it in the engine
    }
}
