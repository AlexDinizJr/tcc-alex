/*
  Warnings:

  - You are about to drop the column `mediaId` on the `PasswordRecovery` table. All the data in the column will be lost.

*/
-- DropForeignKey
ALTER TABLE "public"."PasswordRecovery" DROP CONSTRAINT "PasswordRecovery_mediaId_fkey";

-- AlterTable
ALTER TABLE "public"."PasswordRecovery" DROP COLUMN "mediaId",
ADD COLUMN     "used" BOOLEAN NOT NULL DEFAULT false;
