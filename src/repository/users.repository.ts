import { prisma } from "@database";
import { User } from "@prisma/client";

export class UserRepository {
    static get = async (): Promise<User[]> => {
        return await prisma.user.findMany();
    }

    static get_id = async (id: string): Promise<User> => {
        return await prisma.user.findUnique({ where: { id } });
    }
    static get_email = async (email: string): Promise<User> => {
        return await prisma.user.findFirst({ where: { email } });
    }

    static create = async (data: User): Promise<User> => {
        return await prisma.user.create({ data: data });
    }

    static update = async (id: string, data: Partial<User>): Promise<User> => {
        return await prisma.user.update({ where: { id }, data });
    }

    static soft_delete = async (id: string): Promise<User> => {
        return await prisma.user.update({ where: { id }, data: { deletedAt: new Date() } });
    }

    static restore = async (id: string): Promise<User> => {
        return await prisma.user.update({ where: { id }, data: { deletedAt: null } });
    }

    static delete = async (id: string): Promise<User> => {
        return await prisma.user.delete({ where: { id } });
    }

}