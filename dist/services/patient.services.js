import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import { PrismaClient } from "@prisma/client";
import { Prisma } from "@prisma/client";
const prisma = new PrismaClient();
const getPatientWhereClause = (patient_id, shc_code, qr_code) => {
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
export const createPatient = async (patient) => {
    if (!patient || !patient.password) {
        throw new Error("patient details were not received properly");
    }
    const { password, ...restOfDetails } = patient;
    const saltRounds = 10;
    const password_hash = await bcrypt.hash(password, saltRounds);
    const dob = restOfDetails.date_of_birth ? new Date(restOfDetails.date_of_birth) : null;
    const validDob = dob && !isNaN(dob.getTime()) ? dob : null;
    const newUser = await prisma.patients.create({
        data: {
            ...restOfDetails, // Spread the other details
            date_of_birth: validDob,
            password: password_hash, // Use the correct field name for the hash
            data_logs: `${new Date().toISOString()} - PATIENT [pending] Account Created`
        },
    });
    // Update data_logs with real patient_id
    const initialLog = `${new Date().toISOString()} - PATIENT [${newUser.patient_id}] Account Created`;
    await prisma.patients.update({
        where: { patient_id: newUser.patient_id },
        data: { data_logs: initialLog }
    });
    const token = jwt.sign({
        id: newUser.patient_id,
        role: "patient",
    }, process.env.JWT_SECRET, { expiresIn: '24h' });
    const { password: _, ...userWithoutPassword } = newUser;
    return { token, user: userWithoutPassword };
};
export const getPatientProfile = async (patient_id, shc_code, qr_code) => {
    let whereClause = getPatientWhereClause(patient_id, shc_code, qr_code);
    const patientProfile = await prisma.patients.findUnique({
        where: whereClause,
        select: {
            full_name: true,
            email: true,
            date_of_birth: true,
            gender: true,
            blood_group: true,
            phone_no: true,
            visibility: true,
            shc_code: true,
            qr_code: true,
            photo: true,
        }
    });
    if (!patientProfile) {
        console.log("User not found");
        throw new Error("User not found");
    }
    return { ...patientProfile, role: "patient" };
};
export const getPatientPersonalDetails = async (patient_id, shc_code, qr_code) => {
    let whereClause = getPatientWhereClause(patient_id, shc_code, qr_code);
    const patientPersonalDetails = await prisma.patients.findUnique({
        where: whereClause,
        select: {
            full_name: true,
            photo: true,
            date_of_birth: true,
            gender: true,
            blood_group: true,
            address: true,
            smoking: true,
            alcoholism: true,
            tobacco: true,
            pregnancy: true,
            exercise: true,
            others: true,
            allergy: true
        }
    });
    if (!patientPersonalDetails) {
        console.log("User not found");
        throw new Error("User not found");
    }
    return patientPersonalDetails;
};
export const getPatientBasicDetails = async (patient_id, shc_code, qr_code) => {
    let whereClause = getPatientWhereClause(patient_id, shc_code, qr_code);
    const patientBasicDetails = await prisma.patients.findUnique({
        where: whereClause,
        // Select only the fields you want to return
        select: {
            full_name: true,
            email: true,
            phone_no: true,
            photo: true,
            gender: true,
            blood_group: true,
            date_of_birth: true,
            address: true,
            visibility: true,
            shc_code: true,
            qr_code: true,
            allergy: true,
            smoking: true,
            alcoholism: true,
            exercise: true
        }
    });
    if (!patientBasicDetails) {
        console.log("User not found");
        throw new Error("User not found");
    }
    return patientBasicDetails;
};
export const getPatientEmergencyContacts = async (patientIdentifier) => {
    let whereClause = getPatientWhereClause(patientIdentifier.patient_id, patientIdentifier.shc_code, patientIdentifier.qr_code);
    const patientEmergencyContacts = await prisma.patients.findUnique({
        where: whereClause,
        // Select only the fields you want to return
        select: {
            patient_emergency_contacts: true
        }
    });
    if (!patientEmergencyContacts) {
        console.log("User not found");
        throw new Error("User not found");
    }
    return patientEmergencyContacts;
};
export const getPatientDataLogs = async (patientIdentifier) => {
    let whereClause = getPatientWhereClause(patientIdentifier.patient_id, patientIdentifier.shc_code, patientIdentifier.qr_code);
    const patientDataLogs = await prisma.patients.findUnique({
        where: whereClause,
        // Select only the fields you want to return
        select: {
            data_logs: true
        }
    });
    if (!patientDataLogs) {
        console.log("User not found");
        throw new Error("User not found");
    }
    return patientDataLogs;
};
export const updatePatientVisibility = async (curVisibility, patient_id) => {
    let whereClause;
    // 2. Conditionally build the where clause based on provided arguments
    if (patient_id) {
        whereClause = { patient_id: patient_id };
    }
    else {
        // 3. If no identifier is provided, throw an error
        throw new Error("An identifier (patient_id) must be provided.");
    }
    const updatedVisibility = await prisma.patients.update({
        where: whereClause,
        // Select only the fields you want to return
        data: {
            visibility: !curVisibility,
        },
        select: {
            visibility: true
        }
    });
    if (!updatedVisibility) {
        console.log("User not found");
        throw new Error("User not found");
    }
    return updatedVisibility;
};
export const updatePatientPhoto = async (newPhoto, patient_id) => {
    let whereClause;
    // 2. Conditionally build the where clause based on provided arguments
    if (patient_id) {
        whereClause = { patient_id: patient_id };
    }
    else {
        // 3. If no identifier is provided, throw an error
        throw new Error("An identifier (patient_id) must be provided.");
    }
    const updatedPhoto = await prisma.patients.update({
        where: whereClause,
        // Select only the fields you want to return
        data: {
            photo: newPhoto,
        },
        select: {
            photo: true
        }
    });
    if (!updatedPhoto) {
        console.log("User not found");
        throw new Error("User not found");
    }
    return updatedPhoto;
};
export const updatePatientLifestyle = async (newLifestyle, patient_id) => {
    let whereClause;
    // 2. Conditionally build the where clause based on provided arguments
    if (patient_id) {
        whereClause = { patient_id: patient_id };
    }
    else {
        // 3. If no identifier is provided, throw an error
        throw new Error("An identifier (patient_id) must be provided.");
    }
    if (newLifestyle) {
        const updatedLifestyle = await prisma.patients.update({
            where: whereClause,
            // Select only the fields you want to return
            data: {
                smoking: newLifestyle.smoking,
                alcoholism: newLifestyle.alcoholism,
                exercise: newLifestyle.exercise,
                pregnancy: newLifestyle.pregnancy,
                others: newLifestyle.others,
                allergy: newLifestyle.allergy,
                tobacco: newLifestyle.tobacco,
            },
            select: {
                smoking: true,
                alcoholism: true,
                tobacco: true,
                exercise: true,
                pregnancy: true,
                others: true,
                allergy: true,
            }
        });
        if (!updatedLifestyle) {
            console.log("User not found");
            throw new Error("User not found");
        }
        return updatedLifestyle;
    }
    else {
        throw new Error("Lifestyle must be provided.");
    }
};
export const updatePatientPersonalDetails = async (newPersonalDetails, patient_id) => {
    if (!patient_id) {
        throw new Error("An identifier (patient_id) must be provided.");
    }
    const updateData = {};
    if (newPersonalDetails.full_name !== undefined)
        updateData.full_name = newPersonalDetails.full_name;
    if (newPersonalDetails.gender !== undefined)
        updateData.gender = newPersonalDetails.gender;
    if (newPersonalDetails.blood_group !== undefined)
        updateData.blood_group = newPersonalDetails.blood_group;
    if (newPersonalDetails.date_of_birth !== undefined)
        updateData.date_of_birth = new Date(newPersonalDetails.date_of_birth);
    if (newPersonalDetails.address !== undefined)
        updateData.address = newPersonalDetails.address;
    if (newPersonalDetails.photo !== undefined)
        updateData.photo = newPersonalDetails.photo;
    const updatedPersonal = await prisma.patients.update({
        where: { patient_id },
        data: updateData,
        select: {
            full_name: true,
            gender: true,
            blood_group: true,
            date_of_birth: true,
            address: true,
            photo: true
        }
    });
    if (!updatedPersonal) {
        throw new Error("User not found");
    }
    return updatedPersonal;
};
export const updatePatientEmail = async (newEmail, patient_id) => {
    let whereClause;
    // 2. Conditionally build the where clause based on provided arguments
    if (patient_id) {
        whereClause = { patient_id: patient_id };
    }
    else {
        // 3. If no identifier is provided, throw an error
        throw new Error("An identifier (patient_id) must be provided.");
    }
    if (newEmail) {
        const updatedEmail = await prisma.patients.update({
            where: whereClause,
            data: {
                email: newEmail,
            },
            select: {
                email: true
            }
        });
        if (!updatedEmail) {
            console.log("User not found");
            throw new Error("User not found");
        }
        return updatedEmail;
    }
    else {
        throw new Error("Email id must be provided.");
    }
};
export const updatePatientPhoneNo = async (newPhoneNo, patient_id) => {
    let whereClause;
    // 2. Conditionally build the where clause based on provided arguments
    if (patient_id) {
        whereClause = { patient_id: patient_id };
    }
    else {
        // 3. If no identifier is provided, throw an error
        throw new Error("An identifier (patient_id) must be provided.");
    }
    if (newPhoneNo) {
        const updatedPhoneNo = await prisma.patients.update({
            where: whereClause,
            data: {
                phone_no: newPhoneNo,
            },
            select: {
                phone_no: true
            }
        });
        if (!updatedPhoneNo) {
            console.log("User not found");
            throw new Error("User not found");
        }
        return updatedPhoneNo;
    }
    else {
        throw new Error("Phone No must be provided.");
    }
};
export const updatePatientPassword = async (newPassword, patient_id) => {
    if (!patient_id) {
        throw new Error("An identifier (patient_id) must be provided.");
    }
    if (newPassword) {
        const saltRounds = 10;
        const password_hash = await bcrypt.hash(newPassword, saltRounds);
        const updatedPassword = await prisma.patients.update({
            where: { patient_id },
            data: {
                password: password_hash,
            },
            select: {
                full_name: true
            }
        });
        if (!updatedPassword) {
            console.log("User not found");
            throw new Error("User not found");
        }
        return true;
    }
    else {
        throw new Error("Password must be provided.");
    }
};
export const addPatientEmergencyContact = async (emergencyContact, patient_id) => {
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
        select: {
            full_name: true,
            phone_no: true,
            relation: true
        }
    });
    if (!newEmergencyContact) {
        throw new Error("Unable to add Emergency contact.");
    }
    return newEmergencyContact;
};
export const deletePatientEmergencyContact = async (patient_id, emg_id) => {
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
};
export const getVisitorDisplayName = async (id, role) => {
    try {
        if (role === "doctor") {
            const doc = await prisma.doctors.findUnique({ where: { doctor_id: id }, select: { full_name: true } });
            if (doc?.full_name)
                return doc.full_name;
        }
        else if (role === "hospital") {
            const hosp = await prisma.hospitals.findUnique({ where: { hospital_id: id }, select: { name: true } });
            if (hosp?.name)
                return hosp.name;
        }
        else if (role === "extern") {
            const ext = await prisma.external_viewers.findUnique({ where: { viewer_id: id }, select: { full_name: true, org_name: true } });
            if (ext?.full_name || ext?.org_name)
                return ext.full_name || ext.org_name || id;
        }
        else if (role === "patient") {
            const pt = await prisma.patients.findUnique({ where: { patient_id: id }, select: { full_name: true } });
            if (pt?.full_name)
                return pt.full_name;
        }
    }
    catch {
        /* fallback to id */
    }
    return id;
};
export const addPatientDataLog = async (patientIdentifier, newLogEntry) => {
    // Find the patient and retrieve their existing logs
    let whereClause = getPatientWhereClause(patientIdentifier.patient_id, patientIdentifier.shc_code, patientIdentifier.qr_code);
    const patient = await prisma.patients.findUnique({
        where: whereClause,
        select: { data_logs: true },
    });
    if (!patient) {
        throw new Error("Patient not found for logging.");
    }
    const existingLogs = patient.data_logs ? patient.data_logs.split(/[\n,]+/).map(log => log.trim()).filter(Boolean) : [];
    existingLogs.unshift(newLogEntry);
    const updatedLogs = existingLogs.slice(0, 50);
    await prisma.patients.update({
        where: whereClause,
        data: {
            data_logs: updatedLogs.join('\n'),
        },
    });
};
export const createPatientRecord = async (patientIdentifier, record, creatorPayload) => {
    if (!record || !record.basicDetails) {
        throw new Error("Basic record must be provided.");
    }
    let whereClause = getPatientWhereClause(patientIdentifier.patient_id, patientIdentifier.shc_code, patientIdentifier.qr_code);
    const patient = await prisma.patients.findUnique({
        where: whereClause,
        select: { patient_id: true }
    });
    if (!patient) {
        throw new Error("Patient not found.");
    }
    const b = record.basicDetails;
    // Map basicDetails to valid Prisma patient_medical_records fields
    let appointmentDate = null;
    if (b.appointment_date) {
        const parsedDate = new Date(b.appointment_date);
        if (!isNaN(parsedDate.getTime())) {
            appointmentDate = parsedDate;
        }
    }
    // Combine symptoms/treatment notes cleanly if specific fields are passed
    const historyOfPresentIllness = b.history_of_present_illness || b.symptoms || b.doctor_notes || null;
    const treatmentUndergone = b.treatment_undergone || b.treatment_summary || b.prescribed_medications || b.follow_up_advice || null;
    const recordCreateData = {
        patient: { connect: { patient_id: patient.patient_id } },
        created_at: new Date(),
        entry_type: b.entry_type || "Self",
        diagnosis_name: b.diagnosis_name || null,
        history_of_present_illness: historyOfPresentIllness,
        treatment_undergone: treatmentUndergone,
        doctor_name: b.doctor_name || null,
        hospital_name: b.hospital_name || null,
        appointment_date: appointmentDate,
        reg_no: b.reg_no || null,
        alternative_system_of_medicine: b.alternative_system_of_medicine || null,
        visibility: b.visibility !== undefined ? Boolean(b.visibility) : true
    };
    if (typeof creatorPayload === 'object' && creatorPayload.role === 'doctor' && creatorPayload.id) {
        recordCreateData.doctor = {
            connect: { doctor_id: creatorPayload.id },
        };
        recordCreateData.entry_type = "Doctor";
    }
    else if (typeof creatorPayload === 'object' && creatorPayload.role === 'hospital' && creatorPayload.id) {
        recordCreateData.hospital = {
            connect: { hospital_id: creatorPayload.id }
        };
        recordCreateData.entry_type = "Hospital";
    }
    return prisma.$transaction(async (tx) => {
        // Create the main medical record using the sanitized data
        const newRecord = await tx.patient_medical_records.create({
            data: recordCreateData
        });
        // Conditionally create hospitalization details with valid fields
        if (record.hospitalizationDetails) {
            const h = record.hospitalizationDetails;
            const duration = h.duration || (h.admission_date && h.discharge_date ? `${h.admission_date} to ${h.discharge_date}` : null);
            const reason = h.reason || h.discharge_summary || null;
            const room_no = h.room_no || h.room_type || null;
            const treatment_undergone = h.treatment_undergone || null;
            if (duration || reason || room_no || treatment_undergone) {
                await tx.patient_hospitalization_details.create({
                    data: {
                        record_id: newRecord.record_id,
                        duration,
                        reason,
                        room_no,
                        treatment_undergone
                    }
                });
            }
        }
        // Conditionally create surgery details with valid fields
        if (record.surgeryDetails) {
            const s = record.surgeryDetails;
            const type = s.type || s.surgery_name || null;
            const duration = s.duration || null;
            const outcome = s.outcome || s.complications || null;
            const medical_condition = s.medical_condition || s.implant_details || null;
            const bed_no = s.bed_no || s.surgeon_name || null;
            if (type || duration || outcome || medical_condition || bed_no) {
                await tx.patient_surgery_details.create({
                    data: {
                        record_id: newRecord.record_id,
                        type,
                        duration,
                        outcome,
                        medical_condition,
                        bed_no
                    }
                });
            }
        }
        // Conditionally create documents
        if (record.documents) {
            const docs = record.documents;
            const prescriptions = docs.prescriptions || docs.prescription || null;
            const lab_results = docs.lab_results || null;
            if (prescriptions || lab_results) {
                const documentData = {
                    medical_record: {
                        connect: { record_id: newRecord.record_id }
                    },
                    prescriptions,
                    lab_results
                };
                await tx.patient_documents.create({ data: documentData });
            }
        }
        return { record_id: newRecord.record_id };
    });
};
export const addPatientHospitalizationDetails = async (record_id, hospitalizationDetails) => {
    if (!hospitalizationDetails || !record_id) {
        throw new Error("Hospitalization details & record_id must be provided.");
    }
    const h = hospitalizationDetails;
    const duration = h.duration || (h.admission_date && h.discharge_date ? `${h.admission_date} to ${h.discharge_date}` : null);
    const reason = h.reason || h.discharge_summary || null;
    const room_no = h.room_no || h.room_type || null;
    const treatment_undergone = h.treatment_undergone || null;
    return prisma.$transaction(async (tx) => {
        const existingHospitalization = await tx.patient_hospitalization_details.findFirst({
            where: { record_id },
        });
        if (existingHospitalization) {
            throw new Error("Hospitalization details for this medical record already exist.");
        }
        await tx.patient_medical_records.update({
            where: { record_id },
            data: { updated_at: new Date() }
        });
        const newHospitalizationDetails = await tx.patient_hospitalization_details.create({
            data: {
                record_id: record_id,
                duration,
                reason,
                room_no,
                treatment_undergone
            }
        });
        return newHospitalizationDetails;
    });
};
export const addPatientSurgeryDetails = async (record_id, surgeryDetails) => {
    if (!surgeryDetails || !record_id) {
        throw new Error("Surgery details & record_id must be provided.");
    }
    const s = surgeryDetails;
    const type = s.type || s.surgery_name || null;
    const duration = s.duration || null;
    const outcome = s.outcome || s.complications || null;
    const medical_condition = s.medical_condition || s.implant_details || null;
    const bed_no = s.bed_no || s.surgeon_name || null;
    return prisma.$transaction(async (tx) => {
        const existingSurgery = await tx.patient_surgery_details.findFirst({
            where: { record_id },
        });
        if (existingSurgery) {
            throw new Error("Surgery details for this medical record already exist.");
        }
        await tx.patient_medical_records.update({
            where: { record_id },
            data: { updated_at: new Date() }
        });
        const newSurgeryDetails = await tx.patient_surgery_details.create({
            data: {
                record_id: record_id,
                type,
                duration,
                outcome,
                medical_condition,
                bed_no
            }
        });
        return newSurgeryDetails;
    });
};
export const addPatientPrescription = async (record_id, prescription_url) => {
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
};
export const removePatientPrescription = async (record_id) => {
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
};
export const addPatientLabResults = async (record_id, lab_results_url) => {
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
};
export const removePatientLabResults = async (record_id) => {
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
};
export const updatePatientRecordVisibility = async (record_id, curVisibility) => {
    return prisma.patient_medical_records.update({
        where: {
            record_id: record_id
        },
        data: {
            visibility: !curVisibility
        },
        select: {
            record_id: true,
            visibility: true
        }
    });
};
export const getPatientRecords = async (patientIdentifier, searchOptions, userRole, searchQuery) => {
    let patientWhereClause = getPatientWhereClause(patientIdentifier.patient_id, patientIdentifier.shc_code, patientIdentifier.qr_code);
    const patient = await prisma.patients.findUnique({
        where: patientWhereClause,
        select: { patient_id: true }
    });
    if (!patient) {
        return [];
    }
    const recordsWhereClause = {
        patient_id: patient.patient_id,
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
            { doctor_name: { contains: searchQuery, mode: 'insensitive' } },
            { hospital_name: { contains: searchQuery, mode: 'insensitive' } },
        ];
    }
    let orderByClause = {};
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
    }
    const rawRecords = await prisma.patient_medical_records.findMany({
        where: recordsWhereClause,
        orderBy: orderByClause,
        include: {
            patient_documents: true,
            _count: {
                select: {
                    patient_documents: true,
                    patient_hospitalization_details: true,
                    patient_surgery_details: true,
                }
            },
            hospital: {
                select: {
                    name: true,
                    email: true,
                    phone_no: true,
                    address: true,
                    website: true,
                    photo: true // Fetch Photo
                }
            },
            doctor: {
                select: {
                    full_name: true,
                    email: true,
                    phone_no: true,
                    specializations: true,
                    photo: true // Fetch Photo
                }
            },
            patient: {
                select: {
                    full_name: true,
                    email: true,
                    phone_no: true,
                    photo: true // Fetch Photo for Self entries
                }
            },
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
        document_count: (record.patient_documents?.[0]?.prescriptions ? 1 : 0) +
            (record.patient_documents?.[0]?.lab_results ? 1 : 0),
        appointment_date: record.appointment_date,
        reg_no: record.reg_no,
        // Pass the full objects so the frontend can access photo/email/etc.
        doctor: record.doctor,
        hospital: record.hospital,
        patient: record.patient
    }));
    return formattedRecords;
};
export const getPatientSurgeryDetails = async (record_id) => {
    return await prisma.patient_surgery_details.findFirst({
        where: {
            record_id: record_id,
        }
    });
};
export const getPatientHospitalizationDetails = async (record_id) => {
    return await prisma.patient_hospitalization_details.findFirst({
        where: {
            record_id: record_id,
        }
    });
};
export const getPatientDocuments = async (record_id) => {
    return await prisma.patient_documents.findFirst({
        where: {
            record_id: record_id,
        }
    });
};
//# sourceMappingURL=patient.services.js.map