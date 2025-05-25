import { SESClient, SendEmailCommand } from "@aws-sdk/client-ses";
import { config } from "@/config";
import { HealthMetric } from "@/domain/entities/HealthMetric";

export class EmailNotifier {
  private readonly client = new SESClient({
    region: config.SES_REGION,
    credentials: {
      accessKeyId: config.SES_ACCESS_KEY,
      secretAccessKey: config.SES_SECRET_KEY,
    },
  });

  async notify(metrics: HealthMetric[]) {
    const hasWarnings = metrics.some((metric) => metric.warning);
    const subject = `DB Health Check - ${hasWarnings ? "Warning ⚠️" : "OK ✅"}`;
    let body = `
      <h2>🚨 DATABASE HEALTH REPORT</h2>
      <div style="display:block; margin: 5px 0px; border-radius: 4px; background-color: #f4f4f4; padding: 10px;">
    `;

    for (const metric of metrics) {
      const warning =
        metric.warning ||
        metric.responseTime > config.QUERY_TIMEOUT_THRESHOLD_MS;

      body += `
        <h4>${metric.description}</h4>
        - Success: ${!metric.warning} <br />
        - Response Time: ${metric.responseTime} seconds <br />
        <br />
        ${
          warning
            ? "Warning: Response time exceeded threshold or check failed!"
            : ""
        }
      `;
    }

    body += `</div>`;

    const command = new SendEmailCommand({
      Destination: { ToAddresses: [config.EMAIL_TO] },
      Source: config.EMAIL_FROM,
      Message: {
        Subject: { Data: subject },
        Body: { Html: { Data: body } },
      },
    });

    await this.client.send(command);
  }
}
