-- AddForeignKey
ALTER TABLE `Prestamo` ADD CONSTRAINT `Prestamo_celdaId_fkey` FOREIGN KEY (`celdaId`) REFERENCES `Celda`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;
