import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import type { JwtPayload } from 'jsonwebtoken';
import {PrismaClient} from "@prisma/client";
import {Prisma} from "@prisma/client";
import type {PatientDetails, Lifestyle, EmergencyContact, Record,
PatientIdentifier, HospitalizationRecordDetails, SurgeryRecordDetails, SearchOptions} from "../types/application.js";

const prisma = new PrismaClient();

const getPatientWhereClause = (patient_id?: string, shc_code?: string, qr_code?: string): Prisma.patientsWhereUniqueInput => {
    if (patient_id) {
        return { patient_id: patient_id };
    }
    if (shc_code) {
        return { shc_code: shc_code };
    }
    if (qr_code) {
        return { qr_code: qr_code };
    }

    // If no identifier is provided, throw an error
    throw new Error("An identifier (patient_id, shc_code, or qr_code) must be provided.");
};

export const createPatient = async (patient:PatientDetails)=>{
            if(!patient || !patient.password){
                throw new Error("patient details were not received properly");
            }
            const { password, ...restOfDetails } = patient;
            const saltRounds =10;
            const password_hash = await bcrypt.hash(password, saltRounds);
            const newUser = await prisma.patients.create({
                data: {
                    ...restOfDetails,           // Spread the other details
                    date_of_birth: new Date(restOfDetails.date_of_birth),
                    password: password_hash, // Use the correct field name for the hash
                },
            });
            const token = jwt.sign(
                {
                    id: newUser.patient_id,
                    role: "patient",
                },
                process.env.JWT_SECRET!,
                { expiresIn: '24h' }
            );
            const { password: _, ...userWithoutPassword } = newUser;
            return { token, user: userWithoutPassword };
}

export const getPatientProfile = async(patient_id?: string, shc_code?:string, qr_code?:string)=>{
         let whereClause: Prisma.patientsWhereUniqueInput = getPatientWhereClause(patient_id, shc_code, qr_code);

         const patientProfile = await prisma.patients.findUnique({
             where: whereClause,
             // Select only the fields you want to return
             select: {
                 full_name: true,
                 email: true,
                 date_of_birth: true,
                 phone_no: true,
                 visibility:true,
                 shc_code:true,
                 qr_code: true,
                 photo: true,
             }
         });
         if(!patientProfile){
             console.log("User not found");
             throw new Error("User not found");
         }
         return { ...patientProfile, role: "patient" };
}

export const getPatientPersonalDetails = async(patient_id?: string, shc_code?:string, qr_code?:string) =>{
    let whereClause: Prisma.patientsWhereUniqueInput = getPatientWhereClause(patient_id, shc_code, qr_code);

        const patientPersonalDetails = await prisma.patients.findUnique({
            where: whereClause,
            // Select only the fields you want to return
            select: {
                full_name: true,
                photo: true,
                date_of_birth: true,
                gender: true,
                address: true,
                smoking: true,
                alcoholism: true,
                tobacco: true,
                pregnancy: true,
                exercise: true,
                others: true,
                allergy:true
            }
        });
        if(!patientPersonalDetails) {
            console.log("User not found");
            throw new Error("User not found");
        }
        return patientPersonalDetails;
}

export const getPatientBasicDetails = async(patient_id?: string, shc_code?:string, qr_code?:string) => {
       let whereClause: Prisma.patientsWhereUniqueInput = getPatientWhereClause(patient_id, shc_code, qr_code);

        const patientBasicDetails = await prisma.patients.findUnique({
            where: whereClause,
            // Select only the fields you want to return
            select: {
                email: true,
                phone_no: true,
                photo: true
            }
        });
        if(!patientBasicDetails) {
            console.log("User not found");
            throw new Error("User not found");
        }
        return patientBasicDetails;

}

export const getPatientEmergencyContacts = async(patientIdentifier: PatientIdentifier) => {

    let whereClause: Prisma.patientsWhereUniqueInput = getPatientWhereClause(patientIdentifier.patient_id, patientIdentifier.shc_code, patientIdentifier.qr_code);

        const patientEmergencyContacts = await prisma.patients.findUnique({
            where: whereClause,
            // Select only the fields you want to return
            select: {
                patient_emergency_contacts:true
            }
        });
        if(!patientEmergencyContacts) {
            console.log("User not found");
            throw new Error("User not found");
        }
        return patientEmergencyContacts;

}

export const getPatientDataLogs = async(patientIdentifier: PatientIdentifier) => {

    let whereClause: Prisma.patientsWhereUniqueInput = getPatientWhereClause(patientIdentifier.patient_id, patientIdentifier.shc_code, patientIdentifier.qr_code);

        const patientDataLogs = await prisma.patients.findUnique({
            where: whereClause,
            // Select only the fields you want to return
            select: {
                data_logs:true
            }
        });

        if(!patientDataLogs) {
            console.log("User not found");
            throw new Error("User not found");
        }
        return patientDataLogs;

}

export const updatePatientVisibility = async(curVisibility: boolean, patient_id: string)=> {

        let whereClause: Prisma.patientsWhereUniqueInput ;

        // 2. Conditionally build the where clause based on provided arguments
        if (patient_id) {
            whereClause = { patient_id: patient_id };
        } else {
            // 3. If no identifier is provided, throw an error
            throw new Error("An identifier (patient_id) must be provided.");
        }

        const updatedVisibility = await prisma.patients.update({
            where: whereClause,
            // Select only the fields you want to return
            data:{
                visibility: !curVisibility,
            },
            select: {
                visibility:true
            }
        });

        if(!updatedVisibility) {
            console.log("User not found");
            throw new Error("User not found");
        }
        return updatedVisibility;

}

export const updatePatientPhoto =  async(newPhoto:string, patient_id: string)=> {

        let whereClause: Prisma.patientsWhereUniqueInput ;

        // 2. Conditionally build the where clause based on provided arguments
        if (patient_id) {
            whereClause = { patient_id: patient_id };
        } else {
            // 3. If no identifier is provided, throw an error
            throw new Error("An identifier (patient_id) must be provided.");
        }

        const updatedPhoto = await prisma.patients.update({
            where: whereClause,
            // Select only the fields you want to return
            data:{
                photo: newPhoto,
            },
            select: {
                photo: true
            }
        });

        if(!updatedPhoto) {
            console.log("User not found");
            throw new Error("User not found");
        }
        return updatedPhoto;

}


export const updatePatientLifestyle = async(newLifestyle:Lifestyle, patient_id: string)=> {

        let whereClause: Prisma.patientsWhereUniqueInput ;
        // 2. Conditionally build the where clause based on provided arguments
        if (patient_id) {
            whereClause = { patient_id: patient_id };
        } else {
            // 3. If no identifier is provided, throw an error
            throw new Error("An identifier (patient_id) must be provided.");
        }
        if(newLifestyle){
            const updatedLifestyle = await prisma.patients.update({
                where: whereClause,
                // Select only the fields you want to return
                data:{
                    smoking: newLifestyle.smoking,
                    alcoholism: newLifestyle.alcoholism,
                    exercise: newLifestyle.exercise,
                    pregnancy: newLifestyle.pregnancy,
                    others: newLifestyle.others,
                    allergy: newLifestyle.allergy,
                    tobacco: newLifestyle.tobacco,
                },
                select: {
                    smoking:true,
                    alcoholism:true,
                    tobacco:true,
                    exercise:true,
                    pregnancy:true,
                    others:true,
                    allergy:true,
                }
            });
            if(!updatedLifestyle) {
                console.log("User not found");
                throw new Error("User not found");
            }
            return updatedLifestyle;
        }else{
            throw new Error("Lifestyle must be provided.");
        }

}

export const updatePatientEmail = async(newEmail:string, patient_id: string)=> {

        let whereClause: Prisma.patientsWhereUniqueInput ;
        // 2. Conditionally build the where clause based on provided arguments
        if (patient_id) {
            whereClause = { patient_id: patient_id };
        } else {
            // 3. If no identifier is provided, throw an error
            throw new Error("An identifier (patient_id) must be provided.");
        }
        if(newEmail){
            const updatedEmail = await prisma.patients.update({
                where: whereClause,
                data:{
                    email: newEmail,
                },
                select:{
                    email:true
                }
            })
            if(!updatedEmail) {
                console.log("User not found");
                throw new Error("User not found");
            }
            return updatedEmail;
        }
        else{
            throw new Error("Email id must be provided.");
        }

}

export const updatePatientPhoneNo = async(newPhoneNo:string, patient_id: string)=> {

        let whereClause: Prisma.patientsWhereUniqueInput ;
        // 2. Conditionally build the where clause based on provided arguments
        if (patient_id) {
            whereClause = { patient_id: patient_id };
        } else {
            // 3. If no identifier is provided, throw an error
            throw new Error("An identifier (patient_id) must be provided.");
        }
        if(newPhoneNo) {
            const updatedPhoneNo = await prisma.patients.update({
                where: whereClause,
                data:{
                    phone_no: newPhoneNo,
                },
                select:{
                    phone_no:true
                }
            })
            if(!updatedPhoneNo) {
                console.log("User not found");
                throw new Error("User not found");
            }
            return updatedPhoneNo;
        }
        else{
            throw new Error("Phone No must be provided.");
        }

}

export const updatePatientPassword = async(newPassword:string, patient_id: string)=> {

        if (!patient_id) {
            throw new Error("An identifier (patient_id) must be provided.");
        }
        if(newPassword) {
            const saltRounds =10;
            const password_hash = await bcrypt.hash(newPassword, saltRounds);
            const updatedPassword = await prisma.patients.update({
                where: {patient_id},
                data:{
                    password: password_hash,
                },
                select:{
                    full_name: true
                }
            })
            if(!updatedPassword) {
                console.log("User not found");
                throw new Error("User not found");
            }
            return true;
        }
        else{
            throw new Error("Password must be provided.");
        }

}

export const addPatientEmergencyContact = async(emergencyContact:EmergencyContact, patient_id:string)=>{
    if (!patient_id) {
        throw new Error("An identifier (patient_id) must be provided.");
    }

    const existingContactCount = await prisma.patient_emergency_contacts.count({
            where: {
                patient_id: patient_id
            }
        });
        //Throw error as the patient already has the limit of 3 emergency contacts
        if (existingContactCount >= 3) {
            throw new Error("Maximum limit of 3 emergency contacts reached.");
        }
        const newEmergencyContact = await prisma.patient_emergency_contacts.create({
            data: {
                patient_id: patient_id,
                full_name: emergencyContact.full_name,
                phone_no: emergencyContact.phone_no,
                relation: emergencyContact.relation
            },
            select:{
                full_name: true,
                phone_no: true,
                relation:true
            }
        });
        if(!newEmergencyContact) {
            throw new Error("Unable to add Emergency contact.");
        }
        return newEmergencyContact;
}

export const deletePatientEmergencyContact = async(patient_id: string, emg_id: string)=>{
    if (!patient_id || !emg_id) {
        throw new Error("An identifier (patient_id, emg_id) must be provided.");
    }
            const deletedContact = await prisma.patient_emergency_contacts.delete({
                where: { emg_id } // assuming emg_id is unique
            });
            // optional: verify deleted contact belongs to patient
            if (deletedContact.patient_id !== patient_id) {
                throw new Error("Unauthorized: contact does not belong to this patient");
            }
            return deletedContact;
}

export const addPatientDataLog = async (
    patientIdentifier: PatientIdentifier,
    newLogEntry: string) => {
    // Find the patient and retrieve their existing logs
    let whereClause: Prisma.patientsWhereUniqueInput = getPatientWhereClause(patientIdentifier.patient_id, patientIdentifier.shc_code, patientIdentifier.qr_code);
    const patient = await prisma.patients.findUnique({
        where: whereClause,
        select: { data_logs: true },
    });

    if (!patient) {
        throw new Error("Patient not found for logging.");
    }

    const existingLogs = patient.data_logs ? patient.data_logs.split(',').filter(log => log) : [];

    existingLogs.unshift(newLogEntry);

    const updatedLogs = existingLogs.slice(0, 50);

    await prisma.patients.update({
        where: whereClause,
        data: {
            data_logs: updatedLogs.join(','),
        },
    });
};

export const createPatientRecord = async(
    patientIdentifier: PatientIdentifier,
    record:Record,
    creatorPayload: JwtPayload | string)=>{
      if(!record || !record.basicDetails){
          throw new Error("Basic record must be provided.");
      }
    let whereClause: Prisma.patientsWhereUniqueInput = getPatientWhereClause(patientIdentifier.patient_id, patientIdentifier.shc_code, patientIdentifier.qr_code);
    const patient = await prisma.patients.findUnique({
        where: whereClause,
        select: { patient_id: true }
    });
    if (!patient) {
        throw new Error("Patient not found.");
    }
    const recordCreateData: Prisma.patient_medical_recordsCreateInput = {
        patient: { connect: { patient_id: patient.patient_id } },
        created_at: new Date(), // Set the creation timestamp
        entry_type: "Self",
        ...record.basicDetails
    };

    if (typeof creatorPayload === 'object' && creatorPayload.role === 'doctor' && creatorPayload.id) {
        recordCreateData.doctor = {
            connect: { doctor_id: creatorPayload.id as string },
        };
        recordCreateData.entry_type = "Doctor";
    } else if (typeof creatorPayload === 'object' && creatorPayload.role === 'hospital' && creatorPayload.id) {
        recordCreateData.hospital = {
            connect: { hospital_id: creatorPayload.id as string }
        };
        recordCreateData.entry_type = "Hospital";
    }

    return prisma.$transaction(async (tx) => {
        // Create the main medical record using the dynamically built data
        const newRecord = await tx.patient_medical_records.create({
            data: recordCreateData
        });

        // Conditionally create hospitalization details
        if (record.hospitalizationDetails) {
            await tx.patient_hospitalization_details.create({
                data: {
                    record_id: newRecord.record_id,
                    ...record.hospitalizationDetails
                }
            });
        }

        // Conditionally create surgery details
        if (record.surgeryDetails) {
            await tx.patient_surgery_details.create({
                data: {
                    record_id: newRecord.record_id,
                    ...record.surgeryDetails
                }
            });
        }

        // Conditionally create documents
        if (record.documents && (record.documents.prescription || record.documents.lab_results)) {
            const documentData: Prisma.patient_documentsCreateInput = {
                medical_record: {
                    connect: { record_id: newRecord.record_id }
                }
            };
            if (record.documents.prescription) {
                documentData.prescriptions = record.documents.prescription;
            }
            if (record.documents.lab_results) {
                documentData.lab_results = record.documents.lab_results;
            }
            await tx.patient_documents.create({ data: documentData });
        }

        return { record_id: newRecord.record_id };
    });
}

export const addPatientHospitalizationDetails = async(record_id: string, hospitalizationDetails: HospitalizationRecordDetails)=>{
    if(!hospitalizationDetails || !record_id){
        throw new Error("Hospitalization  details & record_id must be provided.");
    }
    return prisma.$transaction(async (tx) => {
        const existingHospitalization = await tx.patient_hospitalization_details.findFirst({
            where: { record_id },
        });
        if (existingHospitalization) {
            throw new Error("Hospitalization details for this medical record already exist.");
        }
        await tx.patient_medical_records.update({
            where: {record_id},
            data: { updated_at: new Date() }
        });
        const newHospitalizationDetails =await tx.patient_hospitalization_details.create({
            data: {
                record_id: record_id,
                ...hospitalizationDetails
            }
        });
        return newHospitalizationDetails;
    })
}

export const addPatientSurgeryDetails = async(record_id:string, surgeryDetails: SurgeryRecordDetails )=>{
    if(!surgeryDetails || !record_id){
        throw new Error("Surgery details & record_id must be provided.");
    }
    return prisma.$transaction(async (tx) => {
        const existingSurgery = await tx.patient_surgery_details.findFirst({
            where: { record_id },
        });
        if (existingSurgery) {
            throw new Error("Surgery details for this medical record already exist.");
        }
        await tx.patient_medical_records.update({
            where: {record_id},
            data: { updated_at: new Date() }
        });
        const newSurgeryDetails =await tx.patient_surgery_details.create({
            data: {
                record_id: record_id,
                ...surgeryDetails
            }
        });
        return newSurgeryDetails;
    })

}

export const addPatientPrescription = async(record_id: string, prescription_url:string)=>{
    if (!record_id || !prescription_url) {
        throw new Error("Record ID and prescription URL must be provided.");
    }
    const document = await prisma.patient_documents.upsert({
        where: {
            // This field MUST be unique in your schema
            record_id: record_id,
        },
        update: {
            // Data to apply if the document IS found
            prescriptions: prescription_url,
            updated_at: new Date(),
        },
        create: {
            // Data to use if the document IS NOT found
            record_id: record_id,
            prescriptions: prescription_url,
            created_at: new Date(),
        }
    });

    return document;
}

export const removePatientPrescription = async (record_id: string) => {
    // 1. Validate the input
    if (!record_id) {
        throw new Error("Record ID must be provided.");
    }

    // 2. Find the document by its unique record_id and update it
    const updatedDocument = await prisma.patient_documents.update({
        where: {
            record_id: record_id,
        },
        data: {
            // Set the prescriptions field to null to "remove" it
            prescriptions: null,
            // Also update the timestamp to reflect the change
            updated_at: new Date(),
        }
    });

    return updatedDocument;
}

export const addPatientLabResults = async(record_id: string, lab_results_url:string)=>{
    if (!record_id || !lab_results_url) {
        throw new Error("Record ID and lab results URL must be provided.");
    }
    const document = await prisma.patient_documents.upsert({
        where: {
            // This field MUST be unique in your schema
            record_id: record_id,
        },
        update: {
            // Data to apply if the document IS found
            lab_results: lab_results_url,
            updated_at: new Date(),
        },
        create: {
            // Data to use if the document IS NOT found
            record_id: record_id,
            // --- FIX START: Corrected 'prescriptions' to 'lab_results' ---
            lab_results: lab_results_url,
            // --- FIX END ---
            created_at: new Date(),
        }
    });

    return document;
}

export const removePatientLabResults = async (record_id: string) => {
    // 1. Validate the input
    if (!record_id) {
        throw new Error("Record ID must be provided.");
    }

    // 2. Find the document by its unique record_id and update it
    const updatedDocument = await prisma.patient_documents.update({
        where: {
            record_id: record_id,
        },
        data: {
            // Set the prescriptions field to null to "remove" it
           lab_results: null,
            // Also update the timestamp to reflect the change
            updated_at: new Date(),
        }
    });

    return updatedDocument;
}

export const updatePatientRecordVisibility = async(record_id:string, curVisibility: boolean)=>{
         return prisma.patient_medical_records.update({
             where:{
                 record_id:record_id
             },
             data:{
                 visibility : !curVisibility
             },
             select:{
                 record_id:true,
                 visibility : true
             }
         });
}

export const getPatientRecords = async(patientIdentifier: PatientIdentifier, searchOptions: SearchOptions, userRole: string, searchQuery?:string)=>{
    let patientWhereClause: Prisma.patientsWhereUniqueInput = getPatientWhereClause(patientIdentifier.patient_id, patientIdentifier.shc_code, patientIdentifier.qr_code);
    const patient = await prisma.patients.findUnique({
        where: patientWhereClause,
        select: { patient_id: true } // We only need the patient's ID
    });

    if (!patient) {
        // If no patient is found, return an empty array as there are no records
        return [];
    }

    const recordsWhereClause: Prisma.patient_medical_recordsWhereInput = {
        patient_id: patient.patient_id, // Filter records for this specific patient
    };
    if (userRole !== 'patient') {
        recordsWhereClause.visibility = true;
    }
    if (searchOptions.entry_type && searchOptions.entry_type !== "All") {
        recordsWhereClause.entry_type = searchOptions.entry_type;
    }

    if (searchQuery && searchQuery.trim() !== '') {
        recordsWhereClause.OR = [
            { diagnosis_name: { contains: searchQuery, mode: 'insensitive' } },
            { doctor_name:    { contains: searchQuery, mode: 'insensitive' } },
            { hospital_name:  { contains: searchQuery, mode: 'insensitive' } },
        ];
    }

    let orderByClause: Prisma.patient_medical_recordsOrderByWithRelationInput = {};
    switch (searchOptions.sort_by) {
        case "Diagnosis":
            orderByClause = { diagnosis_name: 'asc' };
            break;
        case "Time Asc":
            orderByClause = { created_at: 'asc' };
            break;
        case "Time Desc":
            orderByClause = { created_at: 'desc' };
            break;
        // If "None", the orderByClause remains an empty object, so no sorting is applied.
    }

    const rawRecords = await prisma.patient_medical_records.findMany({
        where: recordsWhereClause,
        orderBy: orderByClause,
        include: {
            _count: {
                select: {
                    patient_documents: true,
                    // Count related hospitalization records
                    patient_hospitalization_details: true,
                    // Count related surgery records
                    patient_surgery_details: true,
                }
            },
            hospital: {
                select: { name: true }
            },
            doctor: {
                select: { full_name: true }
            }
        }
    });

    const formattedRecords = rawRecords.map(record => ({
        record_id: record.record_id,
        doctor_id: record.doctor_id,
        doctor_name: record.doctor_name || record.doctor?.full_name || "Unknown Doctor",
        hospital_id: record.hospital_id,
        hospital_name: record.hospital_name || record.hospital?.name || "Unknown Hospital",
        created_at: record.created_at,
        updated_at: record.updated_at,
        entry_type: record.entry_type,
        diagnosis_name: record.diagnosis_name,
        treatment_undergone: record.treatment_undergone,
        visibility: record.visibility,
        history_of_present_illness: record.history_of_present_illness,

        is_hospitalized: record._count.patient_hospitalization_details > 0,
        is_surgery: record._count.patient_surgery_details > 0,

        document_count: record._count.patient_documents,
        appointment_date: record.appointment_date,
        reg_no: record.reg_no,
    }));
    return formattedRecords;
}

export const getPatientSurgeryDetails = async(record_id: string)=>{
    return await prisma.patient_surgery_details.findFirst({
        where: {
            record_id: record_id,
        }
    });
}

export const getPatientHospitalizationDetails = async(record_id: string)=>{
    return await prisma.patient_hospitalization_details.findFirst({
        where: {
            record_id: record_id,
        }
    });
}

export const getPatientDocuments = async(record_id: string)=>{
    return await prisma.patient_documents.findFirst({
        where: {
            record_id: record_id,
        }
    });
}