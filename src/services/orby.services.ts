import { PrismaClient, Prisma } from "@prisma/client";

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