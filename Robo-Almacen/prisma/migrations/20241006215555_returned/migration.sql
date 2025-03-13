/*
  Warnings:

  - You are about to drop the column `RFIDtoken` on the `user` table. All the data in the column will be lost.

*/
-- DropIndex
DROP INDEX `Account_userId_fkey` ON `account`;

-- DropIndex
DROP INDEX `CeldaItem_celdaId_fkey` ON `celdaitem`;

-- DropIndex
DROP INDEX `CeldaItem_itemId_fkey` ON `celdaitem`;

-- DropIndex
DROP INDEX `Prestamo_celdaId_fkey` ON `prestamo`;

-- DropIndex
DROP INDEX `Prestamo_itemId_fkey` ON `prestamo`;

-- DropIndex
DROP INDEX `Prestamo_userId_fkey` ON `prestamo`;

-- DropIndex
DROP INDEX `Session_userId_fkey` ON `session`;

-- AlterTable
ALTER TABLE `account` ADD COLUMN `RFIDtoken` VARCHAR(191) NULL;

-- AlterTable
ALTER TABLE `prestamo` ALTER COLUMN `celdaId` DROP DEFAULT;

-- AlterTable
ALTER TABLE `user` DROP COLUMN `RFIDtoken`;

-- AddForeignKey
ALTER TABLE `Account` ADD CONSTRAINT `Account_userId_fkey` FOREIGN KEY (`userId`) REFERENCES `User`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `Session` ADD CONSTRAINT `Session_userId_fkey` FOREIGN KEY (`userId`) REFERENCES `User`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `CeldaItem` ADD CONSTRAINT `CeldaItem_celdaId_fkey` FOREIGN KEY (`celdaId`) REFERENCES `Celda`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `CeldaItem` ADD CONSTRAINT `CeldaItem_itemId_fkey` FOREIGN KEY (`itemId`) REFERENCES `Item`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `Prestamo` ADD CONSTRAINT `Prestamo_itemId_fkey` FOREIGN KEY (`itemId`) REFERENCES `Item`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `Prestamo` ADD CONSTRAINT `Prestamo_userId_fkey` FOREIGN KEY (`userId`) REFERENCES `User`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `Prestamo` ADD CONSTRAINT `Prestamo_celdaId_fkey` FOREIGN KEY (`celdaId`) REFERENCES `Celda`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `UserData` ADD CONSTRAINT `UserData_id_fkey` FOREIGN KEY (`id`) REFERENCES `User`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;
