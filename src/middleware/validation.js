"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.userRegistrationSchema = void 0;
exports.validateData = validateData;
var zod_1 = require("zod");
var http_status_codes_1 = require("http-status-codes");
var passwordSchema = zod_1.z.string()
    .min(8, { message: "Password must be at least 8 characters long" })
    .regex(/[a-z]/, { message: "Password must contain at least one lowercase letter" })
    .regex(/[A-Z]/, { message: "Password must contain at least one uppercase letter" })
    .regex(/\d/, { message: "Password must contain at least one digit" })
    .regex(/[@$!%*?&]/, { message: "Password must contain at least one special character" });
exports.userRegistrationSchema = zod_1.z.object({
    email: zod_1.z.string().email(),
    firstname: zod_1.z.string(),
    lastname: zod_1.z.string(),
    password: passwordSchema,
});
function validateData(schema) {
    return function (req, res, next) {
        try {
            schema.parse(req.body);
            next();
        }
        catch (error) {
            if (error instanceof zod_1.ZodError) {
                var errorMessages = error.errors.map(function (issue) { return ({
                    message: "".concat(issue.path.join('.'), " is ").concat(issue.message),
                }); });
                res.status(http_status_codes_1.StatusCodes.BAD_REQUEST).json({ error: 'Invalid data', details: errorMessages });
            }
            else {
                res.status(http_status_codes_1.StatusCodes.INTERNAL_SERVER_ERROR).json({ error: 'Internal Server Error' });
            }
        }
    };
}
