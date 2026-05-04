import { createClient } from "redis";

const parseRedisHostConfig = () => {
  const rawHost = (process.env.REDIS_HOST || "").trim();
  const hostWithoutProtocol = rawHost
    .replace(/^redis:\/\//i, "")
    .replace(/^rediss:\/\//i, "");

  const [hostPart, portPart] = hostWithoutProtocol.split(":");
  const derivedPortMatch = (hostPart || "").match(/^redis-(\d+)\./i);

  const host = hostPart || "127.0.0.1";
  const port = Number(
    process.env.REDIS_PORT || portPart || derivedPortMatch?.[1] || 6379,
  );

  return { host, port };
};

export const createRedisConnection = async () => {
  const { host, port } = parseRedisHostConfig();

  const client = createClient({
    socket: {
      host,
      port,
      reconnectStrategy: (retries) => Math.min(retries * 100, 3000),
    },
    password: process.env.REDIS_PASSWORD || undefined,
  });

  client.on("error", (error) => {
    console.error("Redis client error:", error.message);
  });

  await client.connect();
  return client;
};
