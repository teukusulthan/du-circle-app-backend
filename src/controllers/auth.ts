import { NextFunction, Request, Response } from "express";
import { hashPassword, comparePassword } from "../utils/password";
import { prisma } from "../connections/client";
import { AppError } from "../utils/appError";
import { signToken } from "../utils/jwt";

export const register = async (req: Request, res: Response) => {
  const { username, name, email, password } = req.body as {
    username: string;
    name: string;
    email: string;
    password: string;
  };

  if (!email || !username) {
    throw new AppError(400, "Email and username are required");
  }

  const exist = await prisma.user.findUnique({ where: { email } });
  if (exist) {
    throw new AppError(409, "Email is already used");
  }

  const hashedPassword = await hashPassword(password);

  const user = await prisma.user.create({
    data: {
      username,
      full_name: name,
      email,
      password: hashedPassword,
    },
  });

  const token = signToken({ id: user.id, email: user.email });

  res.status(201).json({
    code: 201,
    status: "success",
    message: "Registered succesfully!",
    data: {
      user_id: user.id,
      username: user.username,
      name: user.full_name,
      email: user.email,
      token: token,
    },
  });
};

export const login = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const { identifier, password } = req.body as {
    identifier: string;
    password: string;
  };

  const idNorm = identifier.trim();

  const user = await prisma.user.findFirst({
    where: {
      OR: [
        { email: { equals: idNorm.toLowerCase(), mode: "insensitive" } },
        { username: { equals: idNorm, mode: "insensitive" } },
      ],
    },
  });

  if (!user) {
    throw new AppError(404, "Account is not registered");
  }

  const ok = await comparePassword(password, user.password);
  if (!ok) {
    throw new AppError(401, "Wrong Password");
  }

  const token = signToken({ id: user.id, email: user.email });

  res.status(200).json({
    code: 201,
    status: "success",
    message: "Logged in succesfully!",
    data: {
      user_id: user.id,
      username: user.username,
      name: user.full_name,
      email: user.email,
      avatar: user.profile_photo,
      token: token,
    },
  });
};

export const profile = async (req: Request, res: Response) => {
  const auth = (req as any).user as { id: number } | undefined;
  if (!auth?.id) {
    throw new AppError(401, "Unauthorized");
  }

  const user = await prisma.user.findUnique({
    where: { id: auth.id },
    select: {
      id: true,
      username: true,
      full_name: true,
      profile_photo: true,
      bio: true,
    },
  });

  if (!user) {
    throw new AppError(404, "User not found");
  }

  const [follower_count, following_count] = await Promise.all([
    prisma.following.count({ where: { following_id: user.id } }),
    prisma.following.count({ where: { follower_id: user.id } }),
  ]);

  res.status(200).json({
    code: 200,
    status: "success",
    message: "Get profile successfully",
    data: {
      id: user.id,
      username: user.username,
      name: user.full_name,
      avatar: user.profile_photo ?? null,
      cover_photo: (user as any).cover_photo ?? null,
      bio: user.bio ?? "",
      follower_count,
      following_count,
    },
  });
};
