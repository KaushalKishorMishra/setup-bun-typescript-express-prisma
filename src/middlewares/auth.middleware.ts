import { HttpError } from "@/exceptions/http.exceptions";
import { Payload } from "@/interfaces/payload.interface";
import { JWT } from "@/services/jwt.service";
import { log } from "@/utils/logger.utils";
import { Request, Response, NextFunction } from "express";

export class AuthMiddleware {
    static authorization = async (req: Request, res: Response, next: NextFunction) => {
        const token = req.headers.authorization?.split(" ")[1];
        if (!token) {
            throw new HttpError(401, "unauthorized");
        }
        try {
            const decoded: Payload = await JWT.verify_jwt(token);
            req.body.decoded = decoded;
            next();
        } catch (error) {
            log.error(error);
            next(error);
        }
    }
}