-- AlterTable
ALTER TABLE "Tip" ADD COLUMN "stripePaymentIntentId" TEXT;

-- CreateIndex
CREATE UNIQUE INDEX "Tip_stripePaymentIntentId_key" ON "Tip"("stripePaymentIntentId");
