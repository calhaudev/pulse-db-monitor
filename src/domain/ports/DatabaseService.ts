export interface DatabaseService {
  query<T = unknown>(sql: string, values?: unknown[]): Promise<T[]>;
  ping(): Promise<void>;
}
