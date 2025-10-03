-- CreateTable
CREATE TABLE "public"."UserInitialPreference" (
    "id" SERIAL NOT NULL,
    "userId" INTEGER NOT NULL,
    "mediaId" INTEGER NOT NULL,

    CONSTRAINT "UserInitialPreference_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "UserInitialPreference_userId_mediaId_key" ON "public"."UserInitialPreference"("userId", "mediaId");

-- AddForeignKey
ALTER TABLE "public"."UserInitialPreference" ADD CONSTRAINT "UserInitialPreference_userId_fkey" FOREIGN KEY ("userId") REFERENCES "public"."User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."UserInitialPreference" ADD CONSTRAINT "UserInitialPreference_mediaId_fkey" FOREIGN KEY ("mediaId") REFERENCES "public"."Media"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
