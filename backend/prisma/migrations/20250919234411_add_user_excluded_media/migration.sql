-- CreateTable
CREATE TABLE "public"."UserExcludedMedia" (
    "id" SERIAL NOT NULL,
    "userId" INTEGER NOT NULL,
    "mediaId" INTEGER NOT NULL,
    "expireAt" TIMESTAMP(3) NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "UserExcludedMedia_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "UserExcludedMedia_userId_mediaId_key" ON "public"."UserExcludedMedia"("userId", "mediaId");

-- AddForeignKey
ALTER TABLE "public"."UserExcludedMedia" ADD CONSTRAINT "UserExcludedMedia_userId_fkey" FOREIGN KEY ("userId") REFERENCES "public"."User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."UserExcludedMedia" ADD CONSTRAINT "UserExcludedMedia_mediaId_fkey" FOREIGN KEY ("mediaId") REFERENCES "public"."Media"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
