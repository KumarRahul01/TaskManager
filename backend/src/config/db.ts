import prisma from "./prisma"

const connectDB = async () => {
  try {
    await prisma.$connect()
    console.log("DB connected successfully!")
  } catch (error: unknown) {
    const errorMessage = error instanceof Error ? error.message : String(error);
    console.log(`Error while connecting DB ${errorMessage}`);
    process.exit(1)
  }
}

const disconnectDB = async () => {
  try {
    await prisma.$disconnect()
    console.log("Database disconnected");
  } catch (error: unknown) {
    const errorMessage = error instanceof Error ? error.message : String(error);
    console.log(`Error while connecting DB ${errorMessage}`);
    process.exit(1)
  }
}

export {connectDB, disconnectDB};