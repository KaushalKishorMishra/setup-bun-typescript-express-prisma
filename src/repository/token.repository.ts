import { prisma } from "@database";
import { Token } from "@prisma/client";

export class TokenRepository {
    static get = async (): Promise<Token[]> => {
        return await prisma.token.findMany();
    }

    static get_one = async (key: object): Promise<Token> => {
        return await prisma.token.findFirst({ where: { ...key } });
    }

    static create = async (data: Token): Promise<Token> => {
        return await prisma.token.create({ data: data });
    }

    static update = async (id: string, data: Token): Promise<Token> => {
        return await prisma.token.update({ where: { id }, data: data })
    }

    static delete = async (id: string): Promise<Token> => {
        return await prisma.token.delete({ where: { id } });
    }

}