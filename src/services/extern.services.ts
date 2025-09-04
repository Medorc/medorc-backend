import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import type { JwtPayload } from 'jsonwebtoken';
import {PrismaClient} from "@prisma/client";
import {Prisma} from "@prisma/client";
import type {ExternDetails, OrganizationDetails} from "../types/application.js";

const prisma = new PrismaClient();

export const createExtern = async (extern:ExternDetails)=>{
    if(!extern || !extern.password){
        throw new Error("patient details were not received properly");
    }
    const { password, organization_details,...restOfDetails } = extern;
    const saltRounds =10;
    const password_hash = await bcrypt.hash(password, saltRounds);
    const newUser = await prisma.external_viewers.create({
        data: {
            ...restOfDetails,           // Spread the other details
            org_type:organization_details.type,
            org_name:organization_details.name,
            org_description:organization_details.description,
            org_founded_on:organization_details.founded_on,
            org_license_no: organization_details.license_no,
            org_license_valid_till: organization_details.license_valid_till,
            org_address: organization_details.address,
            org_website: organization_details.website,
            password: password_hash, // Use the correct field name for the hash
        },
    });
    const token = jwt.sign(
        {
            id: newUser.viewer_id,
            role: "extern",
        },
        process.env.JWT_SECRET!,
        { expiresIn: '24h' }
    );
    const { password: _, ...userWithoutPassword } = newUser;
    return { token, user: userWithoutPassword };
}