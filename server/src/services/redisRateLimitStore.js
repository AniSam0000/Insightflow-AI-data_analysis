export class RedisRateLimitStore {
  constructor({ client, windowMs, prefix = "rl:" }) {
    this.client = client;
    this.windowMs = windowMs;
    this.prefix = prefix;
  }

  async increment(key) {
    const redisKey = `${this.prefix}${key}`;

    const [totalHitsRaw, ttlRaw] = await this.client
      .multi()
      .incr(redisKey)
      .pTTL(redisKey)
      .exec();

    let totalHits = Number(totalHitsRaw);
    let ttlMs = Number(ttlRaw);

    if (!Number.isFinite(totalHits) || totalHits < 1) {
      totalHits = 1;
    }

    if (!Number.isFinite(ttlMs) || ttlMs < 0) {
      ttlMs = this.windowMs;
      await this.client.pExpire(redisKey, this.windowMs);
    }

    return {
      totalHits,
      resetTime: new Date(Date.now() + ttlMs),
    };
  }

  async decrement(key) {
    const redisKey = `${this.prefix}${key}`;
    await this.client.decr(redisKey);
  }

  async resetKey(key) {
    const redisKey = `${this.prefix}${key}`;
    await this.client.del(redisKey);
  }

  async resetAll() {
    const pattern = `${this.prefix}*`;
    let cursor = "0";

    do {
      const { cursor: nextCursor, keys } = await this.client.scan(cursor, {
        MATCH: pattern,
        COUNT: 100,
      });

      cursor = nextCursor;

      if (keys.length > 0) {
        await this.client.del(keys);
      }
    } while (cursor !== "0");
  }
}
