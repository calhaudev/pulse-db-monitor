import { config } from "@/config";
import { HealthMetric } from "@entities/HealthMetric";
import { BaseHealthCheck } from "@ports/BaseHealthCheck";
import { DatabaseService } from "@ports/DatabaseService";

export class CheckReplicationLag implements BaseHealthCheck {
  constructor(private readonly db: DatabaseService) {}

  async execute(): Promise<HealthMetric> {
    const label = "Replication Lag";
    const threshold = config.THRESHOLD_REPLICATION_LAG;

    const start = Date.now();
    const result = await this.db.query<any>("SHOW SLAVE STATUS;");
    const value =
      result.length > 0 ? Number(result[0].Seconds_Behind_Master ?? 0) : null;
    const warning = typeof value === "number" && value > threshold;
    return {
      label,
      value,
      threshold,
      warning,
      unit: "seconds",
      description: `${warning ? "⚠️" : "✅"} ${label}`,
      responseTime: (Date.now() - start) / 1000,
      timestamp: new Date().toISOString(),
    };
  }
}
