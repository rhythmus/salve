/**
 * Simple point-in-polygon check using ray casting algorithm.
 */
export function isPointInPolygon(point: [number, number], polygon: [number, number][]): boolean {
    const [lat, lng] = point;
    let inside = false;
    for (let i = 0, j = polygon.length - 1; i < polygon.length; j = i++) {
        const [latI, lngI] = polygon[i];
        const [latJ, lngJ] = polygon[j];

        const intersect = lngI > lng !== lngJ > lng && lat < ((latJ - latI) * (lng - lngI)) / (lngJ - lngI) + latI;
        if (intersect) inside = !inside;
    }
    return inside;
}

export interface RegionDefinition {
    id: string;
    locale: string;
    polygon: [number, number][];
    priority?: number;
    name?: string;
}

export class LocationResolver {
    constructor(private regions: RegionDefinition[]) { }

    /**
     * Finds the most specific locale for a given coordinate.
     */
    resolveLocale(lat: number, lng: number): string | null {
        // Sort by priority (lowest number first = higher priority)
        const sortedRegions = [...this.regions].sort((a, b) => (a.priority || 100) - (b.priority || 100));

        for (const region of sortedRegions) {
            if (isPointInPolygon([lat, lng], region.polygon)) {
                return region.locale;
            }
        }

        return null;
    }
}
