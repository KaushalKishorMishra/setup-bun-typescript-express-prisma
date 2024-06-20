import { TokenType } from "@/enums/token.enum";
import { Role } from "@prisma/client";

export interface Payload {
    user_id: string,
    email: string,
    user_type: Role,
    type: TokenType,
}
