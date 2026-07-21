-- AlterTable
ALTER TABLE `post` ADD COLUMN `categoryId` VARCHAR(191) NULL,
    ADD COLUMN `excerpt` TEXT NULL,
    ADD COLUMN `metaDescription` VARCHAR(191) NULL,
    ADD COLUMN `metaTitle` VARCHAR(191) NULL,
    ADD COLUMN `publishedAt` DATETIME(3) NULL,
    MODIFY `coverImage` VARCHAR(191) NULL;

-- AlterTable
ALTER TABLE `postmedia` MODIFY `type` ENUM('IMAGE', 'VIDEO') NOT NULL DEFAULT 'IMAGE';

-- CreateTable
CREATE TABLE `PostCategory` (
    `id` VARCHAR(191) NOT NULL,
    `name` VARCHAR(191) NOT NULL,
    `slug` VARCHAR(191) NOT NULL,
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),

    UNIQUE INDEX `PostCategory_slug_key`(`slug`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateIndex
CREATE INDEX `Post_slug_idx` ON `Post`(`slug`);

-- CreateIndex
CREATE INDEX `Post_published_publishedAt_idx` ON `Post`(`published`, `publishedAt`);

-- CreateIndex
CREATE INDEX `Post_categoryId_idx` ON `Post`(`categoryId`);

-- AddForeignKey
ALTER TABLE `Post` ADD CONSTRAINT `Post_categoryId_fkey` FOREIGN KEY (`categoryId`) REFERENCES `PostCategory`(`id`) ON DELETE SET NULL ON UPDATE CASCADE;

-- RenameIndex
ALTER TABLE `post` RENAME INDEX `Post_authorId_fkey` TO `Post_authorId_idx`;

-- RenameIndex
ALTER TABLE `postmedia` RENAME INDEX `PostMedia_postId_fkey` TO `PostMedia_postId_idx`;
