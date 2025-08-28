-- CreateTable
CREATE TABLE "public"."patients" (
    "patient_id" UUID NOT NULL DEFAULT gen_random_uuid(),
    "email" VARCHAR(255) NOT NULL,
    "password" TEXT NOT NULL,
    "phone_no" VARCHAR(15),
    "shc_code" TEXT NOT NULL DEFAULT LEFT(md5(gen_random_uuid()::text), 16),
    "qr_code" TEXT NOT NULL DEFAULT LEFT(md5(gen_random_uuid()::text), 16),
    "visibility" BOOLEAN DEFAULT false,
    "full_name" VARCHAR(50),
    "gender" VARCHAR(10),
    "photo" TEXT,
    "date_of_birth" DATE,
    "address" TEXT,
    "smoking" BOOLEAN,
    "alcoholism" BOOLEAN,
    "tobacco" BOOLEAN,
    "others" VARCHAR(255),
    "pregnancy" BOOLEAN,
    "exercise" BOOLEAN,
    "allergy" VARCHAR(255),
    "data_logs" TEXT,

    CONSTRAINT "patients_pkey" PRIMARY KEY ("patient_id")
);

-- CreateTable
CREATE TABLE "public"."patient_emergency_contacts" (
    "emg_id" UUID NOT NULL DEFAULT gen_random_uuid(),
    "patient_id" UUID NOT NULL,
    "full_name" VARCHAR(50),
    "phone_no" VARCHAR(15),
    "relation" VARCHAR(50),

    CONSTRAINT "patient_emergency_contacts_pkey" PRIMARY KEY ("emg_id")
);

-- CreateTable
CREATE TABLE "public"."doctors" (
    "doctor_id" UUID NOT NULL DEFAULT gen_random_uuid(),
    "full_name" VARCHAR(100),
    "photo" TEXT,
    "date_of_birth" DATE,
    "address" TEXT,
    "gender" VARCHAR(10),
    "email" VARCHAR(255),
    "password" TEXT,
    "specializations" TEXT,
    "license_number" VARCHAR(50),
    "years_of_experience" INTEGER,
    "status" VARCHAR(20),
    "hospital_affiliation" VARCHAR(255),
    "verification_documents" TEXT,

    CONSTRAINT "doctors_pkey" PRIMARY KEY ("doctor_id")
);

-- CreateTable
CREATE TABLE "public"."hospitals" (
    "hospital_id" UUID NOT NULL DEFAULT gen_random_uuid(),
    "name" VARCHAR(255),
    "photo" TEXT,
    "address" TEXT,
    "phone_no" VARCHAR(20),
    "email" VARCHAR(255),
    "license_no" VARCHAR(100) NOT NULL,
    "website" VARCHAR(255),
    "license_valid_till" DATE,
    "type" VARCHAR(100),
    "password" TEXT,
    "founded_on" DATE,
    "verification_documents" TEXT,

    CONSTRAINT "hospitals_pkey" PRIMARY KEY ("hospital_id")
);

-- CreateTable
CREATE TABLE "public"."doctor_hospitals" (
    "doctor_id" UUID NOT NULL,
    "hospital_id" UUID NOT NULL,

    CONSTRAINT "doctor_hospitals_pkey" PRIMARY KEY ("doctor_id","hospital_id")
);

-- CreateTable
CREATE TABLE "public"."patient_medical_records" (
    "record_id" UUID NOT NULL DEFAULT gen_random_uuid(),
    "patient_id" UUID NOT NULL,
    "doctor_id" UUID,
    "hospital_id" UUID,
    "created_at" TIMESTAMP,
    "updated_at" TIMESTAMP,
    "entry_type" VARCHAR(25),
    "diagnosis_name" VARCHAR(255),
    "visibility" BOOLEAN,
    "history_of_present_illness" TEXT,
    "treatment_undergone" TEXT,
    "doctor_name" VARCHAR(100),
    "hospital_name" VARCHAR(255),
    "appointment_date" DATE,
    "reg_no" VARCHAR(50),
    "alternative_system_of_medicine" VARCHAR(50),

    CONSTRAINT "patient_medical_records_pkey" PRIMARY KEY ("record_id")
);

-- CreateTable
CREATE TABLE "public"."patient_hospitalization_details" (
    "id" UUID NOT NULL DEFAULT gen_random_uuid(),
    "record_id" UUID NOT NULL,
    "duration" VARCHAR(50),
    "reason" TEXT,
    "room_no" VARCHAR(50),
    "treatment_undergone" TEXT,

    CONSTRAINT "patient_hospitalization_details_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."patient_surgery_details" (
    "id" UUID NOT NULL DEFAULT gen_random_uuid(),
    "record_id" UUID NOT NULL,
    "type" VARCHAR(100),
    "duration" VARCHAR(50),
    "outcome" TEXT,
    "medical_condition" TEXT,
    "bed_no" VARCHAR(50),

    CONSTRAINT "patient_surgery_details_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."patient_documents" (
    "doc_id" UUID NOT NULL DEFAULT gen_random_uuid(),
    "record_id" UUID NOT NULL,
    "prescriptions" TEXT,
    "lab_results" TEXT,
    "created_at" TIMESTAMP,
    "updated_at" TIMESTAMP,

    CONSTRAINT "patient_documents_pkey" PRIMARY KEY ("doc_id")
);

-- CreateTable
CREATE TABLE "public"."external_viewers" (
    "viewer_id" UUID NOT NULL DEFAULT gen_random_uuid(),
    "full_name" VARCHAR(100),
    "photo" TEXT,
    "gender" VARCHAR(10),
    "date_of_birth" DATE,
    "org_type" VARCHAR(50),
    "org_name" VARCHAR(50),
    "org_address" TEXT,
    "org_description" TEXT,
    "org_founded_on" DATE,
    "website" VARCHAR(255),
    "phone_no" VARCHAR(15),
    "email" VARCHAR(255),
    "password" TEXT,
    "verification_documents" TEXT,
    "license_no" VARCHAR(100) NOT NULL,
    "license_valid_till" DATE,

    CONSTRAINT "external_viewers_pkey" PRIMARY KEY ("viewer_id")
);

-- CreateTable
CREATE TABLE "public"."health_tips" (
    "id" SERIAL NOT NULL,
    "category" VARCHAR(50) NOT NULL,
    "tip_text" TEXT NOT NULL,
    "created_at" TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "health_tips_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "patients_email_key" ON "public"."patients"("email");

-- CreateIndex
CREATE UNIQUE INDEX "patients_shc_code_key" ON "public"."patients"("shc_code");

-- CreateIndex
CREATE UNIQUE INDEX "patients_qr_code_key" ON "public"."patients"("qr_code");

-- CreateIndex
CREATE INDEX "patients_email_idx" ON "public"."patients"("email");

-- CreateIndex
CREATE INDEX "patient_emergency_contacts_patient_id_idx" ON "public"."patient_emergency_contacts"("patient_id");

-- CreateIndex
CREATE UNIQUE INDEX "doctors_email_key" ON "public"."doctors"("email");

-- CreateIndex
CREATE INDEX "doctors_email_idx" ON "public"."doctors"("email");

-- CreateIndex
CREATE INDEX "doctors_license_number_idx" ON "public"."doctors"("license_number");

-- CreateIndex
CREATE UNIQUE INDEX "hospitals_email_key" ON "public"."hospitals"("email");

-- CreateIndex
CREATE UNIQUE INDEX "hospitals_license_no_key" ON "public"."hospitals"("license_no");

-- CreateIndex
CREATE INDEX "hospitals_name_idx" ON "public"."hospitals"("name");

-- CreateIndex
CREATE INDEX "hospitals_email_idx" ON "public"."hospitals"("email");

-- CreateIndex
CREATE INDEX "patient_medical_records_patient_id_idx" ON "public"."patient_medical_records"("patient_id");

-- CreateIndex
CREATE INDEX "patient_medical_records_doctor_id_idx" ON "public"."patient_medical_records"("doctor_id");

-- CreateIndex
CREATE INDEX "patient_medical_records_hospital_id_idx" ON "public"."patient_medical_records"("hospital_id");

-- CreateIndex
CREATE INDEX "patient_medical_records_created_at_idx" ON "public"."patient_medical_records"("created_at");

-- CreateIndex
CREATE INDEX "patient_medical_records_visibility_idx" ON "public"."patient_medical_records"("visibility");

-- CreateIndex
CREATE INDEX "patient_medical_records_entry_type_idx" ON "public"."patient_medical_records"("entry_type");

-- CreateIndex
CREATE INDEX "patient_hospitalization_details_record_id_idx" ON "public"."patient_hospitalization_details"("record_id");

-- CreateIndex
CREATE INDEX "patient_surgery_details_record_id_idx" ON "public"."patient_surgery_details"("record_id");

-- CreateIndex
CREATE INDEX "patient_documents_record_id_idx" ON "public"."patient_documents"("record_id");

-- CreateIndex
CREATE UNIQUE INDEX "external_viewers_email_key" ON "public"."external_viewers"("email");

-- CreateIndex
CREATE UNIQUE INDEX "external_viewers_license_no_key" ON "public"."external_viewers"("license_no");

-- AddForeignKey
ALTER TABLE "public"."patient_emergency_contacts" ADD CONSTRAINT "patient_emergency_contacts_patient_id_fkey" FOREIGN KEY ("patient_id") REFERENCES "public"."patients"("patient_id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."doctor_hospitals" ADD CONSTRAINT "doctor_hospitals_doctor_id_fkey" FOREIGN KEY ("doctor_id") REFERENCES "public"."doctors"("doctor_id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."doctor_hospitals" ADD CONSTRAINT "doctor_hospitals_hospital_id_fkey" FOREIGN KEY ("hospital_id") REFERENCES "public"."hospitals"("hospital_id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."patient_medical_records" ADD CONSTRAINT "patient_medical_records_patient_id_fkey" FOREIGN KEY ("patient_id") REFERENCES "public"."patients"("patient_id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."patient_medical_records" ADD CONSTRAINT "patient_medical_records_doctor_id_fkey" FOREIGN KEY ("doctor_id") REFERENCES "public"."doctors"("doctor_id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."patient_medical_records" ADD CONSTRAINT "patient_medical_records_hospital_id_fkey" FOREIGN KEY ("hospital_id") REFERENCES "public"."hospitals"("hospital_id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."patient_hospitalization_details" ADD CONSTRAINT "patient_hospitalization_details_record_id_fkey" FOREIGN KEY ("record_id") REFERENCES "public"."patient_medical_records"("record_id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."patient_surgery_details" ADD CONSTRAINT "patient_surgery_details_record_id_fkey" FOREIGN KEY ("record_id") REFERENCES "public"."patient_medical_records"("record_id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."patient_documents" ADD CONSTRAINT "patient_documents_record_id_fkey" FOREIGN KEY ("record_id") REFERENCES "public"."patient_medical_records"("record_id") ON DELETE CASCADE ON UPDATE CASCADE;
