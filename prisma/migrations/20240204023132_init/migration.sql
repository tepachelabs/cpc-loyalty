-- CreateTable
CREATE TABLE "Order" (
    "id" SERIAL NOT NULL,
    "shopifyOrderId" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3),
    "email" TEXT,
    "phone" TEXT,
    "orderNumber" INTEGER NOT NULL,
    "total" TEXT NOT NULL,
    "test" BOOLEAN NOT NULL DEFAULT false,

    CONSTRAINT "Order_pkey" PRIMARY KEY ("id")
);
