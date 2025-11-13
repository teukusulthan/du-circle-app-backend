"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.validate = validate;
function formatZodError(e, source) {
    return e.issues.map((i) => ({
        field: i.path.join("."),
        message: i.message,
        rule: i.code,
        source,
    }));
}
function validate(schema, source = "body") {
    return (req, res, next) => {
        const data = req[source];
        const parsed = schema.safeParse(data);
        if (!parsed.success) {
            const issues = formatZodError(parsed.error, source);
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
        req[source] = parsed.data;
        next();
    };
}
