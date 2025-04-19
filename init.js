import {v4 as uuidv4 } from "uuid";
import { betterAuth } from "better-auth";
import { prismaAdapter } from "better-auth/adapters/prisma";
import { PrismaClient } from "@prisma/client";
import { username } from "better-auth/plugins";

const prisma = new PrismaClient();
const auth = betterAuth({
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


const isManager=true

const uuid = uuidv4();

// Better auth will not allow signup without a "valid" email
const email = uuid+"@"+uuid+".null"

auth.api.signUpEmail({
body: {
    name:"administrator",
    email:email,
    username: "administrator",
    password: "administrator",
    isManager: isManager
}
})