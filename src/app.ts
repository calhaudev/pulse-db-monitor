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
const dbConnectionChecker = new CheckDatabaseHealth(dbService);
const notifier = new EmailNotifier();
const fullHealthCheck = new RunFullHealthCheck(
  [
    {
      active: true,
      check: new CheckDatabaseHealth(dbService),
      name: "CheckDatabaseHealth",
    },
    {
      active: true,
      check: new CheckConnectionCount(dbService),
      name: "CheckConnectionCount",
    },
    {
      active: true,
      check: new CheckDiskUsage(dbService, config.DB_NAME),
      name: "CheckDiskUsage",
    },
    {
      active: true,
      check: new CheckSlowQueries(dbService),
      name: "CheckSlowQueries",
    },
    {
      active: config.CHECK_REPLICATION_LAG,
      check: new CheckReplicationLag(dbService),
      name: "CheckReplicationLag",
    },
  ],
  notifier
);

const runHealthCheck = async () => {
  const metric = await dbConnectionChecker.execute();
  await notifier.notify([metric]);
  return metric;
};

const runFullhealthCheck = async (notifyWithWarningsOnly: boolean) => {
  const start = Date.now();
  return await fullHealthCheck
    .execute(notifyWithWarningsOnly)
    .then((results) => {
      console.log(
        `Full health check ran at ${new Date()}, during ${
          (Date.now() - start) / 1000
        }s`
      );
      console.log(results);
    })
    .catch((err) => console.log(err.message));
};

// Schedule internal interval
setInterval(
  () => runFullhealthCheck(config.NOTIFY_ONLY_WITH_WARNS),
  config.CHECK_INTERVAL_MS
);

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
