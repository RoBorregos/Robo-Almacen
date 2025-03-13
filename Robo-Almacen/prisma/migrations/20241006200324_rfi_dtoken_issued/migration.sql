-- AlterTable
ALTER TABLE `prestamo` ADD COLUMN `issued` BOOLEAN NOT NULL DEFAULT false;

-- AlterTable
ALTER TABLE `user` ADD COLUMN `RFIDtoken` VARCHAR(191) NULL;
