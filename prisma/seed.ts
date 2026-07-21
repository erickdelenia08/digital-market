import "dotenv/config";
import { PrismaClient } from "@prisma/client";
import { PrismaMariaDb } from "@prisma/adapter-mariadb";
import * as bcrypt from "bcryptjs";

const connectionString = process.env.DATABASE_URL!.replace("mysql://", "mariadb://");
const adapter = new PrismaMariaDb(connectionString);

const prisma = new PrismaClient({ adapter });

async function main() {
  const email = "erick@gmail.com";
  const hashedPassword = await bcrypt.hash("password", 10);

  const user = await prisma.user.upsert({
    where: { email },
    update: {
      password: hashedPassword,
    },
    create: {
      email,
      name: "Erick",
      password: hashedPassword,
    },
  });

  console.log("Seed successful: Admin user created/updated.");
  console.log({ id: user.id, email: user.email });
}

main()
  .then(async () => {
    await prisma.$disconnect();
  })
  .catch(async (e) => {
    console.error(e);
    await prisma.$disconnect();
    process.exit(1);
  });
