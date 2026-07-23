/*
  Warnings:

  - You are about to drop the column `paymentLog` on the `order` table. All the data in the column will be lost.
  - You are about to drop the column `paymentMethod` on the `order` table. All the data in the column will be lost.
  - You are about to drop the column `xenditInvoiceId` on the `order` table. All the data in the column will be lost.

*/
-- DropIndex
DROP INDEX `Order_xenditInvoiceId_key` ON `order`;

-- AlterTable
ALTER TABLE `order` DROP COLUMN `paymentLog`,
    DROP COLUMN `paymentMethod`,
    DROP COLUMN `xenditInvoiceId`;

-- CreateTable
CREATE TABLE `Payment` (
    `id` VARCHAR(191) NOT NULL,
    `orderId` VARCHAR(191) NOT NULL,
    `xenditPaymentId` VARCHAR(191) NOT NULL,
    `paymentMethod` VARCHAR(191) NULL,
    `status` ENUM('PENDING', 'PAID', 'EXPIRED', 'FAILED') NOT NULL,
    `expiresAt` DATETIME(3) NULL,
    `paidAt` DATETIME(3) NULL,
    `webhookPayload` JSON NULL,
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updatedAt` DATETIME(3) NOT NULL,

    UNIQUE INDEX `Payment_xenditPaymentId_key`(`xenditPaymentId`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- AddForeignKey
ALTER TABLE `Payment` ADD CONSTRAINT `Payment_orderId_fkey` FOREIGN KEY (`orderId`) REFERENCES `Order`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;
