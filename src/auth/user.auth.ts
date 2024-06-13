import { Request, Response, NextFunction } from "express";
import { HttpError } from "@exceptions/http.exceptions";
import { log } from "@utils/logger.utils";
import { Bcrypt } from "@utils/bcrypt.utils";
import * as jwt from "jsonwebtoken";
import { UserRepository } from "@repository/users.repository";
import { Payload } from "@interfaces/payload.interface";
import { JWT } from "@services/jwt.service";
import { User } from "@prisma/client";
import { TokenType } from "@enums/token.enum";


export class UserAuthentication {
    static login = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
        try {
            const { email, password } = req.body;

            const user = await UserRepository.get_email(email);

            if (!user) {
                throw new HttpError(404, `user not found with email:: ${email}`);
            }

            const isPasswordMatch = await Bcrypt.compare(password, user.password);

            if (!isPasswordMatch) {
                throw new HttpError(401, "invalid credentials");
            }

            if(user.is_verified != true) {
                throw new HttpError(401, "user not verified, verify your email");
            }

            const payload: Payload = {
                user_id: user.id,
                email: user.email,
                user_type: user.role,
                type: TokenType.LOGIN,
            }

            const jwt_token: string = await JWT.sign_jwt(payload, "10d");

            res.status(200).json({ status: 200, data: { user }, message: "login successful", jwt: jwt_token });
        } catch (error) {
            log.error(error);
            next(error);
        }
    }

    static logout = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
        try {
            const token = req.headers.authorization?.split(" ")[1];
            
            if (!token) {
                throw new HttpError(401, "unauthorized");
            }
            const payload: Payload = await JWT.verify_jwt(token);

            const user_id = payload.user_id;

            const user = await UserRepository.get_id(user_id);

            if (!user) {
                throw new HttpError(404, "user not found");
            }
            
            res.status(200).json({ status: 200, message: "logout successful" });
        }
        catch (error) {
            log.error(error);
            next(error);
        }
    }
}