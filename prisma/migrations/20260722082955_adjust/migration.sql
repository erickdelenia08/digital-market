/*
  Warnings:

  - Added the required column `productName` to the `OrderItem` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE `orderitem` ADD COLUMN `productName` VARCHAR(191) NOT NULL,
    MODIFY `price` DECIMAL(10, 2) NOT NULL;
