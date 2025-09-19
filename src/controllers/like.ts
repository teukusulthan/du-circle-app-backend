import { Request, Response } from "express";
import { AppError } from "../utils/appError";
import { prisma } from "../connections/client";

export const likeThread = async (req: Request, res: Response) => {
  const threadId = Number(req.params.id);
  const userId = Number(req.user?.id);
  if (!threadId) throw new AppError(400, "Invalid Thread");
  if (!userId) throw new AppError(401, "Unauthorized");

  const thread = await prisma.thread.findUnique({ where: { id: threadId } });
  if (!thread) throw new AppError(404, "Thread not found");

  const liked = await prisma.like.findUnique({
    where: { user_id_thread_id: { user_id: userId, thread_id: threadId } },
  });

  if (liked) {
    await prisma.like.delete({
      where: { user_id_thread_id: { user_id: userId, thread_id: threadId } },
    });
    const likes = await prisma.like.count({ where: { thread_id: threadId } });
    return res.json({
      code: 200,
      status: "success",
      message: "Unliked",
      data: { isLiked: false, likes },
    });
  } else {
    await prisma.like.create({
      data: { user_id: userId, thread_id: threadId },
    });
    const likes = await prisma.like.count({ where: { thread_id: threadId } });
    return res.json({
      code: 200,
      status: "success",
      message: "Liked",
      data: { isLiked: true, likes },
    });
  }
};
