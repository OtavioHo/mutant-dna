export interface DatabaseProvider {
  query<T>(text: string, params?: any[]): Promise<T[]>;
  getPool(): any;
  closePool(): Promise<void>;
}
