/*
  Warnings:

  - You are about to drop the column `license_number` on the `doctors` table. All the data in the column will be lost.

*/
-- DropIndex
DROP INDEX "public"."doctors_license_number_idx";

-- AlterTable
ALTER TABLE "public"."doctors" DROP COLUMN "license_number",
ADD COLUMN     "license_no" VARCHAR(50);

-- AlterTable
ALTER TABLE "public"."patients" ALTER COLUMN "shc_code" SET DEFAULT LEFT(md5(gen_random_uuid()::text), 16),
ALTER COLUMN "qr_code" SET DEFAULT LEFT(md5(gen_random_uuid()::text), 16);

-- CreateIndex
CREATE INDEX "doctors_license_no_idx" ON "public"."doctors"("license_no");
