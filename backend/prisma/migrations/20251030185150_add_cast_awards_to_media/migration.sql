-- AlterTable
ALTER TABLE "public"."Media" ADD COLUMN     "awards" TEXT[] DEFAULT ARRAY[]::TEXT[],
ADD COLUMN     "cast" TEXT[] DEFAULT ARRAY[]::TEXT[];
