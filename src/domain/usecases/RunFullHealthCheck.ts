import { HealthMetric } from "@entities/HealthMetric";
import { BaseHealthCheck } from "@ports/BaseHealthCheck";
import { EmailNotifier } from "@ports/EmailNotifier";

type Metric = {
  active: boolean;
  name: string;
  check: BaseHealthCheck;
};

export class RunFullHealthCheck {
  constructor(
    private readonly checks: Metric[],
    private readonly notifier: EmailNotifier
  ) {}

  async execute(notifyWithWarningsOnly: boolean): Promise<HealthMetric[]> {
    const results: HealthMetric[] = [];
    const hasWarnings = results.some((metric) => metric.warning);

    for (const { active, check, name } of this.checks) {
      if (!active) continue;
      const start = Date.now();

      try {
        results.push(await check.execute());
      } catch (err) {
        console.log(err);
        const label = `Check failure: ${name}`;
        results.push({
          label,
          description: `⚠️ ${label}`,
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
