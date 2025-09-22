import { Request, Response } from "express";
import { prisma } from "../connections/client";
import { AppError } from "../utils/appError";

export const getReplies = async (req: Request, res: Response) => {
  const threadId = Number(req.params.id);

  const replies = await prisma.reply.findMany({
    where: { thread_id: threadId },
    orderBy: { created_at: "asc" },
    include: {
      user: true,
    },
  });

  const result = replies.map((r) => ({
    id: r.id,
    content: r.content,
    image: r.image,
    user: {
      id: r.user.id,
      username: r.user.username,
      name: r.user.full_name,
      profile_picture: r.user.profile_photo,
    },
    created_at: r.created_at.toISOString(),
  }));

  res.status(200).json({
    code: 200,
    status: "success",
    message: "Replies fetched succesfully",
    data: { replies: result },
  });
};

export const createReply = async (req: Request, res: Response) => {
  const io = req.app.get("io");
  const threadId = Number(req.params.id);
  const userId = Number(req.user?.id);

  if (!userId) throw new AppError(401, "Unauthorized");
  if (!threadId || Number.isNaN(threadId))
    throw new AppError(400, "Invalid thread id");

  const content = String(req.body.content ?? "");
  if (!content.trim()) throw new AppError(400, "Content is required");

  const file = req.file;
  const imageUrl = file
    ? `${req.protocol}://${req.get("host")}/uploads/${file.filename}`
    : null;

  const reply = await prisma.reply.create({
    data: {
      user_id: userId,
      thread_id: threadId,
      content,
      image: imageUrl,
    },
    include: {
      user: {
        select: {
          id: true,
          username: true,
          full_name: true,
          profile_photo: true,
        },
      },
    },
  });

  const payload = {
    id: reply.id,
    thread_id: threadId,
    content: reply.content,
    image: reply.image,
    created_at: reply.created_at.toISOString(),
    user: {
      id: reply.user.id,
      username: reply.user.username,
      name: reply.user.full_name,
      profile_picture: reply.user.profile_photo,
    },
    likes: 0,
    isLiked: false,
  };

  io.to(`thread:${threadId}`).emit("reply:created", payload);

  await prisma.thread.update({
    where: { id: threadId },
    data: { number_of_replies: { increment: 1 } },
  });
  io.to("timeline:global").emit("thread:updated", {
    id: threadId,
    reply: undefined,
  });

  return res.status(201).json({
    code: 201,
    status: "success",
    message: "Reply created succesfully.",
    data: { reply: payload },
  });
};
