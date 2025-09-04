/*
  Warnings:

  - You are about to drop the column `license_no` on the `external_viewers` table. All the data in the column will be lost.
  - You are about to drop the column `license_valid_till` on the `external_viewers` table. All the data in the column will be lost.
  - You are about to drop the column `website` on the `external_viewers` table. All the data in the column will be lost.
  - A unique constraint covering the columns `[org_license_no]` on the table `external_viewers` will be added. If there are existing duplicate values, this will fail.
  - Added the required column `org_license_no` to the `external_viewers` table without a default value. This is not possible if the table is not empty.

*/
-- DropIndex
DROP INDEX "public"."external_viewers_license_no_key";

-- AlterTable
ALTER TABLE "public"."external_viewers" DROP COLUMN "license_no",
DROP COLUMN "license_valid_till",
DROP COLUMN "website",
ADD COLUMN     "org_license_no" VARCHAR(100) NOT NULL,
ADD COLUMN     "org_license_valid_till" DATE,
ADD COLUMN     "org_website" VARCHAR(255);

-- AlterTable
ALTER TABLE "public"."patients" ALTER COLUMN "shc_code" SET DEFAULT LEFT(md5(gen_random_uuid()::text), 16),
ALTER COLUMN "qr_code" SET DEFAULT LEFT(md5(gen_random_uuid()::text), 16);

-- CreateIndex
CREATE UNIQUE INDEX "external_viewers_org_license_no_key" ON "public"."external_viewers"("org_license_no");
