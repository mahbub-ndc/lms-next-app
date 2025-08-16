import { NextResponse } from "next/server";
import arcjet, {
  shield,
  detectBot,
  fixedWindow,
  tokenBucket,
  protectSignup,
  sensitiveInfo,
} from "@arcjet/next";

export {
  detectBot,
  shield,
  tokenBucket,
  fixedWindow,
  protectSignup,
  sensitiveInfo,
};

export default arcjet({
  key: process.env.ARCJET_KEY as string,
  characteristics: ["fingerprint"],
  rules: [
    shield({
      mode: "LIVE",
    }),
  ],
});
