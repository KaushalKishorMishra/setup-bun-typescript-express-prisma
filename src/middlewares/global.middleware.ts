import { HttpError } from "@/exceptions/http.exceptions";
import { Payload } from "@/interfaces/payload.interface";
import { JWT } from "@/services/jwt.service";
import { log } from "@/utils/logger.utils";
import { Role } from "@prisma/client";
import { Request, Response, NextFunction } from "express";

export class GlobalMiddleware {
    static checkAdmin = (req: Request, res: Response, next: NextFunction) => {
        const decoded: Payload = req.body.decoded;
        const user_type: Role = decoded.user_type;
        try {
            if (user_type !== Role.ADMIN) {
                throw new HttpError(401, "unauthorized");
            }
            next();
        }
        catch (error) {
            log.error(error);
            next(error);
        }
    }
}