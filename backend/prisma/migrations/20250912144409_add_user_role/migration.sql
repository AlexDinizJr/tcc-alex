/*
  Warnings:

  - A unique constraint covering the columns `[mediaId,service]` on the table `StreamingLink` will be added. If there are existing duplicate values, this will fail.

*/
-- CreateEnum
CREATE TYPE "public"."UserRole" AS ENUM ('USER', 'ADMIN');

-- DropForeignKey
ALTER TABLE "public"."StreamingLink" DROP CONSTRAINT "StreamingLink_mediaId_fkey";

-- AlterTable
ALTER TABLE "public"."Media" ALTER COLUMN "image" DROP NOT NULL;

-- AlterTable
ALTER TABLE "public"."User" ADD COLUMN     "role" "public"."UserRole" NOT NULL DEFAULT 'USER';

-- CreateIndex
CREATE UNIQUE INDEX "StreamingLink_mediaId_service_key" ON "public"."StreamingLink"("mediaId", "service");

-- AddForeignKey
ALTER TABLE "public"."StreamingLink" ADD CONSTRAINT "StreamingLink_mediaId_fkey" FOREIGN KEY ("mediaId") REFERENCES "public"."Media"("id") ON DELETE CASCADE ON UPDATE CASCADE;
