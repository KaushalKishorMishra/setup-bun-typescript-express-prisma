import { HttpError } from "@exceptions/http.exceptions";
import { Bcrypt } from "@utils/bcrypt.utils";
import { log } from "@utils/logger.utils";
import { User } from "@interfaces/user.interface";
import { UserRepository } from "@repository/users.repository";
import { NextFunction, Request, Response } from "express";

export class UserController {
    static get_users = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
        try {
            const users: User[] = await UserRepository.get_users();
            if (users.length === 0) {
                throw new HttpError(404, "no users found");
            }
            res.status(200).json({ status: 200, data: users, message: "users found" });
        } catch (error) {
            log.error(error);
            next(error);
        }
    }

    static get_user_by_id = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
        try {
            const id: string = req.params.id;
            const user = await UserRepository.get_user_by_id(id);
            if (!user) {
                throw new HttpError(404, `user not found with id:: ${id}`);
            }
            res.status(200).json({ status: 200, data: user, message: "user found" });
        } catch (error) {
            log.error(error);
            next(error);
        }
    }

    static get_user_by_email = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
        try {
            const email: string = req.body.email;
            const user = await UserRepository.get_user_by_email(email);
            if (!user) {
                throw new HttpError(404, `user not found with email:: ${email}`);
            }
            res.status(200).json({ status: 200, data: user, message: "user found" });
        } catch (error) {
            log.error(error);
            next(error);
        }
    }

    static create_user = async (req: Request, res: Response, next: NextFunction): Promise<any> => {
        try {
            const inputData: User = req.body;

            const userExist = await UserRepository.get_user_by_email(inputData.email);

            if (userExist) {
                throw new HttpError(409, `user already exist with email:: ${inputData.email}`);
            }

            const hashedPassword = await Bcrypt.encrypt(inputData.password);

            const data: User = { ...inputData, password: hashedPassword };

            const newUser = await UserRepository.create_user(data);

            return res.status(201).json({ status: 201, data: newUser, message: "user created" });
        } catch (error) {
            log.error(error);
            next(error);
        }
    }
}