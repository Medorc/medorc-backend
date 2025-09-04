/*
  Warnings:

  - A unique constraint covering the columns `[record_id]` on the table `patient_documents` will be added. If there are existing duplicate values, this will fail.

*/
-- AlterTable
ALTER TABLE "public"."patients" ALTER COLUMN "shc_code" SET DEFAULT LEFT(md5(gen_random_uuid()::text), 16),
ALTER COLUMN "qr_code" SET DEFAULT LEFT(md5(gen_random_uuid()::text), 16);

-- CreateIndex
CREATE UNIQUE INDEX "patient_documents_record_id_key" ON "public"."patient_documents"("record_id");
