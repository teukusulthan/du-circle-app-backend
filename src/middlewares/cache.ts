import type { Request, Response, NextFunction } from "express";
import { redis } from "../redis";

export function cacheGET(ttlSec = 30) {
  return async (req: Request, res: Response, next: NextFunction) => {
    if (req.method !== "GET") return next();

    const userId = (req as any).user?.id ?? "anon";
    const key = `cache:${userId}:${req.originalUrl}`;

    const hit = await redis.get(key);
    if (hit) return res.json(JSON.parse(hit));

    const original = res.json.bind(res);
    res.json = ((body: any) => {
      if (res.statusCode >= 200 && res.statusCode < 300) {
        redis.set(key, JSON.stringify(body), "EX", ttlSec).catch(() => {});
      }
      return original(body);
    }) as any;

    next();
  };
}
