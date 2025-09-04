import bcrypt from "bcrypt";
import {PrismaClient} from "@prisma/client"
import jwt from "jsonwebtoken";

const prisma = new PrismaClient();
const models = {
    patient: prisma.patients,
    doctor: prisma.doctors,
    hospital: prisma.hospitals,
    extern: prisma.external_viewers
}
export type Role = keyof typeof models;
type UserModel = typeof prisma.patients | typeof prisma.doctors | typeof prisma.hospitals | typeof prisma.external_viewers;

export const login = async (email:string, password: string, role: Role)=>{
      const model: UserModel = models[role];
      if(!model){
          throw new Error('Invalid role specified.');
      }
      const user = await (model as any).findUnique({where:{email}});
      if(!user){
          throw new Error('Invalid user specified.');
      }

    const isPasswordValid = await bcrypt.compare(password, user.password);
    if (!isPasswordValid) {
        throw new Error('Invalid credentials.');
    }
    const token = jwt.sign(
        {
            id: user.patient_id, // default : user.patient_id, doctor_id: "b316f076-851f-4a3b-8b62-c233a0037f7a"
            role: "doctor", // default : role
        },
        process.env.JWT_SECRET!, // The '!' tells TypeScript we know this value exists
        { expiresIn: '24h' }
    );

    return { token };
}