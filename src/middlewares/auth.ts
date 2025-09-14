import { Request, Response, NextFunction } from "express";
import { verifyToken } from "../utils/jwt";
import { AppError } from "../utils/appError";

export function authenticate(req: Request, res: Response, next: NextFunction) {
  const header = req.headers.authorization;
  if (!header?.startsWith("Bearer")) {
    throw new AppError(401, "No token");
  }

  try {
    const decoded = verifyToken(header.slice(7));
    (req as any).user = decoded;
    next();
  } catch {
    throw new AppError(401, "Invalid or exppired token");
  }
}
