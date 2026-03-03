/**
 * SALVE Memory Providers
 */

import { GreetingMemory } from "./types";

interface MemoryEntry {
    value: boolean;
    expiry?: number;
}

/**
 * In-memory provider using a JS Map.
 * Supports TTL-based expiration.
 */
export class InMemoryMemory implements GreetingMemory {
    private storage = new Map<string, MemoryEntry>();

    public has(key: string): boolean {
        const entry = this.storage.get(key);
        if (!entry) return false;

        if (entry.expiry && Date.now() > entry.expiry) {
            this.storage.delete(key);
            return false;
        }

        return true;
    }

    public record(key: string, ttlMs?: number): void {
        const expiry = ttlMs ? Date.now() + ttlMs : undefined;
        this.storage.set(key, { value: true, expiry });
    }

    public clear(): void {
        this.storage.clear();
    }
}
