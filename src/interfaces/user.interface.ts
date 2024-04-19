import { Role } from "@prisma/client";

export interface User {
    id?: string;
    name?: string;
    email: string;
    password: string;
    phone: string;
    role: Role;
    address?: string;
    image?: string;
    createdAt?: Date;
    updatedAt?: Date;
    deletedAt?: Date;
}