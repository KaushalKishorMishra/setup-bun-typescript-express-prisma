import { PrismaClient } from "@prisma/client";
import { log } from "@utils/logger.utils";

const prisma = new PrismaClient({
  errorFormat: "pretty",
});

const prismaConnect = async () => {
  try {
    await prisma.$connect()
      .then(() => {
        log.info("🚀 Database connection established");
      })
  } catch (err) {
    log.error(err);
    console.log(err);
  }
};

export { prismaConnect, prisma };
