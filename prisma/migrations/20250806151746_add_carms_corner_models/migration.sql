-- CreateTable
CREATE TABLE "CarmTask" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "title" TEXT NOT NULL,
    "description" TEXT NOT NULL,
    "product" TEXT NOT NULL,
    "priority" TEXT NOT NULL DEFAULT 'MEDIUM',
    "dueDate" DATETIME,
    "userId" TEXT NOT NULL,
    "activityId" TEXT,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL,
    CONSTRAINT "CarmTask_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User" ("id") ON DELETE CASCADE ON UPDATE CASCADE,
    CONSTRAINT "CarmTask_activityId_fkey" FOREIGN KEY ("activityId") REFERENCES "Activity" ("id") ON DELETE SET NULL ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "CarmResponse" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "content" TEXT,
    "status" TEXT NOT NULL DEFAULT 'PENDING',
    "notes" TEXT,
    "userId" TEXT NOT NULL,
    "taskId" TEXT NOT NULL,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL,
    CONSTRAINT "CarmResponse_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User" ("id") ON DELETE CASCADE ON UPDATE CASCADE,
    CONSTRAINT "CarmResponse_taskId_fkey" FOREIGN KEY ("taskId") REFERENCES "CarmTask" ("id") ON DELETE CASCADE ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "ProductMention" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "product" TEXT NOT NULL,
    "mentionText" TEXT NOT NULL,
    "context" TEXT,
    "activityId" TEXT NOT NULL,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT "ProductMention_activityId_fkey" FOREIGN KEY ("activityId") REFERENCES "Activity" ("id") ON DELETE CASCADE ON UPDATE CASCADE
);

-- CreateIndex
CREATE INDEX "CarmTask_userId_idx" ON "CarmTask"("userId");

-- CreateIndex
CREATE INDEX "CarmTask_product_idx" ON "CarmTask"("product");

-- CreateIndex
CREATE INDEX "CarmTask_priority_idx" ON "CarmTask"("priority");

-- CreateIndex
CREATE INDEX "CarmResponse_taskId_idx" ON "CarmResponse"("taskId");

-- CreateIndex
CREATE INDEX "CarmResponse_status_idx" ON "CarmResponse"("status");

-- CreateIndex
CREATE INDEX "ProductMention_activityId_idx" ON "ProductMention"("activityId");

-- CreateIndex
CREATE INDEX "ProductMention_product_idx" ON "ProductMention"("product");
