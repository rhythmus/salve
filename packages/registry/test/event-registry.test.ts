import { EventRegistry, SEED_EVENTS, SalveRegistry } from "@salve/registry";

describe("EventRegistry", () => {
    let registry: EventRegistry;

    beforeEach(() => {
        registry = new EventRegistry();
        registry.registerEvents(SEED_EVENTS);
    });

    test("should register and retrieve events by id", () => {
        const event = registry.getEvent("salve.event.religious.christian.christmas");
        expect(event).toBeDefined();
        expect(event!.domain).toBe("religious");
        expect(event!.description).toContain("Christmas");
    });

    test("should filter events by domain", () => {
        const bankEvents = registry.getEventsByDomain("bank");
        expect(bankEvents.length).toBeGreaterThan(0);
        bankEvents.forEach(e => expect(e.domain).toBe("bank"));
    });

    test("should resolve aliases", () => {
        const canonical = registry.resolveAlias("national_day_france");
        expect(canonical).toBe("salve.event.bank.fr.bastille_day");
    });

    test("resolveId should return canonical for known alias", () => {
        const id = registry.resolveId("national_day_france");
        expect(id).toBe("salve.event.bank.fr.bastille_day");
    });

    test("resolveId should return input for unknown alias", () => {
        const id = registry.resolveId("unknown_event");
        expect(id).toBe("unknown_event");
    });

    test("getAllEvents returns seeded events", () => {
        const all = registry.getAllEvents();
        expect(all.length).toBe(SEED_EVENTS.length);
    });
});

describe("SalveRegistry", () => {
    test("constructor seeds default events", () => {
        const registry = new SalveRegistry();
        const all = registry.events.getAllEvents();
        expect(all.length).toBe(SEED_EVENTS.length);
    });

    test("has greetingRules registry", () => {
        const registry = new SalveRegistry();
        expect(registry.greetingRules).toBeDefined();
    });
});
