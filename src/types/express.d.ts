import "express";

declare global {
  namespace Express {
    interface UserPayload {
      id: number;
    }

    // merge ke Request
    interface Request {
      user?: UserPayload;
    }
  }
}
