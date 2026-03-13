/**
 * Core interface for all Salve Harvesters.
 */
export interface SalveHarvester {
    /** Unique identifier for the harvester (e.g., 'un-observances') */
    id: string;

    /** 
     * Executes the harvesting process.
     * @returns The raw data object to be serialized to YAML.
     */
    harvest(): Promise<any>;

    /** Default output path relative to project root */
    defaultOutputPath: string;
}

export interface HarvesterOptions {
    dryRun?: boolean;
    skipWikidata?: boolean;
}
