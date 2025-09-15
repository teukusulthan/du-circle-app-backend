import { Request, Response } from "express";
import { prisma } from "../connections/client";

export const getThreads = async (req: Request, res: Response) => {
  const threads = await prisma.thread.findMany;

  res.status(200).json({
    code: 200,
    status: "success",
    message: "threads fetched succesfully",
    data: threads,
  });
};
