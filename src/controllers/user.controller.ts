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

    static create_user = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
        try {
            const inputData: User = req.body;

            const userExist = await UserRepository.get_user_by_email(inputData.email);

            if (userExist) {
                throw new HttpError(409, `user already exist with email:: ${inputData.email}`);
            }

            const hashedPassword = await Bcrypt.encrypt(inputData.password);

            const data: User = { ...inputData, password: hashedPassword };

            const newUser = await UserRepository.create_user(data);

            res.status(201).json({ status: 201, data: newUser, message: "user created" });
        } catch (error) {
            log.error(error);
            next(error);
        }
    }

    static update_user = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
        try {
            const id: string = req.params.id;
            const inputData: User = req.body;

            const user = await UserRepository.get_user_by_id(id);

            if (!user) {
                throw new HttpError(404, `user not found with id:: ${id}`);
            }

            const data: User = { ...user, ...inputData };

            const updatedUser = await UserRepository.update_user(id, data);

            res.status(200).json({ status: 200, data: updatedUser, message: "user updated" });
        } catch (error) {
            log.error(error);
            next(error);
        }
    }

    static soft_delete_user = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
        try {
            const id: string = req.params.id;

            const userExist = await UserRepository.get_user_by_id(id);

            if (!userExist) {
                throw new HttpError(404, `user not found with id:: ${id}`);
            }

            const userSoftDelete = await UserRepository.soft_delete_user(id);

            if(!userSoftDelete){
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

            const userExist = await UserRepository.get_user_by_id(id);

            if (!userExist) {
                throw new HttpError(404, `user not found with id:: ${id}`);
            }

            const userRestore = await UserRepository.restore_user(id);

            if(!userRestore){
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
        try{
            const id: string = req.params.id;

            const userExist = await UserRepository.get_user_by_id(id);

            if (!userExist) {
                throw new HttpError(404, `user not found with id:: ${id}`);
            }

            const userDelete = await UserRepository.delete_user(id);

            if(!userDelete){
                throw new HttpError(500, `something went wrong while deleting user with id:: ${id}`);
            }

            res.status(200).json({ status: 200, data: userDelete, message: `user deleted successfully` });
        }
        catch(err){
            log.error(err);
            next(err);
        }
    }
}