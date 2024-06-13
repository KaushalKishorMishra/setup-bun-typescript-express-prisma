import { HttpError } from "@exceptions/http.exceptions";
import { Bcrypt } from "@utils/bcrypt.utils";
import { log } from "@utils/logger.utils";
import { Token, User } from "@prisma/client";
import { UserRepository } from "@repository/users.repository";
import { NextFunction, Request, Response } from "express";
import { TokenRepository } from "@/repository/token.repository";
import { Service } from "@/services/service.service";

export class UserController {
    static get_users = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
        try {
            const users: User[] = await UserRepository.get();
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
            const user: User = await UserRepository.get_id(id);
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
            const email: string = req.query.email as string;
            console.log(email)
            const user = await UserRepository.get_email(email);
            if (!user) {
                throw new HttpError(404, `user not found with email:: ${email}`);
            }
            res.status(200).json({ status: 200, data: user, message: "user found" });
        } catch (error) {
            log.error(error);
            next(error);
        }
    }

    static create_user = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
        try {
            const inputData: User = req.body;
            const avatar_path = req.file.path;
            const userExist: User = await UserRepository.get_email(inputData.email);

            if (userExist) {
                throw new HttpError(409, `user already exist with email:: ${inputData.email}`);
            }

            const hashedPassword = await Bcrypt.encrypt(inputData.password);

            const data: User = { ...inputData, password: hashedPassword, avatar: avatar_path };

            const newUser = await UserRepository.create(data);

            const tokenData: Partial<Token> = {
                purpose: "verify_email",
                token: await Service.generate_otp(),
                user_id: newUser.id,
                expires_at: await Service.verification_time(new Date(), 5),
            }

            const token = await TokenRepository.create(tokenData as Token);

            if (!token) {
                throw new HttpError(500, `something went wrong while creating token`);
            }

            res.status(201).json({ status: 201, data: newUser, message: "user created" });
        } catch (error) {
            log.error(error);
            next(error);
        }
    }

    static verify_user = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
        try {
            const { email, token } = req.body;

            const user: User = await UserRepository.get_email(email);

            if (!user) {
                throw new HttpError(404, `user not found with email:: ${email}`);
            }

            if (user.is_verified) {
                res.status(400).json({ status: 400, message: "user already verified" });
            }

            const token_data: Token = await TokenRepository.get_one({ user_id: user.id, purpose: "verify_email" });

            if (!token_data) {
                throw new HttpError(404, `token not found`);
            }

            if (new Date() > token_data.expires_at) {
                throw new HttpError(400, `verification token expired`);
            }
            else if (token != token_data.token) {
                throw new HttpError(400, `invalid verification token`);
            }

            const verified_user: User = await UserRepository.update(user.id, { is_verified: true });

            if (!verified_user) {
                throw new HttpError(500, 'something went wrong while verification')
            }

            res.status(200).json({ status: 200, data: verified_user, message: "user verified" });

        } catch (error) {
            log.error(error);
            next(error);
        }
    }

    static resend_verification = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
        
    }

    static update_user = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
        try {
            const id: string = req.params.id;
            const inputData: User = req.body;

            const user = await UserRepository.get_id(id);

            if (!user) {
                throw new HttpError(404, `user not found with id:: ${id}`);
            }

            const data: User = { ...user, ...inputData };

            const updatedUser = await UserRepository.update(id, data);

            res.status(200).json({ status: 200, data: updatedUser, message: "user updated" });
        } catch (error) {
            log.error(error);
            next(error);
        }
    }

    static soft_delete_user = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
        try {
            const id: string = req.params.id;

            const userExist = await UserRepository.get_id(id);

            if (!userExist) {
                throw new HttpError(404, `user not found with id:: ${id}`);
            }

            const userSoftDelete = await UserRepository.soft_delete(id);

            if (!userSoftDelete) {
                throw new HttpError(500, `something went wrong while deleting user with id:: ${id}`);
            }


            res.status(200).json({ status: 200, data: userSoftDelete, message: `user deleted \n deleted date: ${userSoftDelete.deletedAt}` });

        }
        catch (err) {
            log.error(err);
            next(err);
        }
    }

    static restore_user = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
        try {
            const id: string = req.params.id;

            const userExist = await UserRepository.get_id(id);

            if (!userExist) {
                throw new HttpError(404, `user not found with id:: ${id}`);
            }

            const userRestore = await UserRepository.restore(id);

            if (!userRestore) {
                throw new HttpError(500, `something went wrong while restoring user with id:: ${id}`);
            }

            res.status(200).json({ status: 200, data: userRestore, message: `user restored successfully` });
        }
        catch (err) {
            log.error(err);
            next(err);
        }
    }

    static delete_user = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
        try {
            const id: string = req.params.id;

            const userExist = await UserRepository.get_id(id);

            if (!userExist) {
                throw new HttpError(404, `user not found with id:: ${id}`);
            }

            const userDelete = await UserRepository.delete(id);

            if (!userDelete) {
                throw new HttpError(500, `something went wrong while deleting user with id:: ${id}`);
            }

            res.status(200).json({ status: 200, data: userDelete, message: `user deleted successfully` });
        }
        catch (err) {
            log.error(err);
            next(err);
        }
    }
}