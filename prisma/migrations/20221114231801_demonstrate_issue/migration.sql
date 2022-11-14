-- CreateTable
CREATE TABLE "Foo" (
    "id" TEXT NOT NULL,

    CONSTRAINT "Foo_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Bar" (
    "id" TEXT NOT NULL,

    CONSTRAINT "Bar_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Relationship" (
    "id" TEXT NOT NULL,
    "fooId" TEXT NOT NULL,
    "barId" TEXT NOT NULL,

    CONSTRAINT "Relationship_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "Relationship_fooId_barId_key" ON "Relationship"("fooId", "barId");

-- AddForeignKey
ALTER TABLE "Relationship" ADD CONSTRAINT "Relationship_fooId_fkey" FOREIGN KEY ("fooId") REFERENCES "Foo"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Relationship" ADD CONSTRAINT "Relationship_barId_fkey" FOREIGN KEY ("barId") REFERENCES "Bar"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
