-- CreateTable
CREATE TABLE "DataMapping" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "account_master_id" TEXT,
    "edges" TEXT NOT NULL,
    "file_name" TEXT NOT NULL,
    "nodes" TEXT NOT NULL,
    "register_time" DATETIME NOT NULL,
    "update_time" DATETIME NOT NULL,
    "version" INTEGER NOT NULL
);
