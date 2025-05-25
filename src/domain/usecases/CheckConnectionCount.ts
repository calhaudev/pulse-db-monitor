import { config } from "@/config";
import { HealthMetric } from "@entities/HealthMetric";
import { BaseHealthCheck } from "@ports/BaseHealthCheck";
import { DatabaseService } from "@ports/DatabaseService";

export class CheckConnectionCount implements BaseHealthCheck {
  constructor(private readonly db: DatabaseService) {}

  async execute(): Promise<HealthMetric> {
    const label = "Active Connections";
    const start = Date.now();
    const result = await this.db.query<{ Value: string }>(
      'SHOW STATUS LIKE "Threads_connected";'
    );
    const value = Number(result[0]?.Value || 0);
    const warning = value > config.THRESHOLD_CONNECTIONS;
    return {
      label,
      value,
      warning,
      unit: "connections",
      description: `${warning ? "⚠️" : "✅"} ${label}: ${value} connections.`,
      responseTime: (Date.now() - start) / 1000,
      threshold: config.THRESHOLD_CONNECTIONS,
      timestamp: new Date().toISOString(),
    };
  }
}
