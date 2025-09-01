-- AlterTable
ALTER TABLE "public"."patient_medical_records" ALTER COLUMN "visibility" SET DEFAULT true;

-- AlterTable
ALTER TABLE "public"."patients" ALTER COLUMN "shc_code" SET DEFAULT LEFT(md5(gen_random_uuid()::text), 16),
ALTER COLUMN "qr_code" SET DEFAULT LEFT(md5(gen_random_uuid()::text), 16);
