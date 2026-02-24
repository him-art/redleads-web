import { Ratelimit } from "@upstash/ratelimit";
import { Redis } from "@upstash/redis";

// Create a new ratelimiter, that allows 10 requests per 10 seconds
const redisUrl = process.env.UPSTASH_REDIS_REST_URL;
const redisToken = process.env.UPSTASH_REDIS_REST_TOKEN;

// Fail-closed ratelimiter for when Redis keys are missing
const mockRatelimit = {
  limit: async () => {
    console.error('[RateLimit] CRITICAL: Upstash Redis not configured — denying request. Set UPSTASH_REDIS_REST_URL and UPSTASH_REDIS_REST_TOKEN.');
    return { success: false, limit: 0, reset: 0, remaining: 0 };
  }
};

export const ratelimit = (redisUrl && redisToken) ? new Ratelimit({
  redis: Redis.fromEnv(),
  limiter: Ratelimit.slidingWindow(10, "10 s"),
  analytics: true,
  prefix: "@upstash/ratelimit",
}) : mockRatelimit as any;

// Admin specific rate limit
export const adminRatelimit = (redisUrl && redisToken) ? new Ratelimit({
  redis: Redis.fromEnv(),
  limiter: Ratelimit.slidingWindow(50, "10 s"),
  analytics: true,
  prefix: "@upstash/ratelimit-admin",
}) : mockRatelimit as any;
