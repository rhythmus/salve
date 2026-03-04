import { RemoteNameDayPlugin } from "../src";

describe("RemoteNameDayPlugin", () => {
    test("should fetch and cache name-day entries", async () => {
        const mockResponse = [
            { month: 1, day: 7, saintQids: ["Q43474"] }
        ];

        const mockFetch = jest.fn().mockResolvedValue({
            ok: true,
            json: async () => mockResponse
        });

        const plugin = new RemoteNameDayPlugin({
            endpoint: "https://api.example.com/namedays",
            fetchImpl: mockFetch as any
        });

        const now = new Date(2026, 0, 7); // Jan 7
        const context: any = { locale: "el-GR", affiliations: ["namedays"] };

        const events = await plugin.resolveEvents(now, context);

        expect(mockFetch).toHaveBeenCalledWith("https://api.example.com/namedays?locale=el-GR&month=1&day=7");
        expect(events).toHaveLength(1);
        expect(events[0].id).toBe("nameday-Q43474");

        // Second call should be cached
        await plugin.resolveEvents(now, context);
        expect(mockFetch).toHaveBeenCalledTimes(1);
    });

    test("should handle fetch errors gracefully", async () => {
        const mockFetch = jest.fn().mockResolvedValue({
            ok: false,
            status: 500
        });

        const plugin = new RemoteNameDayPlugin({
            endpoint: "https://api.example.com/namedays",
            fetchImpl: mockFetch as any
        });

        const now = new Date(2026, 0, 7);
        const context: any = { locale: "el-GR" };

        const events = await plugin.resolveEvents(now, context);
        expect(events).toHaveLength(0);
    });
});
