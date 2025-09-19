/*
  Warnings:

  - The `genres` column on the `Media` table would be dropped and recreated. This will lead to data loss if there is data in the column.

*/
-- AlterTable
ALTER TABLE "public"."Media" DROP COLUMN "genres",
ADD COLUMN     "genres" TEXT[];

-- DropEnum
DROP TYPE "public"."MediaGenre";
