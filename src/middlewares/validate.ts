import { ZodError, ZodTypeAny } from "zod";
import { Request, Response, NextFunction } from "express";

type Source = "body" | "query" | "params";

function formatZodError(e: ZodError, source: Source) {
  return e.issues.map((i) => ({
    field: i.path.join("."),
    message: i.message,
    rule: i.code,
    source,
  }));
}

export function validate(schema: ZodTypeAny, source: Source = "body") {
  return (req: Request, res: Response, next: NextFunction) => {
    const data = (req as any)[source];
    const parsed = schema.safeParse(data);

    if (!parsed.success) {
      const issues = formatZodError(parsed.error as ZodError, source);
      return res.status(422).json({
        code: 422,
        status: "fail",
        message: "Validation failed",
        errors: issues,
        meta: {
          path: req.path,
          method: req.method,
          timestamp: new Date().toISOString(),
        },
      });
    }

    (req as any)[source] = parsed.data;
    next();
  };
}
