import jwt from "jsonwebtoken";

const SECRET = process.env.JWT_SECRET as string;
const EXPIRES = "30m";

export function signToken(payload: object) {
  return jwt.sign(payload, SECRET, { expiresIn: EXPIRES });
}

export function verifyToken(token: string) {
  return jwt.verify(token, SECRET);
}
