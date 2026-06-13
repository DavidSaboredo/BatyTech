-- CreateEnum
CREATE TYPE "PerformanceTier" AS ENUM ('ENTRY', 'MID', 'HIGH');

-- AlterTable
ALTER TABLE "Product" ADD COLUMN     "fpsGames" TEXT,
ADD COLUMN     "performanceTier" "PerformanceTier",
ADD COLUMN     "specs" TEXT;
