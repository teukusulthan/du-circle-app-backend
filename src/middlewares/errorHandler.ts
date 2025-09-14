import { Request, Response, NextFunction } from "express";
import { AppError } from "../utils/appError";

export function errorHandler(
  err: unknown,
  _req: Request,
  res: Response,
  _next: NextFunction
) {
  if (err instanceof AppError) {
    return res.status(err.code).json({
      code: err.code,
      status: "error",
      message: err.message,
    });
  }
  console.error(err);
  res.status(500).json({
    code: 500,
    status: "error",
    message: "Internal Server Error",
  });
}
