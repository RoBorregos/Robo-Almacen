-- DropForeignKey
ALTER TABLE `account` DROP FOREIGN KEY `Account_userId_fkey`;

-- DropForeignKey
ALTER TABLE `celdaitem` DROP FOREIGN KEY `CeldaItem_celdaId_fkey`;

-- DropForeignKey
ALTER TABLE `celdaitem` DROP FOREIGN KEY `CeldaItem_itemId_fkey`;

-- DropForeignKey
ALTER TABLE `prestamo` DROP FOREIGN KEY `Prestamo_celdaId_fkey`;

-- DropForeignKey
ALTER TABLE `prestamo` DROP FOREIGN KEY `Prestamo_itemId_fkey`;

-- DropForeignKey
ALTER TABLE `prestamo` DROP FOREIGN KEY `Prestamo_userId_fkey`;

-- DropForeignKey
ALTER TABLE `session` DROP FOREIGN KEY `Session_userId_fkey`;

-- DropForeignKey
ALTER TABLE `userdata` DROP FOREIGN KEY `UserData_id_fkey`;
