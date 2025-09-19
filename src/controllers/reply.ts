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
  const threadId = Number(req.params.id);
  const userId = Number(req.user?.id);

  const content = req.body.content;
  const file = req.file;

  if (!content || !content.trim())
    throw new AppError(400, "Content is required");

  const reply = await prisma.reply.create({
    data: {
      user_id: userId,
      thread_id: threadId,
      content: content.trim(),
      image: file ? file.originalname : undefined,
    },
  });

  res.status(200).json({
    code: 200,
    status: "success",
    message: "repply berhasil diposting.",
    data: {
      tweet: {
        id: reply.id.toString(),
        user_id: reply.user_id.toString(),
        content: reply.content,
        image_url: reply.image || null,
        timestamp: reply.created_at.toISOString(),
      },
    },
  });
};
