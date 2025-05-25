import { HealthMetric } from "@entities/HealthMetric";

export interface BaseHealthCheck {
  execute(): Promise<HealthMetric>;
}
