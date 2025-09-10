import { PrismaClient, Prisma } from "@prisma/client";

const prisma = new PrismaClient();

const getPatientWhereClause = (shc_code?: string, qr_code?: string): Prisma.patientsWhereUniqueInput => {
    if (shc_code) return { shc_code: shc_code };
    if (qr_code) return { qr_code: qr_code };
    throw new Error("An identifier (shc_code or qr_code) must be provided.");
};

export const findPatientHospitalVisit = async (entities: any[], shc_code?: string, qr_code?: string): Promise<string> => {
    const whereClause = getPatientWhereClause(shc_code, qr_code);
    const hospitalNameEntity = entities.find(e => e.entity === 'hospital_name');

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
            }
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
        .map(visit => new Date(visit.appointment_date).toLocaleDateString('en-IN'))
        .join(', ');

    return `Records show visits to ${hospitalNameEntity.value} on the following dates: ${visitDates}.`;
};