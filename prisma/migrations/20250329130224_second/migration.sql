/*
  Warnings:

  - Changed the type of `status` on the `todo` table. No cast exists, the column would be dropped and recreated, which cannot be done if there is data, since the column is required.

*/
-- CreateEnum
CREATE TYPE "Status" AS ENUM ('TODO', 'INPROGRESS', 'DONE', 'BLOCKED');

-- AlterTable
ALTER TABLE "todo" DROP COLUMN "status",
ADD COLUMN     "status" "Status" NOT NULL;

-- DropEnum
DROP TYPE "status";
