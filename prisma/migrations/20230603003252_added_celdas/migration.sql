/*
  Warnings:

  - You are about to alter the column `expires_at` on the `Account` table. The data in that column could be lost. The data in that column will be cast from `Int8` to `Int4`.
  - You are about to alter the column `ext_expires_in` on the `Account` table. The data in that column could be lost. The data in that column will be cast from `Int8` to `Int4`.
  - You are about to alter the column `row` on the `Celda` table. The data in that column could be lost. The data in that column will be cast from `Int8` to `Int4`.
  - You are about to alter the column `column` on the `Celda` table. The data in that column could be lost. The data in that column will be cast from `Int8` to `Int4`.
  - You are about to alter the column `quantity` on the `CeldaItem` table. The data in that column could be lost. The data in that column will be cast from `Int8` to `Int4`.
  - You are about to alter the column `available` on the `CeldaItem` table. The data in that column could be lost. The data in that column will be cast from `Int8` to `Int4`.
  - You are about to alter the column `quantity` on the `Prestamo` table. The data in that column could be lost. The data in that column will be cast from `Int8` to `Int4`.

*/
-- AlterTable
ALTER TABLE "Account" ALTER COLUMN "expires_at" SET DATA TYPE INT4;
ALTER TABLE "Account" ALTER COLUMN "ext_expires_in" SET DATA TYPE INT4;

-- AlterTable
ALTER TABLE "Celda" ALTER COLUMN "row" SET DATA TYPE INT4;
ALTER TABLE "Celda" ALTER COLUMN "column" SET DATA TYPE INT4;

-- AlterTable
ALTER TABLE "CeldaItem" ALTER COLUMN "quantity" SET DATA TYPE INT4;
ALTER TABLE "CeldaItem" ALTER COLUMN "available" SET DATA TYPE INT4;

-- AlterTable
ALTER TABLE "Prestamo" ALTER COLUMN "quantity" SET DATA TYPE INT4;
