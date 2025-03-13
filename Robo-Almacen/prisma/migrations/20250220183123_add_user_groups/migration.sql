/*
  Warnings:

  - You are about to drop the column `RFIDtoken` on the `user` table. All the data in the column will be lost.
  - A unique constraint covering the columns `[RFID]` on the table `User` will be added. If there are existing duplicate values, this will fail.

*/
-- AlterTable
ALTER TABLE `user` DROP COLUMN `RFIDtoken`,
    ADD COLUMN `RFID` VARCHAR(191) NULL;

-- CreateTable
CREATE TABLE `Group` (
    `id` VARCHAR(191) NOT NULL,
    `name` VARCHAR(191) NOT NULL,

    UNIQUE INDEX `Group_name_key`(`name`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `UserGroup` (
    `userId` VARCHAR(191) NOT NULL,
    `groupId` VARCHAR(191) NOT NULL,

    PRIMARY KEY (`userId`, `groupId`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateIndex
CREATE UNIQUE INDEX `User_RFID_key` ON `User`(`RFID`);

-- AddForeignKey
ALTER TABLE `UserGroup` ADD CONSTRAINT `UserGroup_userId_fkey` FOREIGN KEY (`userId`) REFERENCES `User`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `UserGroup` ADD CONSTRAINT `UserGroup_groupId_fkey` FOREIGN KEY (`groupId`) REFERENCES `Group`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;
