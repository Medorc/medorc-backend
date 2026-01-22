import { PrismaClient } from "@prisma/client";

export const getRandom = async () => {
    const prisma = new PrismaClient();
    const tipCount = await prisma.health_tips.count();

    if (tipCount === 0) {
        const fallbackTips = [
            { category: "Hydration", tip_text: "Drink at least 3 liters of water today to verify hydration levels." },
            { category: "Activity", tip_text: "Take a 15-minute walk after meals to improve digestion." },
            { category: "Sleep", tip_text: "Avoid screens 1 hour before bed for better sleep quality." },
            { category: "Nutrition", tip_text: "Include protein in your breakfast to improved satiety throughout the day." },
            { category: "Mental Health", tip_text: "Practice deep breathing for 5 minutes when feeling stressed." },
            { category: "Eye Care", tip_text: "Follow the 20-20-20 rule: Every 20 mins, look at something 20 feet away for 20 secs." },
            { category: "Posture", tip_text: "Sit up straight! Good posture prevents back pain and boosts confidence." },
            { category: "Immunity", tip_text: "Eat more citrus fruits to boost your Vitamin C intake." },
            { category: "Focus", tip_text: "Take short breaks every hour to maintain high productivity." },
            { category: "Heart Health", tip_text: "Reduce salt intake to maintain healthy blood pressure levels." },
            { category: "Skin Care", tip_text: "Wear sunscreen daily, even when indoors, to protect against UV rays." },
            { category: "Wellness", tip_text: "Laugh more! It lowers stress hormones and strengthens your immune system." },
            { category: "Diet", tip_text: "Eat a rainbow of vegetables to get a wide range of nutrients." },
            { category: "Hygiene", tip_text: "Wash your hands frequently to prevent the spread of infections." },
            { category: "Mindfulness", tip_text: "Spend 5 minutes meditating today to clear your mind." }
        ];
        return fallbackTips[Math.floor(Math.random() * fallbackTips.length)];
    }

    const randomIndex = Math.floor(Math.random() * tipCount);
    const health_tip = await prisma.health_tips.findFirst({ skip: randomIndex, });
    return health_tip;
}
