"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.likeThread = void 0;
const appError_1 = require("../utils/appError");
const client_1 = require("../connections/client");
const likeThread = async (req, res) => {
    const threadId = Number(req.params.id);
    const userId = Number(req.user?.id);
    if (!threadId)
        throw new appError_1.AppError(400, "Invalid Thread");
    if (!userId)
        throw new appError_1.AppError(401, "Unauthorized");
    const thread = await client_1.prisma.thread.findUnique({ where: { id: threadId } });
    if (!thread)
        throw new appError_1.AppError(404, "Thread not found");
    const liked = await client_1.prisma.like.findUnique({
        where: { user_id_thread_id: { user_id: userId, thread_id: threadId } },
    });
    if (liked) {
        await client_1.prisma.like.delete({
            where: { user_id_thread_id: { user_id: userId, thread_id: threadId } },
        });
        const likes = await client_1.prisma.like.count({ where: { thread_id: threadId } });
        return res.json({
            code: 200,
            status: "success",
            message: "Unliked",
            data: { isLiked: false, likes },
        });
    }
    else {
        await client_1.prisma.like.create({
            data: { user_id: userId, thread_id: threadId },
        });
        const likes = await client_1.prisma.like.count({ where: { thread_id: threadId } });
        return res.json({
            code: 200,
            status: "success",
            message: "Liked",
            data: { isLiked: true, likes },
        });
    }
};
exports.likeThread = likeThread;
