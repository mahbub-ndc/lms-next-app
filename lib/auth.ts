import { betterAuth } from "better-auth";
import { emailOTP } from "better-auth/plugins";
import { Resend } from "resend";
import { prismaAdapter } from "better-auth/adapters/prisma";
import { prisma } from "./db";
import { env } from "./env";
const resend = new Resend(env.RESEND_API_KEY);
import { admin } from "better-auth/plugins";

export const auth = betterAuth({
  database: prismaAdapter(prisma, {
    provider: "postgresql", // or "mysql", "postgresql", ...etc
  }),

  socialProviders: {
    github: {
      clientId: env.GITHUB_CLIENT_ID,
      clientSecret: env.GITHUB_CLIENT_SECRET,
    },
  },
  plugins: [
    emailOTP({
      async sendVerificationOTP({ email, otp }) {
        const { data, error } = await resend.emails.send({
          from: "LMS NEXT APP <onboarding@resend.dev>",
          to: [email],
          subject: "Verify your email",
          text: `Your verification code is: ${otp}`,
        });
      },
      otpLength: 6, // Length of the OTP
      expiresIn: 600, // OTP expiration time
    }),
    admin(),
  ],
});
