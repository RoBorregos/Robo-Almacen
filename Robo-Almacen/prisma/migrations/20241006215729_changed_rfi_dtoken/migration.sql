/*
  Warnings:

  - You are about to drop the column `RFIDtoken` on the `account` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE `account` DROP COLUMN `RFIDtoken`;

-- AlterTable
ALTER TABLE `user` ADD COLUMN `RFIDtoken` VARCHAR(191) NULL;
