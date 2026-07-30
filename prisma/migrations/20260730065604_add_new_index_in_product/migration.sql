-- CreateIndex
CREATE INDEX `Product_categoryId_deletedAt_name_idx` ON `Product`(`categoryId`, `deletedAt`, `name`);
