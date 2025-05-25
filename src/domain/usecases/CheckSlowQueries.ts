import { config } from "@/config";
import { HealthMetric } from "@entities/HealthMetric";
import { BaseHealthCheck } from "@ports/BaseHealthCheck";
import { DatabaseService } from "@ports/DatabaseService";

export class CheckSlowQueries implements BaseHealthCheck {
  constructor(private readonly db: DatabaseService) {}

  async execute(): Promise<HealthMetric> {
    const label = "Slow Queries";
    const threshold = config.THRESHOLD_SLOW_QUERIES;
    const start = Date.now();
    const result = await this.db.query<{ Value: string }>(
      'SHOW GLOBAL STATUS LIKE "Slow_queries";'
    );
    const value = Number(result[0]?.Value || 0);
    const warning = value > threshold;
    return {
      label,
      value,
      threshold,
      warning,
      unit: "queries",
      responseTime: (Date.now() - start) / 1000,
      description: `${
        warning ? "⚠️" : "✅"
      } ${label}: ${value} / Threshold: ${threshold}`,
      timestamp: new Date().toISOString(),
    };
  }
}
