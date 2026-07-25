import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import Redis from 'ioredis';

@Injectable()
export class RedisService {
  private readonly redis: Redis;

  constructor(private readonly configService: ConfigService) {
    this.redis = new Redis({
      host: this.configService.get<string>('REDIS_HOST'),
      port: this.configService.get<number>('REDIS_PORT'),
    });
  }

  async set(key: string, value: unknown, ttl?: number) {
  const data = JSON.stringify(value);

  if (ttl) {
    await this.redis.set(key, data, 'EX', ttl);
    return;
  }

  await this.redis.set(key, data);
}
  async get<T>(key: string): Promise<T | null> {
  const value = await this.redis.get(key);

  if (!value) {
    return null;
  }

  return JSON.parse(value) as T;
}

  async del(key: string) {
    return this.redis.del(key);
  }

  async exists(key: string) {
    return this.redis.exists(key);
  }
  async keys(pattern: string) {
  return this.redis.keys(pattern);
}
}