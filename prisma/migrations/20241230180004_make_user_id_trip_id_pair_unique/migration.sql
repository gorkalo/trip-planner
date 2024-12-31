/*
  Warnings:

  - A unique constraint covering the columns `[userId,trip_id]` on the table `Trip` will be added. If there are existing duplicate values, this will fail.

*/
-- DropIndex
DROP INDEX "Trip_trip_id_key";

-- CreateIndex
CREATE UNIQUE INDEX "Trip_userId_trip_id_key" ON "Trip"("userId", "trip_id");
