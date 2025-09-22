-- CreateTable
CREATE TABLE "public"."RecommendationEngagement" (
    "id" SERIAL NOT NULL,
    "userId" INTEGER NOT NULL,
    "mediaId" INTEGER NOT NULL,
    "action" TEXT NOT NULL,
    "score" DOUBLE PRECISION NOT NULL,
    "timestamp" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "metadata" JSONB,

    CONSTRAINT "RecommendationEngagement_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "RecommendationEngagement_userId_idx" ON "public"."RecommendationEngagement"("userId");

-- CreateIndex
CREATE INDEX "RecommendationEngagement_mediaId_idx" ON "public"."RecommendationEngagement"("mediaId");

-- CreateIndex
CREATE INDEX "RecommendationEngagement_timestamp_idx" ON "public"."RecommendationEngagement"("timestamp");

-- AddForeignKey
ALTER TABLE "public"."RecommendationEngagement" ADD CONSTRAINT "RecommendationEngagement_userId_fkey" FOREIGN KEY ("userId") REFERENCES "public"."User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."RecommendationEngagement" ADD CONSTRAINT "RecommendationEngagement_mediaId_fkey" FOREIGN KEY ("mediaId") REFERENCES "public"."Media"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
