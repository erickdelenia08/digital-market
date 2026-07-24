/*
  Warnings:

  - You are about to drop the `postmedia` table. If the table is not empty, all the data it contains will be lost.
  - A unique constraint covering the columns `[xenditReferenceId]` on the table `Payment` will be added. If there are existing duplicate values, this will fail.
  - Added the required column `updatedAt` to the `DigitalAsset` table without a default value. This is not possible if the table is not empty.
  - Added the required column `assetId` to the `DownloadLog` table without a default value. This is not possible if the table is not empty.

*/
-- DropForeignKey
ALTER TABLE `downloadlog` DROP FOREIGN KEY `DownloadLog_orderId_fkey`;

-- DropForeignKey
ALTER TABLE `postmedia` DROP FOREIGN KEY `PostMedia_postId_fkey`;

-- DropIndex
DROP INDEX `DownloadLog_orderId_fkey` ON `downloadlog`;

-- DropIndex
DROP INDEX `Post_slug_idx` ON `post`;

-- AlterTable
ALTER TABLE `digitalasset` ADD COLUMN `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    ADD COLUMN `description` VARCHAR(191) NULL,
    ADD COLUMN `extension` VARCHAR(191) NULL,
    ADD COLUMN `fileSize` INTEGER NULL,
    ADD COLUMN `mimeType` VARCHAR(191) NULL,
    ADD COLUMN `sortOrder` INTEGER NOT NULL DEFAULT 0,
    ADD COLUMN `updatedAt` DATETIME(3) NOT NULL,
    ADD COLUMN `version` VARCHAR(191) NULL;

-- AlterTable
ALTER TABLE `downloadlog` ADD COLUMN `assetId` VARCHAR(191) NOT NULL,
    ADD COLUMN `ipAddress` VARCHAR(191) NULL,
    ADD COLUMN `userAgent` VARCHAR(191) NULL,
    MODIFY `orderId` VARCHAR(191) NULL;

-- AlterTable
ALTER TABLE `order` MODIFY `status` ENUM('PENDING', 'COMPLETED', 'CANCELLED', 'EXPIRED') NOT NULL DEFAULT 'PENDING';

-- AlterTable
ALTER TABLE `payment` ADD COLUMN `accountNumber` VARCHAR(191) NULL,
    ADD COLUMN `deeplinkUrl` TEXT NULL,
    ADD COLUMN `qrString` TEXT NULL,
    ADD COLUMN `xenditReferenceId` VARCHAR(191) NULL,
    MODIFY `status` ENUM('PENDING', 'PAID', 'EXPIRED', 'FAILED', 'REFUNDED', 'CANCELLED') NOT NULL;

-- AlterTable
ALTER TABLE `post` ADD COLUMN `relatedProductId` VARCHAR(191) NULL,
    ADD COLUMN `viewsCount` INTEGER NOT NULL DEFAULT 0,
    MODIFY `content` LONGTEXT NOT NULL;

-- DropTable
DROP TABLE `postmedia`;

-- CreateIndex
CREATE UNIQUE INDEX `Payment_xenditReferenceId_key` ON `Payment`(`xenditReferenceId`);

-- CreateIndex
CREATE INDEX `Post_relatedProductId_idx` ON `Post`(`relatedProductId`);

-- AddForeignKey
ALTER TABLE `DownloadLog` ADD CONSTRAINT `DownloadLog_assetId_fkey` FOREIGN KEY (`assetId`) REFERENCES `DigitalAsset`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `DownloadLog` ADD CONSTRAINT `DownloadLog_orderId_fkey` FOREIGN KEY (`orderId`) REFERENCES `Order`(`id`) ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `Post` ADD CONSTRAINT `Post_relatedProductId_fkey` FOREIGN KEY (`relatedProductId`) REFERENCES `Product`(`id`) ON DELETE SET NULL ON UPDATE CASCADE;
