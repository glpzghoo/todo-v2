-- CreateEnum
CREATE TYPE "status" AS ENUM ('TODO', 'INPROGRESS', 'DONE', 'BLOCKED');

-- CreateTable
CREATE TABLE "todo" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "status" "status" NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "todo_pkey" PRIMARY KEY ("id")
);
