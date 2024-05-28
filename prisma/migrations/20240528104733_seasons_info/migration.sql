/*
  Warnings:

  - Added the required column `seasonId` to the `SeasonInfo` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "SeasonInfo" ADD COLUMN     "seasonId" TEXT NOT NULL;
