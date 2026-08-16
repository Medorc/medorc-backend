declare const models: {
    patient: import("@prisma/client").Prisma.patientsDelegate<import("@prisma/client/runtime/library").DefaultArgs, import("@prisma/client").Prisma.PrismaClientOptions>;
    doctor: import("@prisma/client").Prisma.doctorsDelegate<import("@prisma/client/runtime/library").DefaultArgs, import("@prisma/client").Prisma.PrismaClientOptions>;
    hospital: import("@prisma/client").Prisma.hospitalsDelegate<import("@prisma/client/runtime/library").DefaultArgs, import("@prisma/client").Prisma.PrismaClientOptions>;
    extern: import("@prisma/client").Prisma.external_viewersDelegate<import("@prisma/client/runtime/library").DefaultArgs, import("@prisma/client").Prisma.PrismaClientOptions>;
};
export type Role = keyof typeof models;
export declare const login: (emailInput: string, password: string, role: Role) => Promise<{
    token: string;
    shc_code: string | undefined;
}>;
export declare const googleAuthLogin: (credentialToken: string, roleInput?: Role) => Promise<{
    token: string;
    role: "patient" | "doctor" | "hospital" | "extern";
    shc_code: string | undefined;
    user: any;
}>;
export declare const requestPasswordReset: (emailInput: string, role: Role) => Promise<{
    message: string;
    emailSent: boolean;
}>;
export declare const resetPassword: (emailInput: string, role: Role, otp: string, newPassword: string) => Promise<{
    message: string;
}>;
export declare const checkEmailExists: (emailInput: string, roleInput?: string) => Promise<{
    exists: boolean;
    email?: never;
} | {
    exists: boolean;
    email: string;
}>;
export {};
//# sourceMappingURL=auth.services.d.ts.map