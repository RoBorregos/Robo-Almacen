-- CreateTable
CREATE TABLE `CeldaGroup` (
    `celdaId` VARCHAR(191) NOT NULL,
    `groupId` VARCHAR(191) NOT NULL,

    PRIMARY KEY (`celdaId`, `groupId`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- AddForeignKey
ALTER TABLE `CeldaGroup` ADD CONSTRAINT `CeldaGroup_celdaId_fkey` FOREIGN KEY (`celdaId`) REFERENCES `Celda`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `CeldaGroup` ADD CONSTRAINT `CeldaGroup_groupId_fkey` FOREIGN KEY (`groupId`) REFERENCES `Group`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;
