/**
 * SALVE Composition Engine
 *
 * Responsible for combining a greeting phrase and an address form into
 * a final rendered salutation string, with locale-aware handling of
 * punctuation, separators, and capitalization.
 */

import {
    SalveRenderPolicy,
    TerminalPunctuationPolicy,
    SeparatorPolicy,
    CapitalizationPolicy,
    AddressOutputForm,
} from "./types";

const TERMINAL_PUNCT = /([.!?;:…¡¿]+)$/;

export interface CompositionInput {
    greeting?: string;
    address?: string;
    renderPolicy?: SalveRenderPolicy;
}

export interface CompositionResult {
    text: string;
    greeting: string;
    address: string;
    appliedPolicy: Required<SalveRenderPolicy>;
}

const DEFAULT_RENDER_POLICY: Required<SalveRenderPolicy> = {
    separator: "comma",
    terminalPunctuation: "move_to_end",
    capitalization: "preserve",
    outputForm: "salutation",
    customTemplate: "",
};

/**
 * Locale-specific default render policies.
 * These encode cultural norms for written address composition.
 */
const LOCALE_DEFAULTS: Record<string, Partial<SalveRenderPolicy>> = {
    de: { separator: "comma", terminalPunctuation: "move_to_end" },
    nl: { separator: "comma", terminalPunctuation: "move_to_end" },
    fr: { separator: "comma", terminalPunctuation: "move_to_end" },
    en: { separator: "comma", terminalPunctuation: "move_to_end" },
    el: { separator: "comma", terminalPunctuation: "move_to_end" },
};

export class CompositionEngine {
    /**
     * Compose a greeting and address into a rendered salutation.
     */
    compose(input: CompositionInput, locale?: string): CompositionResult {
        const policy = this.resolvePolicy(input.renderPolicy, locale);
        const greeting = input.greeting ?? "";
        const address = input.address ?? "";

        if (!greeting && !address) {
            return { text: "", greeting, address, appliedPolicy: policy };
        }

        if (!address) {
            return { text: greeting, greeting, address, appliedPolicy: policy };
        }

        if (!greeting) {
            const text = this.formatAddressOnly(address, policy);
            return { text, greeting, address, appliedPolicy: policy };
        }

        if (policy.customTemplate) {
            const text = this.applyCustomTemplate(policy.customTemplate, greeting, address, policy);
            return { text, greeting, address, appliedPolicy: policy };
        }

        const text = this.composeDefault(greeting, address, policy);
        return { text, greeting, address, appliedPolicy: policy };
    }

    private resolvePolicy(
        override?: SalveRenderPolicy,
        locale?: string,
    ): Required<SalveRenderPolicy> {
        const base = locale ? this.getLocaleBase(locale) : "";
        const localeDefaults = LOCALE_DEFAULTS[base] ?? {};

        return {
            separator: override?.separator ?? localeDefaults.separator ?? DEFAULT_RENDER_POLICY.separator,
            terminalPunctuation:
                override?.terminalPunctuation ??
                localeDefaults.terminalPunctuation ??
                DEFAULT_RENDER_POLICY.terminalPunctuation,
            capitalization:
                override?.capitalization ?? localeDefaults.capitalization ?? DEFAULT_RENDER_POLICY.capitalization,
            outputForm: override?.outputForm ?? DEFAULT_RENDER_POLICY.outputForm,
            customTemplate: override?.customTemplate ?? DEFAULT_RENDER_POLICY.customTemplate,
        };
    }

    private getLocaleBase(locale: string): string {
        return locale.split("-")[0].toLowerCase();
    }

    private composeDefault(
        greeting: string,
        address: string,
        policy: Required<SalveRenderPolicy>,
    ): string {
        let strippedGreeting = greeting;
        let trailingPunct = "";

        const match = TERMINAL_PUNCT.exec(greeting);
        if (match) {
            trailingPunct = match[1];
            strippedGreeting = greeting.slice(0, -trailingPunct.length);
        }

        const capitalizedAddress = this.applyCapitalization(address, policy.capitalization);
        const separator = this.resolveSeparator(policy.separator);

        switch (policy.terminalPunctuation) {
            case "move_to_end":
                return `${strippedGreeting}${separator}${capitalizedAddress}${trailingPunct}`;

            case "strip":
                return `${strippedGreeting}${separator}${capitalizedAddress}`;

            case "preserve":
                if (trailingPunct) {
                    return `${greeting} ${capitalizedAddress}`;
                }
                return `${greeting}${separator}${capitalizedAddress}`;
        }
    }

    private formatAddressOnly(address: string, policy: Required<SalveRenderPolicy>): string {
        const capitalizedAddress = this.applyCapitalization(address, policy.capitalization);

        switch (policy.outputForm) {
            case "letterhead":
            case "email_opening":
                return `${capitalizedAddress},`;
            default:
                return capitalizedAddress;
        }
    }

    private applyCapitalization(text: string, policy: CapitalizationPolicy): string {
        switch (policy) {
            case "preserve":
                return text;
            case "lowercase_address":
                return text.toLowerCase();
            case "sentence_case":
                if (text.length === 0) return text;
                return text[0].toUpperCase() + text.slice(1);
        }
    }

    private resolveSeparator(policy: SeparatorPolicy): string {
        switch (policy) {
            case "comma":
                return ", ";
            case "space":
                return " ";
            case "newline":
                return "\n";
            case "none":
                return "";
            case "template":
                return ", ";
        }
    }

    private applyCustomTemplate(
        template: string,
        greeting: string,
        address: string,
        policy: Required<SalveRenderPolicy>,
    ): string {
        let strippedGreeting = greeting;
        let trailingPunct = "";

        const match = TERMINAL_PUNCT.exec(greeting);
        if (match) {
            trailingPunct = match[1];
            strippedGreeting = greeting.slice(0, -trailingPunct.length);
        }

        return template
            .replace("{greeting}", strippedGreeting)
            .replace("{greetingRaw}", greeting)
            .replace("{address}", this.applyCapitalization(address, policy.capitalization))
            .replace("{punctuation}", trailingPunct)
            .trim();
    }
}
