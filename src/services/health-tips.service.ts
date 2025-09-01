import {PrismaClient} from "@prisma/client";

export const getRandom = async ()=> {
    const prisma = new PrismaClient();
    const tipCount = await prisma.health_tips.count();
    const randomIndex = Math.floor(Math.random() * tipCount);
    const health_tip = prisma.health_tips.findFirst({skip:randomIndex,});
    return health_tip;
}
