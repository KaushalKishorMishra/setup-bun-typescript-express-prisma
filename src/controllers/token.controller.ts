import { HttpError } from "@/exceptions/http.exceptions";
import { TokenRepository } from "@/repository/token.repository";
import { log } from "@/utils/logger.utils";
import { Token } from "@prisma/client";
import { Request, Response, NextFunction } from "express";

export class TokenController {
    static get_tokens = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
        try {
            const tokens: Token[] = await TokenRepository.get();
            if (tokens.length === 0) {
                throw new HttpError(404, "no tokens found");
            }
            res.status(200).json({ status: 200, data: tokens, message: "tokens found" });
        } catch (error) {
            log.error(error);
            next(error);
        }
    }

    static get_token_by_user_id = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
        try {
            const user_id: string = req.params.user_id;
            const token = await TokenRepository.get_one({ user_id: user_id });
            if (!token) {
                throw new HttpError(404, `token not found with user_id:: ${user_id}`);
            }
            res.status(200).json({ status: 200, data: token, message: "token found" });
        }
        catch (error) {
            log.error(error);
            next(error);
        }
    }

    static create_token = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
        try {
            const inputData: Token = req.body;
            const tokenExist = await TokenRepository.get_one({ user_id: inputData.user_id });
            if (tokenExist) {
                throw new HttpError(409, `token already exist with user_id:: ${inputData.user_id}`);
            }
            const token = await TokenRepository.create(inputData);
            res.status(201).json({ status: 201, data: token, message: "token created" });
        }
        catch (error) {
            log.error(error);
            next(error);
        }
    }
}