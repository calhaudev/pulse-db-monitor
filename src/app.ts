import Fastify from "fastify";
import { config } from "./config";
import { CheckDatabaseHealth } from "@usecases/CheckDatabaseHealth";
import { DatabaseServiceImpl } from "@infra/DatabaseServiceImpl";
import { EmailNotifier } from "@infra/EmailNotifier";
import { RunFullHealthCheck } from "@usecases/RunFullHealthCheck";
import { CheckConnectionCount } from "@usecases/CheckConnectionCount";
import { CheckDiskUsage } from "@usecases/CheckDiskUsage";
import { CheckSlowQueries } from "@usecases/CheckSlowQueries";
import { CheckReplicationLag } from "./domain/usecases/CheckReplicationLag";

const fastify = Fastify();
const dbService = new DatabaseServiceImpl();
const checker = new CheckDatabaseHealth(dbService);
const notifier = new EmailNotifier();
const fullHealthCheck = new RunFullHealthCheck(
  [
    new CheckDatabaseHealth(dbService),
    new CheckConnectionCount(dbService),
    new CheckDiskUsage(dbService, config.DB_NAME),
    new CheckReplicationLag(dbService),
    new CheckSlowQueries(dbService),
  ],
  notifier
);

const runHealthCheck = async () => {
  const metric = await checker.execute();
  await notifier.notify([metric]);
  return metric;
};

const runFullhealthCheck = async (notifyWithWarningsOnly: boolean) => {
  return await fullHealthCheck.execute(notifyWithWarningsOnly);
};

// Schedule internal interval
setInterval(() => runFullhealthCheck(true), config.CHECK_INTERVAL_MS);

fastify.get("/health-check", async () => {
  return await runHealthCheck();
});

fastify.get("/full-health-check", async () => {
  return await runFullhealthCheck(false);
});

fastify.listen({ port: config.SERVER_PORT }, (err) => {
  if (err) {
    console.error(err);
    process.exit(1);
  }
  console.log(`Server running on http://localhost:${config.SERVER_PORT}`);
});
