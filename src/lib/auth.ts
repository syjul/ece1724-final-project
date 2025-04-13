import { betterAuth } from "better-auth";
import { prismaAdapter } from "better-auth/adapters/prisma";
import { PrismaClient } from "@prisma/client";
import { username } from "better-auth/plugins";

const prisma = new PrismaClient();
export const auth = betterAuth({
  database: prismaAdapter(prisma, {
    provider: "postgresql",
  }),
  plugins: [
    username()
  ],
  user: {
    additionalFields: {
      isManager: {
        type: "boolean",
        required: true,
        defaultValue: false
      }
    }
  }, 
  emailAndPassword: {    
    enabled: true,
    requireEmailVerification: false
  } 
});
