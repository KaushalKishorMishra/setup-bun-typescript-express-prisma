import { Multer } from "@utils/multer.utils";
import { UserController } from "@controllers/user.controller";
import { Routes } from "@interfaces/route.interface";
import { Router } from "express";

export class UserRoute implements Routes {
    public path: string;
    public router: Router;

    constructor() {
        this.path = '/users';
        this.router = Router();
        this.initialize_routes();
    }

    private initialize_routes() {
        this.get_routes();
        this.post_routes();
        this.put_routes();
        this.patch_routes();
        this.delete_routes();
    }

    private get_routes() {
        this.router.get(`${this.path}/get`, UserController.get_users);
        this.router.get(`${this.path}/get/:id`, UserController.get_user_by_id);
        this.router.get(`${this.path}/get/email`, UserController.get_user_by_email);
    }

    private post_routes() {
        this.router.post(`${this.path}/sign-up`,
            new Multer().image_multer.single("avatar"),
            // new Multer().file_multer.single("file"),
            UserController.create_user,
        );
    }

    private put_routes() {
        this.router.put(`${this.path}/put`, (req, res) => {
            res.send('PUT Request to the homepage');
        });
    }

    private patch_routes() {
        this.router.patch(`${this.path}/patch`, (req, res) => {
            res.send('PATCH Request to the homepage');
        });
    }

    private delete_routes() {
        this.router.delete(`${this.path}/delete/:id`, UserController.delete_user);
    }


}