import { log } from "@utils/logger.utils";
import { HttpError } from "@exceptions/http.exceptions";
import { NextFunction, Request, Response } from "express";

export const ErrorMiddleware = (error: HttpError, req: Request, res: Response, next: NextFunction) => {
    try {
        const status = error.status || 500;
        const message = error.message || "Something went wrong";
        log.error(`[${req.method}] ${req.path} >> StatusCode:: ${status}, Message:: ${message}`);
        res.status(status).json({ method: req.method, path: req.path, status: status, message: message });
    } catch (err) {
        next(err);
    }
}