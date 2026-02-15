import { CacheProvider } from "./cacheProvider.interface";
import { createClient } from "redis";

export class RedisCacheProvider implements CacheProvider {
  private client: any;

  constructor() {
    const noopClient = {
      on: (_: string, __?: any) => {},
      connect: async () => {},
      get: async (_: string) => null,
      setEx: async (_: string, __: number, ___: string) => {},
      set: async (_: string, __: string) => {},
      del: async (_: string) => {},
    };

    try {
      this.client = createClient({ url: process.env.REDIS_URL });
    } catch (err) {
      console.error("Redis createClient error:", err);
      this.client = noopClient as any;
    }

    this.client.on("error", (err: any) => {
      this.client = noopClient;
    });

    this.client.connect().catch((err: any) => {
      this.client = noopClient;
    });
  }

  get = async (key: string): Promise<string | null> => {
    return await this.client.get(key);
  };

  set = async (
    key: string,
    value: string,
    ttlSeconds?: number,
  ): Promise<void> => {
    if (ttlSeconds) {
      await this.client.setEx(key, ttlSeconds, value);
    } else {
      await this.client.set(key, value);
    }
  };

  del = async (key: string): Promise<void> => {
    await this.client.del(key);
  };
}
