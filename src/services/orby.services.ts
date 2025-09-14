import { PrismaClient, Prisma } from "@prisma/client";
import { subMonths, startOfMonth, endOfMonth } from 'date-fns';

const prisma = new PrismaClient();

const getPatientWhereClause = (shc_code?: string, qr_code?: string): Prisma.patientsWhereUniqueInput => {
    if (shc_code) return { shc_code: shc_code };
    if (qr_code) return { qr_code: qr_code };
    throw new Error("An identifier (shc_code or qr_code) must be provided.");
};

const getPatientId = async (shc_code?: string, qr_code?: string): Promise<string | null> => {
    const whereClause = getPatientWhereClause(shc_code, qr_code);
    const patient = await prisma.patients.findUnique({ where: whereClause, select: { patient_id: true } });
    return patient?.patient_id ?? null;
};

export const findPatientHospitalVisit = async (entities: any[], shc_code?: string, qr_code?: string): Promise<string> => {
    const whereClause = getPatientWhereClause(shc_code, qr_code);
    const hospitalNameEntity = entities.find(e => e.entity === 'hospital_name');
    const dateRangeEntity = entities.find(e => e.entity === 'date_range');
    const dateFilter: { gte?: Date; lt?: Date } = {};

    if (dateRangeEntity) {
        const year = parseInt(dateRangeEntity.value, 10);
        if (!isNaN(year)) {
            // Create a filter for the entire year
            dateFilter.gte = new Date(`${year}-01-01`); // Greater than or equal to Jan 1st
            dateFilter.lt = new Date(`${year + 1}-01-01`);  // Less than Jan 1st of the next year
        }
    }

    if (!hospitalNameEntity) {
        return "Please specify a hospital name."; // Return a friendly string
    }

    const patient = await prisma.patients.findUnique({
        where: whereClause,
        select: { patient_id: true }
    });

    if (!patient) {
        return "Sorry, I couldn't find a patient with those details."; // Return a friendly string
    }

    const hospitalVisits = await prisma.patient_medical_records.findMany({
        where: {
            patient_id: patient.patient_id,
            hospital_name: {
                contains: hospitalNameEntity.value,
                mode: 'insensitive'
            },
            appointment_date: dateFilter
        },
        select: {
            appointment_date: true
        },
        orderBy: {
            appointment_date: 'desc'
        }
    });

    // CORRECTED: Format the database result into a string
    if (hospitalVisits.length === 0) {
        return `I found no records of visits to ${hospitalNameEntity.value}.`;
    }

    const visitDates = hospitalVisits
        .filter(visit => visit.appointment_date !== null) // First, remove any visits with a null date
        .map(visit => new Date(visit.appointment_date!).toLocaleDateString('en-IN')) // Then, map the remaining dates
        .join(', ');

    if (!visitDates) {
        return `I found records for ${hospitalNameEntity.value}, but they do not have specific dates.`;
    }

    return `Records show visits to ${hospitalNameEntity.value} on the following dates: ${visitDates}.`;
};

export const findPatientLastRecord = async(shc_code?: string, qr_code?: string) => {
    const patientId = await getPatientId(shc_code, qr_code);
    if (!patientId) return "Patient not found.";

    const record = await prisma.patient_medical_records.findFirst({
        where: { patient_id: patientId },
        orderBy: { created_at: 'desc' }
    });

    if (!record) return "No records were found.";
    return `The last record added was for '${record.diagnosis_name}' on ${new Date(record.created_at!).toLocaleDateString('en-IN')}.`;
}

export const findPatientLastHospitalVisit = async (shc_code?: string, qr_code?: string): Promise<string> => {
    const patientId = await getPatientId(shc_code, qr_code);
    if (!patientId) return "Patient not found.";

    const visit = await prisma.patient_medical_records.findFirst({
        where: { patient_id: patientId, hospital_name: { not: null } },
        orderBy: { appointment_date: 'desc' }
    });

    if (!visit) return "No hospital visits were found.";
    return `The last hospital visit was to ${visit.hospital_name} on ${new Date(visit.appointment_date!).toLocaleDateString('en-IN')}.`;
};

export const findPatientLastHospitalization = async (shc_code?: string, qr_code?: string): Promise<string> => {
    const patientId = await getPatientId(shc_code, qr_code);
    if (!patientId) return "Patient not found.";

    const hospitalization = await prisma.patient_hospitalization_details.findFirst({
        where: { medical_record: { patient_id: patientId } },
        orderBy: { medical_record: { created_at: 'desc' } },
        include: { medical_record: true }
    });

    if (!hospitalization) return "No hospitalization records were found.";
    return `The last hospitalization was at ${hospitalization.medical_record.hospital_name} for '${hospitalization.reason}'.`;
};

export const findPatientLastSurgery = async (shc_code?: string, qr_code?: string): Promise<string> => {
    const patientId = await getPatientId(shc_code, qr_code);
    if (!patientId) return "Patient not found.";

    const surgery = await prisma.patient_surgery_details.findFirst({
        where: { medical_record: { patient_id: patientId } },
        orderBy: { medical_record: { created_at: 'desc' } },
        include: { medical_record: true }
    });

    if (!surgery) return "No surgery records were found.";
    return `The last surgery was a '${surgery.type}' at ${surgery.medical_record.hospital_name}.`;
};

export const findPatientLastActivity = findPatientLastRecord;

export const checkPatientAllergy = async (shc_code?: string, qr_code?: string): Promise<string> => {
    const patientId = await getPatientId(shc_code, qr_code);
    if (!patientId) return "Patient not found.";

    const patient = await prisma.patients.findUnique({
        where: { patient_id: patientId },
        select: { allergy: true }
    });

    if (!patient) return "Patient not found.";

    if (patient.allergy && patient.allergy.trim() !== "") {
        return `The patient has a recorded allergy to: ${patient.allergy}.`;
    } else {
        return "No allergies are recorded for this patient.";
    }
};

export const checkPatientHabits = async (shc_code?: string, qr_code?: string): Promise<string> => {
    const patientId = await getPatientId(shc_code, qr_code);
    if (!patientId) return "Patient not found.";

    const patient = await prisma.patients.findUnique({
        where: { patient_id: patientId },
        select: { smoking: true, alcoholism: true, tobacco: true, others: true }
    });

    if (!patient) return "Patient not found.";

    const habits = [];
    if (patient.smoking) habits.push("smoking");
    if (patient.alcoholism) habits.push("alcoholism");
    if (patient.tobacco) habits.push("tobacco use");
    if (patient.others) habits.push(patient.others);

    if (habits.length > 0) {
        return `Recorded habits include: ${habits.join(', ')}.`;
    } else {
        return "No specific lifestyle habits are recorded for this patient.";
    }
};

export const checkPatientPregnancy = async (shc_code?: string, qr_code?: string): Promise<string> => {
    const patientId = await getPatientId(shc_code, qr_code);
    if (!patientId) return "Patient not found.";

    const patient = await prisma.patients.findUnique({
        where: { patient_id: patientId },
        select: { pregnancy: true, gender: true }
    });

    if (!patient) return "Patient not found.";

    // Add a check for gender to provide a more logical response
    if (patient.gender?.toLowerCase() !== 'female') {
        return "The patient's record indicates they are not female, so pregnancy status is not applicable.";
    }

    if (patient.pregnancy === true) {
        return "The patient's record indicates they are pregnant.";
    } else {
        return "The patient's record indicates they are not pregnant.";
    }
};

export const getPatientOverview = async (shc_code?: string, qr_code?: string): Promise<string> => {
    const patientId = await getPatientId(shc_code, qr_code);
    if (!patientId) {
        return "Sorry, I couldn't find a patient with those details.";
    }

    const patient = await prisma.patients.findUnique({
        where: { patient_id: patientId },
        select: { full_name: true, date_of_birth: true, gender: true, allergy: true }
    });

    if (!patient) {
        return "Sorry, I couldn't find that patient's overview.";
    }

    // Check if date_of_birth exists before calculating age
    let age = "N/A";
    if (patient.date_of_birth) {
        age = (new Date().getFullYear() - new Date(patient.date_of_birth).getFullYear()).toString();
    }

    const allergies = patient.allergy || "None recorded";

    // Format the object into a string right here in the service
    let overviewText = `Patient Overview:<br>`;
    overviewText += `-------------------<br>`;
    overviewText += `Name: ${patient.full_name}<br>`;
    overviewText += `Age: ${age}<br>`;
    overviewText += `Gender: ${patient.gender}<br>`;
    overviewText += `Allergies: ${allergies}`;

    return overviewText;
};

export const getPatientContactInfo = async (shc_code?: string, qr_code?: string): Promise<string> => {
    const patientId = await getPatientId(shc_code, qr_code);
    if (!patientId) return "Patient not found.";
    const patient = await prisma.patients.findUnique({ where: { patient_id: patientId }, select: { phone_no: true, email: true, address: true } });
    if(!patient) return "Patient not found.";

    const phone = patient.phone_no || 'N/A';
    const email = patient.email || 'N/A';
    const address = patient.address || 'N/A';

    return `Phone: ${phone}<br>Email: ${email}<br>Address: ${address}`;
};

export const findPatientPastDiagnoses = async (shc_code?: string, qr_code?: string): Promise<string> => {
    const patientId = await getPatientId(shc_code, qr_code);
    if (!patientId) return "Patient not found.";

    const records = await prisma.patient_medical_records.findMany({
        where: {
            patient_id: patientId,
            diagnosis_name: { not: null }
        },
        select: {
            diagnosis_name: true,
            appointment_date: true
        },
        orderBy: {
            appointment_date: 'desc'
        }
    });

    if (records.length === 0) {
        return "No past diagnoses were found.";
    }

    // Format the results into a single string
    let responseText = "Past Diagnoses:<br>-------------------<br>";
    records.forEach(record => {
        const date = new Date(record.appointment_date!).toLocaleDateString('en-IN');
        responseText += `${date}: ${record.diagnosis_name}<br>`;
    });

    return responseText;
};

export const findPatientCurrentMedications = async (shc_code?: string, qr_code?: string): Promise<string> => {
    const patientId = await getPatientId(shc_code, qr_code);
    if (!patientId) return "Patient not found.";

    const latestRecord = await prisma.patient_medical_records.findFirst({
        where: { patient_id: patientId },
        orderBy: { appointment_date: 'desc' },
        include: { patient_documents: true }
    });

    if (!latestRecord) {
        return "No medical records were found.";
    }

    const documents = latestRecord.patient_documents;
    if (documents.length === 0) {
        return "No prescription documents were found for the latest record.";
    }

    const prescriptions = documents[0]?.prescriptions;
    if (!prescriptions) {
        return "The latest record has a document, but no prescription was noted.";
    }
    const date = new Date(latestRecord.appointment_date!).toLocaleDateString('en-IN');
    return `Current Medications (as of ${date}):<br>-------------------<br>${prescriptions}`;
};

export const findPatientDoctorVisit = async (entities: any[], shc_code?: string, qr_code?: string): Promise<string> => {
    const patientId = await getPatientId(shc_code, qr_code);
    if (!patientId) return "Patient not found.";

    const doctorNameEntity = entities.find(e => e.entity === 'doctor_name');
    if (!doctorNameEntity) {
        return "Please specify a doctor's name.";
    }

    const doctorName = doctorNameEntity.value;

    const visits = await prisma.patient_medical_records.findMany({
        where: {
            patient_id: patientId,
            doctor_name: {
                contains: doctorName,
                mode: 'insensitive'
            }
        },
        select: {
            appointment_date: true,
            diagnosis_name: true
        },
        orderBy: {
            appointment_date: 'desc'
        }
    });

    if (visits.length === 0) {
        return `I found no records of visits to ${doctorName}.`;
    }

    let responseText = `Visits with ${doctorName}:<br>-------------------<br>`;
    visits.forEach(visit => {
        const date = new Date(visit.appointment_date!).toLocaleDateString('en-IN');
        responseText += `${date} - Diagnosis: ${visit.diagnosis_name || 'N/A'}<br>`;
    });

    return responseText;
};

export const findPatientLabResults = async (entities: any[], shc_code?: string, qr_code?: string): Promise<string> => {
    const patientId = await getPatientId(shc_code, qr_code);
    if (!patientId) {
        return "Patient not found.";
    }

    const dateRangeEntity = entities.find(e => e.entity === 'date_range');
    const dateFilter: { gte?: Date; lte?: Date } = {};

    if (dateRangeEntity) {
        const rangeText = dateRangeEntity.value.toLowerCase();

        if (rangeText === 'last month') {
            const today = new Date();
            const lastMonth = subMonths(today, 1);
            dateFilter.gte = startOfMonth(lastMonth);
            dateFilter.lte = endOfMonth(lastMonth);
        } else { // Handles specific years like "2024"
            const year = parseInt(rangeText, 10);
            if (!isNaN(year)) {
                dateFilter.gte = new Date(`${year}-01-01`);
                dateFilter.lte = new Date(`${year}-12-31`);
            }
        }
    }

    const documents = await prisma.patient_documents.findMany({
        where: {
            medical_record: {
                patient_id: patientId,
            },
            lab_results: { not: null },
            created_at: dateFilter
        },
        select: {
            lab_results: true,
            created_at: true
        },
        orderBy: {
            created_at: 'desc'
        },
        take: 5
    });

    if (documents.length === 0) {
        return "I found no lab results for that period.";
    }

    let responseText = "Found Lab Results:<br>-------------------<br>";
    documents.forEach(doc => {
        const date = new Date(doc.created_at!).toLocaleDateString('en-IN');
        responseText += `On ${date}:<br><a target="_blank" href=${doc.lab_results}>Click to View</a><br><br>`;
    });

    return responseText;
};

export const findPatientEmergencyContact = async (entities: any[], shc_code?: string, qr_code?: string): Promise<string> => {
    const patientId = await getPatientId(shc_code, qr_code);
    if (!patientId) return "Patient not found.";

    const whereFilter: Prisma.patient_emergency_contactsWhereInput = { patient_id: patientId };

    const nameEntity = entities.find(e => e.entity === 'contact_name');
    const relationEntity = entities.find(e => e.entity === 'contact_relation');
    const phoneEntity = entities.find(e => e.entity === 'phone_number');

    if (nameEntity) {
        whereFilter.full_name = { contains: nameEntity.value, mode: 'insensitive' };
    }
    if (relationEntity) {
        whereFilter.relation = { contains: relationEntity.value, mode: 'insensitive' };
    }
    if (phoneEntity) {
        whereFilter.phone_no = { contains: phoneEntity.value };
    }

    const contacts = await prisma.patient_emergency_contacts.findMany({
        where: whereFilter
    });

    if (contacts.length === 0) {
        return "No emergency contacts matching that criteria were found.";
    }

    let responseText = "Found Emergency Contacts:<br>-------------------<br>";
    contacts.forEach(contact => {
        responseText += `Name: ${contact.full_name}<br>Phone: ${contact.phone_no}<br>Relation: ${contact.relation}<br><br>`;
    });

    return responseText.trim();
};

export const getHealthTip = async (entities: any[]): Promise<string> => {
    const whereFilter: Prisma.health_tipsWhereInput = {};
    const categoryEntity = entities.find(e => e.entity === 'tip_category');

    if (categoryEntity) {
        whereFilter.category = { equals: categoryEntity.value, mode: 'insensitive' };
        const tip = await prisma.health_tips.findFirst({ where: whereFilter });
        if (!tip) {
            return `Sorry, I couldn't find any health tips in the category: ${categoryEntity.value}.`;
        }
        return tip.tip_text;
    } else {
        // Fetch a random tip if no category is specified
        const tipCount = await prisma.health_tips.count();
        if (tipCount === 0) {
            return "Sorry, there are no health tips available at the moment.";
        }
        const skip = Math.floor(Math.random() * tipCount);
        const randomTip = await prisma.health_tips.findFirst({
            skip: skip,
        });
        return randomTip?.tip_text || "Here's a tip: stay hydrated!";
    }
};

export const findSpecialistDoctor = async (entities: any[]): Promise<string> => {
    const whereFilter: Prisma.doctorsWhereInput = {};

    const specializationEntity = entities.find(e => e.entity === 'specialization');
    const locationEntity = entities.find(e => e.entity === 'location');
    const genderEntity = entities.find(e => e.entity === 'gender');
    const experienceEntity = entities.find(e => e.entity === 'experience_years');

    if (specializationEntity) {
        whereFilter.specializations = { contains: specializationEntity.value, mode: 'insensitive' };
    }
    if (genderEntity) {
        whereFilter.gender = { equals: genderEntity.value, mode: 'insensitive' };
    }
    if (experienceEntity) {
        const years = parseInt(experienceEntity.value, 10);
        if (!isNaN(years)) {
            whereFilter.years_of_experience = { gte: years };
        }
    }
    if (locationEntity) {
        whereFilter.doctor_hospitals = {
            some: {
                hospital: {
                    address: { contains: locationEntity.value, mode: 'insensitive' }
                }
            }
        };
    }

    const doctors = await prisma.doctors.findMany({
        where: whereFilter,
        select: { full_name: true, specializations: true, years_of_experience: true },
        take: 5
    });

    if (doctors.length === 0) {
        return "Sorry, I couldn't find any doctors matching your criteria.";
    }

    let responseText = "Found Doctors:<br>-------------------<br>";
    doctors.forEach(doctor => {
        responseText += `Dr. ${doctor.full_name} (${doctor.specializations}, ${doctor.years_of_experience} years exp)<br>`;
    });

    return responseText;
};

export const findHospital = async (entities: any[]): Promise<string> => {
    const whereFilter: Prisma.hospitalsWhereInput = {};

    const nameEntity = entities.find(e => e.entity === 'hospital_name');
    const locationEntity = entities.find(e => e.entity === 'location');
    const typeEntity = entities.find(e => e.entity === 'hospital_type');

    if (nameEntity) {
        whereFilter.name = { contains: nameEntity.value, mode: 'insensitive' };
    }
    if (locationEntity) {
        whereFilter.address = { contains: locationEntity.value, mode: 'insensitive' };
    }
    if (typeEntity) {
        whereFilter.type = { equals: typeEntity.value, mode: 'insensitive' };
    }

    const hospitals = await prisma.hospitals.findMany({
        where: whereFilter,
        select: { name: true, type: true, address: true, phone_no: true }
    });

    if (hospitals.length === 0) {
        return "Sorry, I couldn't find any hospitals matching your criteria.";
    }

    let responseText = "Found Hospitals:<br>-------------------<br>";
    hospitals.forEach(hospital => {
        responseText += `Name: ${hospital.name}<br>Type: ${hospital.type}<br>Address: ${hospital.address}<br>Phone: ${hospital.phone_no}<br><br>`;
    });

    return responseText.trim();
};

export const getRecordCount = async (entities: any[], shc_code?: string, qr_code?: string): Promise<string> => {
    const patientId = await getPatientId(shc_code, qr_code);
    if (!patientId) return "Patient not found.";

    const whereFilter: Prisma.patient_medical_recordsWhereInput = { patient_id: patientId };

    const hospitalEntity = entities.find(e => e.entity === 'hospital_name');
    const doctorEntity = entities.find(e => e.entity === 'doctor_name');
    const diagnosisEntity = entities.find(e => e.entity === 'diagnosis_name');
    const entryTypeEntity = entities.find(e => e.entity === 'entry_type');

    if (hospitalEntity) whereFilter.hospital_name = { contains: hospitalEntity.value, mode: 'insensitive' };
    if (doctorEntity) whereFilter.doctor_name = { contains: doctorEntity.value, mode: 'insensitive' };
    if (diagnosisEntity) whereFilter.diagnosis_name = { contains: diagnosisEntity.value, mode: 'insensitive' };
    if (entryTypeEntity) whereFilter.entry_type = { equals: entryTypeEntity.value, mode: 'insensitive' };

    const count = await prisma.patient_medical_records.count({ where: whereFilter });

    return `I found a total of ${count} records matching your criteria.`;
};

export const findTreatmentsForDiagnosis = async (entities: any[], shc_code?: string, qr_code?: string): Promise<string> => {
    const patientId = await getPatientId(shc_code, qr_code);
    if (!patientId) return "Patient not found.";

    const diagnosisEntity = entities.find(e => e.entity === 'diagnosis_name');
    if (!diagnosisEntity) return "Please specify a diagnosis.";

    const records = await prisma.patient_medical_records.findMany({
        where: {
            patient_id: patientId,
            diagnosis_name: { contains: diagnosisEntity.value, mode: 'insensitive' }
        },
        select: { treatment_undergone: true, appointment_date: true }
    });

    if (records.length === 0) {
        return `I found no records for the diagnosis: ${diagnosisEntity.value}.`;
    }

    let responseText = `Treatments for ${diagnosisEntity.value}:<br>-------------------<br>`;
    records.forEach(record => {
        const date = new Date(record.appointment_date!).toLocaleDateString('en-IN');
        responseText += `On ${date}, the following treatment was recorded: ${record.treatment_undergone}<br>`;
    });

    return responseText;
};