-- Add moderation fields for content visibility
ALTER TABLE "Content"
ADD COLUMN "isHidden" BOOLEAN NOT NULL DEFAULT false,
ADD COLUMN "hiddenReason" TEXT,
ADD COLUMN "hiddenAt" TIMESTAMP(3);
