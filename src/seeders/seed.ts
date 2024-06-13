import { TokenRepository } from '@/repository/token.repository';
import { UserRepository } from '@/repository/users.repository';
import { PrismaClient, Token, User } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
    try {
        const admin_data: User = {
            id: "admin",
            name: "admin",
            email: "admin@admin.com",
            password: "admin", // Hash in real applications
            role: "ADMIN",
            phone: "+977-9863211795",
            avatar: "public/avatar/admin.png",
            address: "Kathmandu, Nepal",
            is_verified: true,
            createdAt: new Date(),
            updatedAt: new Date(),
            deletedAt: null
        }

        const user_data: User = {
            id: "user",
            name: "user",
            email: "test-user@test.com",
            password: "user", // Hash in real applications
            role: "USER",
            phone: "+977-9863211795",
            avatar: "public/avatar/user.png",
            address: "Kathmandu, Nepal",
            is_verified: true,
            createdAt: new Date(),
            updatedAt: new Date(),
            deletedAt: null
        }

        const admin_token_data: Token = {
            id: "admin",
            user_id: admin_data.id,
            purpose: "login",
            token: "admin_token",
            expires_at: new Date(Date.now() + 1000 * 60 * 60 * 24 * 7),
            createdAt: new Date(),
            updatedAt: new Date(),
            deletedAt: null
        }
        const user_token_data: Token = {
            id: "user",
            user_id: user_data.id,
            purpose: "login",
            token: "admin_token",
            expires_at: new Date(Date.now() + 1000 * 60 * 60 * 24 * 7),
            createdAt: new Date(),
            updatedAt: new Date(),
            deletedAt: null
        }

        const admin = await UserRepository.create(admin_data);
        const admin_token = await TokenRepository.create(admin_token_data);

        const user = await UserRepository.create(user_data);
        const user_token = await TokenRepository.create(user_token_data);

        console.log('Admin user and token seeded:', { admin, admin_token });
        console.log('User user and token seeded:', { user, user_token });


    } catch (error) {
        console.error('Error seeding admin user:', error);
    } finally {
        await prisma.$disconnect();
    }
}

// Execute the main function
main().catch(e => { 
    console.error('Unhandled error:', e);
    prisma.$disconnect().then(() => process.exit(1));
});
