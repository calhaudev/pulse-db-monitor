import { HealthMetric } from "@entities/HealthMetric";
import { DatabaseService } from "@ports/DatabaseService";

export class CheckDatabaseHealth {
  constructor(private readonly dbService: DatabaseService) {}

  async execute(): Promise<HealthMetric> {
    const label = "Database Status";
    const start = Date.now();
    try {
      await this.dbService.ping();
      return {
        label,
        description: `✅ ${label}`,
        value: "Ok",
        responseTime: (Date.now() - start) / 1000,
        timestamp: new Date().toISOString(),
        warning: false,
      };
    } catch (err) {
      return {
        label,
        description: `⚠️ ${label}`,
        value:
          "Failed: " + (err instanceof Error ? err.message : "unknown error"),
        responseTime: (Date.now() - start) / 1000,
        timestamp: new Date().toISOString(),
        warning: true,
      };
    }
  }
}
