-- DropIndex
DROP INDEX `Product_slug_idx` ON `product`;

-- AlterTable
ALTER TABLE `product` ADD COLUMN `salesCount` INTEGER NOT NULL DEFAULT 0;
