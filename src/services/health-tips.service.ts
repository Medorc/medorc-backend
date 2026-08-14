import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

export const getRandom = async () => {
    const tipCount = await prisma.health_tips.count();

    const fallbackTips = [
        { category: "Hydration", tip_text: "Drink at least 2.5–3 liters of water daily to maintain optimal bodily functions and energy." },
        { category: "Activity", tip_text: "Aim for 30 minutes of moderate activity, like brisk walking, every day." },
        { category: "Sleep", tip_text: "Maintain a consistent sleep routine with 7–8 hours of rest each night for cellular recovery." },
        { category: "Nutrition", tip_text: "Incorporate fiber-rich foods like whole grains, nuts, and berries into your daily diet." },
        { category: "Mental Health", tip_text: "Take 5-minute mindfulness pauses during work to reduce cortisol and mental fatigue." },
        { category: "Eye Care", tip_text: "Follow the 20-20-20 rule: Every 20 minutes, look at an object 20 feet away for 20 seconds." },
        { category: "Posture", tip_text: "Ensure your computer monitor is at eye level to reduce strain on your neck and spine." },
        { category: "Immunity", tip_text: "Eat foods rich in Vitamin C and Zinc, such as citrus fruits, spinach, and seeds." },
        { category: "Heart Health", tip_text: "Limit processed sodium and opt for heart-healthy fats like olive oil and avocados." },
        { category: "Skin Care", tip_text: "Apply broad-spectrum sunscreen daily to protect your skin against UV radiation." },
        { category: "Medication Adherence", tip_text: "Set daily alarms or use a pill organizer to ensure you never miss prescribed medications." },
        { category: "Preventive Care", tip_text: "Schedule annual health checkups and blood screenings for early disease detection." },
        { category: "Hygiene", tip_text: "Wash your hands thoroughly with soap for 20 seconds before meals and after outdoor visits." },
        { category: "Stress Management", tip_text: "Engage in hobbies or spend time in nature to naturally relieve stress and elevate mood." },
        { category: "Oral Health", tip_text: "Brush twice daily and floss once daily to prevent gum disease and maintain systemic health." }
    ];

    if (tipCount === 0) {
        return fallbackTips[Math.floor(Math.random() * fallbackTips.length)];
    }

    const randomIndex = Math.floor(Math.random() * tipCount);
    const health_tip = await prisma.health_tips.findFirst({ skip: randomIndex });
    return health_tip || fallbackTips[Math.floor(Math.random() * fallbackTips.length)];
};
