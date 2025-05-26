import { z } from "zod";
import dotenv from "dotenv";

dotenv.config();

const envSchema = z.object({
  DB_HOST: z.string(),
  DB_PORT: z.coerce.number().default(3306),
  DB_USER: z.string(),
  DB_PASSWORD: z.string(),
  DB_NAME: z.string(),
  CHECK_INTERVAL_MS: z.coerce.number().default(60000),
  CHECK_REPLICATION_LAG: z
    .preprocess((val) => {
      if (typeof val === "string") {
        return val.toLowerCase() === "true";
      }
      return val;
    }, z.boolean())
    .default(false),
  NOTIFY_ONLY_WITH_WARNS: z
    .preprocess((val) => {
      if (typeof val === "string") {
        return val.toLowerCase() === "true";
      }
      return val;
    }, z.boolean())
    .default(true),
  SES_REGION: z.string(),
  SES_ACCESS_KEY: z.string(),
  SES_SECRET_KEY: z.string(),
  EMAIL_FROM: z.string().email(),
  EMAIL_TO: z.string().email(),
  QUERY_TIMEOUT_THRESHOLD_MS: z.coerce.number().default(1000),
  SERVER_PORT: z.coerce.number().default(3000),
  THRESHOLD_CONNECTIONS: z.coerce.number().default(15),
  THRESHOLD_DB_SIZE: z.coerce.number().default(500),
  THRESHOLD_REPLICATION_LAG: z.coerce.number().default(10),
  THRESHOLD_SLOW_QUERIES: z.coerce.number().default(50),
});

export const config = envSchema.parse(process.env);
