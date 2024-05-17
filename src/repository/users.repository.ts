import { prisma } from "@database";
import { User } from "@prisma/client";

export class UserRepository {
    static get_users = async (): Promise<User[]> => {
        return await prisma.user.findMany();
    }

    static get_user_by_id = async (id: string): Promise<User> => {
        return await prisma.user.findUnique({ where: { id } });
    }
    static get_user_by_email = async (email: string): Promise<User> => {
        return await prisma.user.findUnique({ where: { email } });
    }

    static create_user = async (data: User): Promise<User> => {
        return await prisma.user.create({ data: data });
    }

    static update_user = async (id: string, data: User): Promise<User> => {
        return await prisma.user.update({ where: { id }, data });
    }

    static soft_delete_user = async (id: string): Promise<User> => {
        return await prisma.user.update({ where: { id }, data: { deletedAt: new Date() } });
    }

    static restore_user = async (id: string): Promise<User> => {
        return await prisma.user.update({ where: { id }, data: { deletedAt: null } });
    }

    static delete_user = async (id: string): Promise<User> => {
        return await prisma.user.delete({ where: { id } });
    }

}