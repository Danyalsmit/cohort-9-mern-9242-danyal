/*
  Warnings:

  - You are about to alter the column `token` on the `blacklistedtoken` table. The data in that column could be lost. The data in that column will be cast from `VarChar(500)` to `VarChar(64)`.

*/
-- AlterTable
ALTER TABLE `blacklistedtoken` MODIFY `token` VARCHAR(64) NOT NULL;
