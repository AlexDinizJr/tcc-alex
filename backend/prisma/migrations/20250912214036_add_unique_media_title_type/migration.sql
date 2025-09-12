/*
  Warnings:

  - A unique constraint covering the columns `[title,type]` on the table `Media` will be added. If there are existing duplicate values, this will fail.

*/
-- CreateIndex
CREATE UNIQUE INDEX "Media_title_type_key" ON "public"."Media"("title", "type");
