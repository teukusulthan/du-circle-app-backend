"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.searchUsers = void 0;
const client_1 = require("../connections/client");
const appError_1 = require("../utils/appError");
const searchUsers = async (req, res) => {
    const me = req.user?.id;
    const keyword = String(req.query.keyword || "").trim();
    if (!keyword)
        throw new appError_1.AppError(400, "Keyword is required");
    const limit = Number(req.query.limit) || 25;
    const rows = await client_1.prisma.user.findMany({
        where: {
            OR: [
                { username: { contains: keyword, mode: "insensitive" } },
                { full_name: { contains: keyword, mode: "insensitive" } },
            ],
        },
        select: {
            id: true,
            username: true,
            full_name: true,
            _count: { select: { followers: true } },
            followers: me
                ? { where: { follower_id: me }, select: { id: true }, take: 1 }
                : false,
        },
        take: limit,
    });
    const data = {
        users: rows.map((u) => ({
            id: u.id,
            username: u.username,
            name: u.full_name,
            followers: u._count.followers,
            is_following: Array.isArray(u.followers) && u.followers.length > 0,
        })),
    };
    res.status(200).json({
        code: 200,
        status: "success",
        message: "Search fetched successfully",
        data,
    });
};
exports.searchUsers = searchUsers;
