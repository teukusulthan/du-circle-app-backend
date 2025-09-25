import { Request, Response } from "express";
import { prisma } from "../connections/client";
import { AppError } from "../utils/appError";

export const searchUsers = async (req: Request, res: Response) => {
  const me = req.user?.id;
  const keyword = String(req.query.keyword || "").trim();
  if (!keyword) throw new AppError(400, "Keyword is required");

  const limit = Number(req.query.limit) || 25;

  const rows = await prisma.user.findMany({
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
        : (false as any),
    },
    take: limit,
  });

  const data = {
    users: rows.map((u) => ({
      id: u.id,
      username: u.username,
      name: u.full_name,
      followers: u._count.followers,
      is_following:
        Array.isArray((u as any).followers) && (u as any).followers.length > 0,
    })),
  };

  res.status(200).json({
    code: 200,
    status: "success",
    message: "Search fetched successfully",
    data,
  });
};
