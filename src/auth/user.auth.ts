import { Request, Response, NextFunction } from "express";
import { HttpError } from "@exceptions/http.exceptions";
import { log } from "@utils/logger.utils";
import { Bcrypt } from "@utils/bcrypt.utils";
import * as jwt from "jsonwebtoken";
import { UserRepository } from "@repository/users.repository";


export class UserAuthentication {
    static login = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
        try {
            const { email, password } = req.body;

            const user = await UserRepository.get_user_by_email(email);

            if (!user) {
                throw new HttpError(404, `user not found with email:: ${email}`);
            }

            const isPasswordMatch = await Bcrypt.compare(password, user.password);

            if (!isPasswordMatch) {
                throw new HttpError(401, "invalid credentials");
            }

            // const token = await jwt.sign({});

            res.status(200).json({ status: 200, data: {  }, message: "login successful" });
        } catch (error) {
            log.error(error);
            next(error);
        }
    }
}