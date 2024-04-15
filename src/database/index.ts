import { PrismaClient } from "@prisma/client";
import { log } from "@utils/logger";

const prisma = new PrismaClient({
  errorFormat: "pretty",
});

const prismaConnect = async () => {
  try {
    await prisma.$connect();
    log.info("🚀 Database connected successfully");
  } catch (err) {
    log.error(err);
    console.log(err);
  }
};

export default prismaConnect;
