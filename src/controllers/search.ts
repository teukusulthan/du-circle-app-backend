import { Request, Response } from "express";
import { prisma } from "../connections/client";

const uid = (id: number) => `user_id_${id}`;

export const searchUser = async (req: Request, res: Response) => {
  const keyword = String(req.query.keyword || "").trim();
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
    },
  });

  const data = {
    users: rows.map((u) => ({
      id: u.id,
      username: u.username,
      name: u.full_name,
      followers: u._count.followers,
    })),
  };

  res.status(200).json({
    code: 200,
    status: "success",
    message: "User searched succesfully",
    data,
  });
};
