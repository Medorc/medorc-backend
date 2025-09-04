-- AlterTable
ALTER TABLE "public"."doctors" ADD COLUMN     "phone_no" TEXT;

-- AlterTable
ALTER TABLE "public"."patients" ALTER COLUMN "shc_code" SET DEFAULT LEFT(md5(gen_random_uuid()::text), 16),
ALTER COLUMN "qr_code" SET DEFAULT LEFT(md5(gen_random_uuid()::text), 16);
