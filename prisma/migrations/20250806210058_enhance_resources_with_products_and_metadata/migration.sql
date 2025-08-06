/*
  Warnings:

  - You are about to drop the column `fileData` on the `Resource` table. All the data in the column will be lost.

*/
-- RedefineTables
PRAGMA defer_foreign_keys=ON;
PRAGMA foreign_keys=OFF;
CREATE TABLE "new_Resource" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "title" TEXT NOT NULL,
    "description" TEXT,
    "type" TEXT NOT NULL DEFAULT 'GENERAL',
    "product" TEXT,
    "url" TEXT,
    "filePath" TEXT,
    "fileName" TEXT,
    "fileSize" INTEGER,
    "mimeType" TEXT,
    "version" TEXT,
    "tags" JSONB,
    "downloadCount" INTEGER NOT NULL DEFAULT 0,
    "lastAccessed" DATETIME,
    "isPublic" BOOLEAN NOT NULL DEFAULT true,
    "userId" TEXT NOT NULL,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL,
    CONSTRAINT "Resource_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User" ("id") ON DELETE CASCADE ON UPDATE CASCADE
);
INSERT INTO "new_Resource" ("createdAt", "description", "id", "title", "type", "updatedAt", "url", "userId") SELECT "createdAt", "description", "id", "title", "type", "updatedAt", "url", "userId" FROM "Resource";
DROP TABLE "Resource";
ALTER TABLE "new_Resource" RENAME TO "Resource";
CREATE INDEX "Resource_userId_idx" ON "Resource"("userId");
CREATE INDEX "Resource_product_idx" ON "Resource"("product");
CREATE INDEX "Resource_type_idx" ON "Resource"("type");
PRAGMA foreign_keys=ON;
PRAGMA defer_foreign_keys=OFF;
