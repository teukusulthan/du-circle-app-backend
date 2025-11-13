"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.unfollow = exports.follow = exports.getFollows = void 0;
const client_1 = require("../connections/client");
const appError_1 = require("../utils/appError");
const zod_1 = require("zod");
const uid = (id) => `user_id_${id}`;
const getFollows = async (req, res) => {
    const me = req.user?.id;
    if (!me)
        throw new appError_1.AppError(401, "  Unauthorized");
    const type = req.query.type?.toLowerCase() || "followers";
    if (type === "followers") {
        const rows = await client_1.prisma.following.findMany({
            where: { following_id: me },
            select: {
                follower_id: true,
                follower_user: {
                    select: {
                        id: true,
                        username: true,
                        full_name: true,
                        profile_photo: true,
                    },
                },
            },
        });
        const followerIds = rows.map((r) => r.follower_id);
        const mutuals = followerIds.length
            ? await client_1.prisma.following.findMany({
                where: { follower_id: me, following_id: { in: followerIds } },
                select: { following_id: true },
            })
            : [];
        const iFollowSet = new Set(mutuals.map((m) => m.following_id));
        const data = {
            followers: rows.map((r) => ({
                id: uid(r.follower_user.id),
                username: r.follower_user.username,
                name: r.follower_user.full_name,
                avatar: r.follower_user.profile_photo ?? null,
                is_following: iFollowSet.has(r.follower_user.id),
            })),
        };
        res.status(200).json({
            code: 200,
            status: zod_1.success,
            message: "Followers fetched succesfully",
            data,
        });
    }
    if (type === "following") {
        const rows = await client_1.prisma.following.findMany({
            where: { follower_id: me },
            select: {
                following_user: {
                    select: {
                        id: true,
                        username: true,
                        full_name: true,
                        profile_photo: true,
                    },
                },
            },
        });
        const data = {
            following: rows.map((r) => ({
                id: uid(r.following_user.id),
                username: r.following_user.username,
                name: r.following_user.full_name,
                avatar: r.following_user.profile_photo ?? null,
            })),
        };
        return res.status(200).json({
            code: 200,
            status: "success",
            message: "Following fetched succesfully",
            data,
        });
    }
    throw new appError_1.AppError(400, "invalid type. Use 'followers' or 'following'.");
};
exports.getFollows = getFollows;
const follow = async (req, res) => {
    const me = req.user?.id;
    if (!me)
        throw new appError_1.AppError(401, "Unauthorized");
    const { followed_user_id } = req.body;
    const targetId = Number(followed_user_id);
    if (!targetId || !Number.isInteger(targetId) || targetId <= 0) {
        throw new appError_1.AppError(400, "Invalid body");
    }
    if (me === targetId) {
        throw new appError_1.AppError(400, "You cannot follow yourself");
    }
    const target = await client_1.prisma.user.findUnique({ where: { id: targetId } });
    if (!target)
        throw new appError_1.AppError(404, "User not found");
    await client_1.prisma.following
        .create({
        data: { follower_id: me, following_id: targetId },
    })
        .catch(() => null);
    return res.status(200).json({
        code: 200,
        status: "success",
        message: "Followed succesfully",
        data: {
            user_id: uid(targetId),
            is_following: true,
        },
    });
};
exports.follow = follow;
const unfollow = async (req, res) => {
    const me = req.user?.id;
    if (!me)
        throw new appError_1.AppError(401, "Unauthorized");
    const { followed_id } = req.body;
    const targetId = Number(followed_id);
    if (!Number.isSafeInteger(targetId) || targetId <= 0) {
        throw new appError_1.AppError(400, "Invalid Body");
    }
    await client_1.prisma.following.deleteMany({
        where: { follower_id: me, following_id: targetId },
    });
    return res.status(200).json({
        code: 200,
        status: "success",
        message: "Unfollowed Succesfully",
        data: {
            user_id: uid(targetId),
            is_following: false,
        },
    });
};
exports.unfollow = unfollow;
