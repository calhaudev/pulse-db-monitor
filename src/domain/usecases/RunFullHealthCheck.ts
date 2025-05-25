import { HealthMetric } from "@entities/HealthMetric";
import { BaseHealthCheck } from "@ports/BaseHealthCheck";
import { EmailNotifier } from "@ports/EmailNotifier";

export class RunFullHealthCheck {
  constructor(
    private readonly checks: BaseHealthCheck[],
    private readonly notifier: EmailNotifier
  ) {}

  async execute(notifyWithWarningsOnly: boolean): Promise<HealthMetric[]> {
    const results: HealthMetric[] = [];
    const hasWarnings = results.some((metric) => metric.warning);

    for (const check of this.checks) {
      const start = Date.now();
      try {
        results.push(await check.execute());
      } catch (err) {
        console.log(err);
        results.push({
          label: "Unknown check failure",
          description: "⚠️ Unknown check failure",
          timestamp: new Date().toISOString(),
          responseTime: (Date.now() - start) / 1000,
          value:
            "Failed: " + (err instanceof Error ? err.message : "unknown error"),
          warning: true,
        });
      }
    }

    if (!notifyWithWarningsOnly || hasWarnings) {
      await this.notifier.notify(results);
    }

    return results;
  }
}
