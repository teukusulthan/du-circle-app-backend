"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.cacheGET = cacheGET;
const redis_1 = require("../redis");
function cacheGET(ttlSec = 30) {
    return async (req, res, next) => {
        if (req.method !== "GET")
            return next();
        const userId = req.user?.id ?? "anon";
        const key = `cache:${userId}:${req.originalUrl}`;
        const hit = await redis_1.redis.get(key);
        if (hit)
            return res.json(JSON.parse(hit));
        const original = res.json.bind(res);
        res.json = ((body) => {
            if (res.statusCode >= 200 && res.statusCode < 300) {
                redis_1.redis.set(key, JSON.stringify(body), "EX", ttlSec).catch(() => { });
            }
            return original(body);
        });
        next();
    };
}
