import { Request, Response } from "express";
import { prisma } from "../connections/client";
import { AppError } from "../utils/appError";

export const getThreads = async (req: Request, res: Response) => {
  const limit = Number(req.query.limit) || 25;
  const userId = req.user?.id; // dari middleware auth

  const threads = await prisma.thread.findMany({
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

export const createThread = async (req: Request, res: Response) => {
  const userId = req.user?.id;
  if (!userId) throw new AppError(401, "Unauthorized");

  const { content } = req.body as { content: string };

  const file = req.file;
  const imageUrl = file
    ? `${req.protocol}://${req.get("host")}/uploads/${file.filename}`
    : null;

  const thread = await prisma.thread.create({
    data: {
      content,
      image: imageUrl,
      created_by: userId,
    },
  });

  res.status(201).json({
    message: "Thread created succesfully",
    data: thread,
  });
};
