-- CreateEnum
CREATE TYPE "public"."MediaType" AS ENUM ('MOVIE', 'GAME', 'MUSIC', 'SERIES', 'BOOK');

-- CreateEnum
CREATE TYPE "public"."ClassificationRating" AS ENUM ('L', 'TEN', 'TWELVE', 'FOURTEEN', 'SIXTEEN', 'EIGHTEEN');

-- CreateEnum
CREATE TYPE "public"."MediaGenre" AS ENUM ('ACTION', 'ADVENTURE', 'FANTASY', 'SCI_FI', 'HORROR', 'THRILLER', 'COMEDY', 'DRAMA', 'ROMANCE', 'CRIME', 'MYSTERY', 'WESTERN', 'WAR', 'HISTORICAL', 'BIOGRAPHY', 'MUSICAL', 'SPORTS', 'DOCUMENTARY', 'RPG', 'FPS', 'TPS', 'MOBA', 'RTS', 'MMORPG', 'SURVIVAL', 'OPEN_WORLD', 'SANDBOX', 'PLATFORMER', 'PUZZLE', 'ROGUELIKE', 'SIMULATION', 'STRATEGY', 'FIGHTING', 'RACING', 'BATTLE_ROYALE', 'SUPERHERO', 'DISASTER', 'MARTIAL_ARTS', 'FILM_NOIR', 'SLASHER', 'PSYCHOLOGICAL', 'ANIMATION', 'FAMILY', 'MOCKUMENTARY', 'SPACE', 'PERIOD_DRAMA', 'LEGAL_DRAMA', 'MEDICAL_DRAMA', 'POLICE_PROCEDURAL', 'TEEN_DRAMA', 'SITCOM', 'REALITY', 'TALK_SHOW', 'MINISERIES', 'EPIC', 'CHILDREN', 'YOUNG_ADULT', 'MAGICAL_REALISM', 'DYSTOPIAN', 'UTOPIAN', 'GOTHIC', 'HISTORICAL_FICTION', 'SCIENCE_FICTION', 'SELF_HELP', 'POETRY', 'ESSAY', 'TRAVEL', 'TRUE_CRIME', 'POP', 'RNB', 'DANCE', 'ROCK', 'HARD_ROCK', 'METAL', 'PUNK', 'INDIE', 'ALTERNATIVE', 'HIP_HOP', 'RAP', 'COUNTRY', 'FOLK', 'JAZZ', 'BLUES', 'CLASSICAL', 'ELECTRONIC', 'REGGAE', 'LATIN', 'K_POP', 'J_POP', 'GOSPEL', 'WORLD', 'INSTRUMENTAL');

-- CreateTable
CREATE TABLE "public"."User" (
    "id" SERIAL NOT NULL,
    "email" TEXT NOT NULL,
    "password" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "username" TEXT NOT NULL,
    "avatar" TEXT,
    "coverImage" TEXT,
    "bio" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "profileVisibility" TEXT NOT NULL DEFAULT 'public',
    "showActivity" BOOLEAN NOT NULL DEFAULT true,
    "showSavedItems" BOOLEAN NOT NULL DEFAULT true,
    "showFavorites" BOOLEAN NOT NULL DEFAULT true,
    "showReviews" BOOLEAN NOT NULL DEFAULT true,
    "showStats" BOOLEAN NOT NULL DEFAULT true,
    "dataCollection" BOOLEAN NOT NULL DEFAULT true,

    CONSTRAINT "User_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."Media" (
    "id" SERIAL NOT NULL,
    "title" TEXT NOT NULL,
    "rating" DOUBLE PRECISION NOT NULL,
    "image" TEXT NOT NULL,
    "year" INTEGER NOT NULL,
    "type" "public"."MediaType" NOT NULL,
    "classification" "public"."ClassificationRating",
    "reviewCount" INTEGER DEFAULT 0,
    "genres" "public"."MediaGenre"[],
    "artists" TEXT[],
    "directors" TEXT[],
    "platforms" TEXT[],
    "authors" TEXT[],
    "seasons" INTEGER,
    "duration" INTEGER,
    "pages" INTEGER,
    "publisher" TEXT,

    CONSTRAINT "Media_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."Review" (
    "id" SERIAL NOT NULL,
    "rating" INTEGER NOT NULL,
    "comment" TEXT NOT NULL,
    "date" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "mediaId" INTEGER NOT NULL,
    "userId" INTEGER NOT NULL,

    CONSTRAINT "Review_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."List" (
    "id" SERIAL NOT NULL,
    "name" TEXT NOT NULL,
    "description" TEXT,
    "isPublic" BOOLEAN NOT NULL DEFAULT false,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "userId" INTEGER NOT NULL,

    CONSTRAINT "List_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."StreamingLink" (
    "id" SERIAL NOT NULL,
    "service" TEXT NOT NULL,
    "url" TEXT NOT NULL,
    "mediaId" INTEGER NOT NULL,

    CONSTRAINT "StreamingLink_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."Helpful" (
    "id" SERIAL NOT NULL,
    "userId" INTEGER NOT NULL,
    "reviewId" INTEGER NOT NULL,

    CONSTRAINT "Helpful_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."_SavedMedia" (
    "A" INTEGER NOT NULL,
    "B" INTEGER NOT NULL,

    CONSTRAINT "_SavedMedia_AB_pkey" PRIMARY KEY ("A","B")
);

-- CreateTable
CREATE TABLE "public"."_Favorites" (
    "A" INTEGER NOT NULL,
    "B" INTEGER NOT NULL,

    CONSTRAINT "_Favorites_AB_pkey" PRIMARY KEY ("A","B")
);

-- CreateTable
CREATE TABLE "public"."_ListToMedia" (
    "A" INTEGER NOT NULL,
    "B" INTEGER NOT NULL,

    CONSTRAINT "_ListToMedia_AB_pkey" PRIMARY KEY ("A","B")
);

-- CreateIndex
CREATE UNIQUE INDEX "User_email_key" ON "public"."User"("email");

-- CreateIndex
CREATE UNIQUE INDEX "User_username_key" ON "public"."User"("username");

-- CreateIndex
CREATE UNIQUE INDEX "Helpful_userId_reviewId_key" ON "public"."Helpful"("userId", "reviewId");

-- CreateIndex
CREATE INDEX "_SavedMedia_B_index" ON "public"."_SavedMedia"("B");

-- CreateIndex
CREATE INDEX "_Favorites_B_index" ON "public"."_Favorites"("B");

-- CreateIndex
CREATE INDEX "_ListToMedia_B_index" ON "public"."_ListToMedia"("B");

-- AddForeignKey
ALTER TABLE "public"."Review" ADD CONSTRAINT "Review_mediaId_fkey" FOREIGN KEY ("mediaId") REFERENCES "public"."Media"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."Review" ADD CONSTRAINT "Review_userId_fkey" FOREIGN KEY ("userId") REFERENCES "public"."User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."List" ADD CONSTRAINT "List_userId_fkey" FOREIGN KEY ("userId") REFERENCES "public"."User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."StreamingLink" ADD CONSTRAINT "StreamingLink_mediaId_fkey" FOREIGN KEY ("mediaId") REFERENCES "public"."Media"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."Helpful" ADD CONSTRAINT "Helpful_userId_fkey" FOREIGN KEY ("userId") REFERENCES "public"."User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."Helpful" ADD CONSTRAINT "Helpful_reviewId_fkey" FOREIGN KEY ("reviewId") REFERENCES "public"."Review"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."_SavedMedia" ADD CONSTRAINT "_SavedMedia_A_fkey" FOREIGN KEY ("A") REFERENCES "public"."Media"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."_SavedMedia" ADD CONSTRAINT "_SavedMedia_B_fkey" FOREIGN KEY ("B") REFERENCES "public"."User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."_Favorites" ADD CONSTRAINT "_Favorites_A_fkey" FOREIGN KEY ("A") REFERENCES "public"."Media"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."_Favorites" ADD CONSTRAINT "_Favorites_B_fkey" FOREIGN KEY ("B") REFERENCES "public"."User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."_ListToMedia" ADD CONSTRAINT "_ListToMedia_A_fkey" FOREIGN KEY ("A") REFERENCES "public"."List"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."_ListToMedia" ADD CONSTRAINT "_ListToMedia_B_fkey" FOREIGN KEY ("B") REFERENCES "public"."Media"("id") ON DELETE CASCADE ON UPDATE CASCADE;
