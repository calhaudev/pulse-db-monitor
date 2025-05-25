import { config } from "@/config";
import { HealthMetric } from "@entities/HealthMetric";
import { BaseHealthCheck } from "@ports/BaseHealthCheck";
import { DatabaseService } from "@ports/DatabaseService";

export class CheckDiskUsage implements BaseHealthCheck {
  constructor(
    private readonly db: DatabaseService,
    private readonly dbName: string
  ) {}

  async execute(): Promise<HealthMetric> {
    const label = "Database Size";
    const start = Date.now();
    const sql = `SELECT ROUND(SUM(data_length + index_length) / 1024 / 1024, 2) AS totalMB
    FROM information_schema.tables WHERE table_schema = ?`;

    const result = await this.db.query<{ totalMB: number }>(sql, [this.dbName]);
    const value = result[0]?.totalMB || 0;
    const warning = value > config.THRESHOLD_DB_SIZE;

    return {
      label,
      value,
      unit: "MB",
      warning,
      threshold: config.THRESHOLD_DB_SIZE,
      description: `${
        warning ? "⚠️" : "✅"
      } ${label}: ${value}Mb / Threshold: ${config.THRESHOLD_DB_SIZE}Mb)`,
      responseTime: (Date.now() - start) / 1000,
      timestamp: new Date().toISOString(),
    };
  }
}
