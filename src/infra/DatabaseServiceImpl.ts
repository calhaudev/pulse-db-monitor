import mysql from "mysql2/promise";
import { config } from "@/config";
import { DatabaseService } from "@ports/DatabaseService";

export class DatabaseServiceImpl implements DatabaseService {
  private readonly pool = mysql.createPool({
    host: config.DB_HOST,
    port: config.DB_PORT,
    user: config.DB_USER,
    password: config.DB_PASSWORD,
    database: config.DB_NAME,
    waitForConnections: true,
    connectionLimit: 5,
  });

  async query<T>(sql: string, values: unknown[] = []): Promise<T> {
    const [rows] = await this.pool.query(sql, values);
    return rows as T;
  }

  async ping(): Promise<void> {
    const conn = await this.pool.getConnection();
    try {
      await conn.ping();
    } finally {
      conn.release();
    }
  }
}
