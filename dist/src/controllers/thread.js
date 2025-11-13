"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.createThread = exports.getThread = exports.getThreads = void 0;
const client_1 = require("../connections/client");
const appError_1 = require("../utils/appError");
const getThreads = async (req, res) => {
    const limit = Number(req.query.limit) || 25;
    const userId = req.user?.id;
    const threads = await client_1.prisma.thread.findMany({
        take: limit,
        orderBy: { created_at: "desc" },
        include: {
            author: true,
            likes: { select: { user_id: true } },
            replies: { select: { id: true } },
        },
    });
    const data = {
        threads: threads.map((t) => ({
            id: t.id,
            content: t.content,
            image: t.image,
            user: {
                id: t.author?.id,
                username: t.author?.username,
                name: t.author?.full_name,
                profile_picture: t.author?.profile_photo,
            },
            created_at: t.created_at,
            likes: t.likes.length,
            reply: t.replies.length,
            isLiked: userId ? t.likes.some((l) => l.user_id === userId) : false,
        })),
    };
    res.status(200).json({
        code: 200,
        status: "success",
        message: "Get Data Thread Successfully",
        data,
    });
};
exports.getThreads = getThreads;
const getThread = async (req, res) => {
    const id = Number(req.params.id);
    const userId = req.user?.id;
    const thread = await client_1.prisma.thread.findUnique({
        where: { id },
        include: {
            author: true,
            likes: { select: { user_id: true } },
            replies: true,
        },
    });
    if (!thread) {
        throw new appError_1.AppError(404, "Thread not found");
    }
    const data = {
        thread: {
            id: thread.id,
            content: thread.content,
            image: thread.image,
            user: {
                id: thread.author?.id,
                username: thread.author?.username,
                name: thread.author?.full_name,
                profile_picture: thread.author?.profile_photo,
            },
            created_at: thread.created_at,
            likes: thread.likes.length,
            replies: thread.replies.length,
            isLiked: userId ? thread.likes.some((l) => l.user_id === userId) : false,
        },
    };
    res.status(200).json({
        status: "success",
        message: "Thread fetched succesfully",
        data: data,
    });
};
exports.getThread = getThread;
const createThread = async (req, res) => {
    const io = req.app.get("io");
    const userId = req.user?.id;
    if (!userId)
        throw new appError_1.AppError(401, "Unauthorized");
    const { content } = req.body;
    const file = req.file;
    const imageUrl = file
        ? `${req.protocol}://${req.get("host")}/uploads/${file.filename}`
        : null;
    const thread = await client_1.prisma.thread.create({
        data: {
            content,
            image: imageUrl,
            created_by: userId,
        },
        include: {
            author: true,
            likes: { select: { user_id: true } },
            replies: { select: { id: true } },
        },
    });
    const payload = {
        id: thread.id,
        content: thread.content,
        image: thread.image,
        user: {
            id: thread.author?.id,
            username: thread.author?.username,
            name: thread.author?.full_name,
            profile_picture: thread.author?.profile_photo,
        },
        created_at: thread.created_at.toISOString(),
        likes: thread.likes.length,
        reply: thread.replies.length,
        isLiked: false,
    };
    io.to("timeline:global").emit("thread:created", payload);
    res.status(201).json({
        code: 201,
        status: "success",
        message: "Thread created successfully",
        data: payload,
    });
};
exports.createThread = createThread;
