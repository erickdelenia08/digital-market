-- CreateIndex
CREATE INDEX `Product_isPublished_deletedAt_idx` ON `Product`(`isPublished`, `deletedAt`);
