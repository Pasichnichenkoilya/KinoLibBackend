-- CreateTable
CREATE TABLE "Details" (
    "id" TEXT NOT NULL,
    "filmPath" TEXT[],
    "titleUa" TEXT NOT NULL,
    "titleOriginal" TEXT NOT NULL,
    "description" TEXT NOT NULL,
    "image" TEXT NOT NULL,
    "rating" TEXT NOT NULL,
    "country" TEXT NOT NULL,
    "time" TEXT NOT NULL,
    "release" TEXT NOT NULL,
    "genres" TEXT[],

    CONSTRAINT "Details_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "SeasonInfo" (
    "id" TEXT NOT NULL,
    "seasonNumber" TEXT NOT NULL,
    "episodes" TEXT[],
    "detailsId" TEXT,

    CONSTRAINT "SeasonInfo_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "SeasonInfo" ADD CONSTRAINT "SeasonInfo_detailsId_fkey" FOREIGN KEY ("detailsId") REFERENCES "Details"("id") ON DELETE SET NULL ON UPDATE CASCADE;
