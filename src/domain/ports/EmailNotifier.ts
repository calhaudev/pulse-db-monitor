import { HealthMetric } from "@entities/HealthMetric";

export interface EmailNotifier {
  notify(metrics: HealthMetric[]): Promise<void>;
}
