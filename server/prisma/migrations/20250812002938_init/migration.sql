-- DropForeignKey
ALTER TABLE `orderstatuslog` DROP FOREIGN KEY `OrderStatusLog_adminId_fkey`;

-- DropIndex
DROP INDEX `OrderStatusLog_adminId_fkey` ON `orderstatuslog`;

-- AlterTable
ALTER TABLE `orderstatuslog` MODIFY `adminId` INTEGER NULL;

-- AddForeignKey
ALTER TABLE `OrderStatusLog` ADD CONSTRAINT `OrderStatusLog_adminId_fkey` FOREIGN KEY (`adminId`) REFERENCES `User`(`id`) ON DELETE SET NULL ON UPDATE CASCADE;
