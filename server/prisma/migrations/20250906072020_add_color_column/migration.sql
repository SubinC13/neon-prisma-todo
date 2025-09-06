-- AlterTable
ALTER TABLE "public"."Todo" ADD COLUMN     "category" TEXT DEFAULT 'general',
ADD COLUMN     "color" TEXT NOT NULL DEFAULT 'yellow';
