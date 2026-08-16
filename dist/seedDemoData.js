import "dotenv/config";
import { PrismaClient } from "@prisma/client";
import bcrypt from "bcrypt";
const prisma = new PrismaClient();
async function seedDemoData() {
    console.log("🌱 Starting Medorc Demo Data Seeding...");
    const hashedPassword = await bcrypt.hash("password123", 10);
    const patientEmail = "ilakkiyanj.pt@medorc.in";
    // 1. Create or Update Demo Patient
    let patient = await prisma.patients.findUnique({
        where: { email: patientEmail }
    });
    const logsArray = [
        `${new Date(Date.now() - 3600000 * 2).toISOString()} - DOCTOR [Dr. Ananya Roy] accessed your medical records`,
        `${new Date(Date.now() - 3600000 * 24).toISOString()} - HOSPITAL [Apollo Multi-Specialty Hospital] accessed your profile`,
        `${new Date(Date.now() - 3600000 * 72).toISOString()} - DOCTOR [Dr. Rajesh Sharma] added a new medical record`,
        `${new Date(Date.now() - 3600000 * 120).toISOString()} - EXTERN [Central Diagnostic Lab] requested SHC verification`
    ];
    const dataLogsString = logsArray.join("\n");
    if (patient) {
        console.log(`ℹ️ Patient ${patientEmail} exists. Updating profile details...`);
        patient = await prisma.patients.update({
            where: { email: patientEmail },
            data: {
                full_name: "Ilakkiyan J",
                phone_no: "9876543210",
                gender: "Male",
                blood_group: "O+",
                date_of_birth: new Date("1998-05-15"),
                address: "123 Health Ave, Metro City",
                allergy: "Penicillin, Peanuts",
                smoking: false,
                alcoholism: false,
                exercise: true,
                visibility: true,
                data_logs: dataLogsString
            }
        });
    }
    else {
        console.log(`✨ Creating Patient account: ${patientEmail}`);
        patient = await prisma.patients.create({
            data: {
                email: patientEmail,
                password: hashedPassword,
                full_name: "Ilakkiyan J",
                phone_no: "9876543210",
                shc_code: "SHC-ILAKKIYAN-01",
                qr_code: "QR-ILAKKIYAN-01",
                gender: "Male",
                blood_group: "O+",
                date_of_birth: new Date("1998-05-15"),
                address: "123 Health Ave, Metro City",
                allergy: "Penicillin, Peanuts",
                smoking: false,
                alcoholism: false,
                exercise: true,
                visibility: true,
                data_logs: dataLogsString
            }
        });
    }
    console.log(`✅ Patient Account Ready: ${patient.full_name} (${patient.email})`);
    console.log(`   SHC Code: ${patient.shc_code} | QR Code: ${patient.qr_code}`);
    // 2. Create Emergency Contacts
    await prisma.patient_emergency_contacts.deleteMany({
        where: { patient_id: patient.patient_id }
    });
    await prisma.patient_emergency_contacts.createMany({
        data: [
            {
                patient_id: patient.patient_id,
                full_name: "Anand J",
                phone_no: "9876543211",
                relation: "Father"
            },
            {
                patient_id: patient.patient_id,
                full_name: "Kavitha J",
                phone_no: "9876543212",
                relation: "Mother"
            }
        ]
    });
    console.log("✅ Added 2 Emergency Contacts.");
    // 3. Create Doctor Accounts
    const doctor1Email = "dr.ananya@medorc.in";
    const doctor2Email = "dr.rajesh@medorc.in";
    let doc1 = await prisma.doctors.upsert({
        where: { email: doctor1Email },
        update: { full_name: "Dr. Ananya Roy", specializations: "General Medicine", years_of_experience: 8 },
        create: {
            email: doctor1Email,
            password: hashedPassword,
            full_name: "Dr. Ananya Roy",
            specializations: "General Medicine",
            license_no: "LIC-DOC-101",
            years_of_experience: 8,
            gender: "Female",
            phone_no: "9123456781"
        }
    });
    let doc2 = await prisma.doctors.upsert({
        where: { email: doctor2Email },
        update: { full_name: "Dr. Rajesh Sharma", specializations: "Cardiology", years_of_experience: 12 },
        create: {
            email: doctor2Email,
            password: hashedPassword,
            full_name: "Dr. Rajesh Sharma",
            specializations: "Cardiology",
            license_no: "LIC-DOC-102",
            years_of_experience: 12,
            gender: "Male",
            phone_no: "9123456782"
        }
    });
    console.log(`✅ Created Doctor Accounts: ${doc1.full_name}, ${doc2.full_name}`);
    // 4. Create Hospital Accounts
    const hospital1Email = "apollo@medorc.in";
    const hospital2Email = "fortis@medorc.in";
    let hosp1 = await prisma.hospitals.upsert({
        where: { email: hospital1Email },
        update: { name: "Apollo Multi-Specialty Hospital" },
        create: {
            email: hospital1Email,
            password: hashedPassword,
            name: "Apollo Multi-Specialty Hospital",
            license_no: "LIC-HOSP-201",
            type: "Multi-Specialty",
            address: "45 Care Boulevard, Metro City",
            phone_no: "044-24567890"
        }
    });
    let hosp2 = await prisma.hospitals.upsert({
        where: { email: hospital2Email },
        update: { name: "Fortis Heart Institute" },
        create: {
            email: hospital2Email,
            password: hashedPassword,
            name: "Fortis Heart Institute",
            license_no: "LIC-HOSP-202",
            type: "Super-Specialty",
            address: "88 Cardiac Drive, Metro City",
            phone_no: "044-28901234"
        }
    });
    console.log(`✅ Created Hospital Accounts: ${hosp1.name}, ${hosp2.name}`);
    // 5. Add Medical Records for Patient
    console.log("🧹 Clearing old medical records for clean demo dataset...");
    await prisma.patient_medical_records.deleteMany({
        where: { patient_id: patient.patient_id }
    });
    // Record 1: Self Entry (Fever Checkup)
    const rec1 = await prisma.patient_medical_records.create({
        data: {
            patient_id: patient.patient_id,
            entry_type: "Self",
            diagnosis_name: "Acute Viral Fever & Dehydration",
            doctor_name: "Dr. Ananya Roy",
            hospital_name: "Apollo Multi-Specialty Hospital",
            appointment_date: new Date("2026-08-01"),
            history_of_present_illness: "High grade fever, chills, body ache for 3 days.",
            treatment_undergone: "Paracetamol 650mg TDS, ORS hydration, IV Fluids, Rest for 5 days.",
            visibility: true,
            created_at: new Date("2026-08-01T10:00:00Z"),
            patient_documents: {
                create: {
                    prescriptions: "https://res.cloudinary.com/dwzhvwcxi/image/upload/v1786795060/patient-documents/k1c1p4j3zzgry8jpymko.pdf",
                    lab_results: "https://res.cloudinary.com/dwzhvwcxi/image/upload/v1786795060/patient-documents/k1c1p4j3zzgry8jpymko.pdf"
                }
            }
        }
    });
    // Record 2: Doctor Entry (Cardiology)
    const rec2 = await prisma.patient_medical_records.create({
        data: {
            patient_id: patient.patient_id,
            doctor_id: doc2.doctor_id,
            hospital_id: hosp2.hospital_id,
            entry_type: "Doctor",
            diagnosis_name: "Mild Hypertension & Tachycardia",
            doctor_name: "Dr. Rajesh Sharma",
            hospital_name: "Fortis Heart Institute",
            appointment_date: new Date("2026-06-15"),
            history_of_present_illness: "Episodic shortness of breath after heavy exertion.",
            treatment_undergone: "Amlodipine 5mg daily, Sodium restriction, 30 min daily cardio.",
            visibility: true,
            created_at: new Date("2026-06-15T11:30:00Z")
        }
    });
    // Record 3: Hospital Entry (Surgery & Hospitalization)
    const rec3 = await prisma.patient_medical_records.create({
        data: {
            patient_id: patient.patient_id,
            doctor_id: doc1.doctor_id,
            hospital_id: hosp1.hospital_id,
            entry_type: "Hospital",
            diagnosis_name: "Ligament Tear & Arthroscopy",
            doctor_name: "Dr. Ananya Roy",
            hospital_name: "Apollo Multi-Specialty Hospital",
            appointment_date: new Date("2026-03-10"),
            history_of_present_illness: "ACL strain from sports injury.",
            treatment_undergone: "Knee Immobilization, Arthroscopic ACL Repair, and Physiotherapy.",
            visibility: true,
            created_at: new Date("2026-03-10T09:00:00Z"),
            patient_hospitalization_details: {
                create: {
                    duration: "3 Days",
                    reason: "Knee ligament repair & post-op monitoring",
                    room_no: "302",
                    treatment_undergone: "IV Antibiotics, Analgesics, Physiotherapy"
                }
            },
            patient_surgery_details: {
                create: {
                    type: "Arthroscopic ACL Repair",
                    duration: "2 Hours",
                    outcome: "Successful, non-weight bearing for 2 weeks",
                    medical_condition: "ACL Tear",
                    bed_no: "BED-302"
                }
            }
        }
    });
    console.log("✅ Created 3 Comprehensive Medical Records (with Hospitalization & Surgery details)");
    console.log("🎉 Demo Seeding Completed Successfully!");
}
seedDemoData()
    .catch((e) => {
    console.error("❌ Seed error:", e);
    process.exit(1);
})
    .finally(async () => {
    await prisma.$disconnect();
});
//# sourceMappingURL=seedDemoData.js.map