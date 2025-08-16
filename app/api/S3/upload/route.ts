import { s3 } from "@/lib/S3Client";
import { getSignedUrl } from "@aws-sdk/s3-request-presigner";
import { PutObjectCommand } from "@aws-sdk/client-s3";
import { NextResponse } from "next/server";
import { boolean, uuidv4, z } from "zod";

const fileUploadSchema = z.object({
  fileName: z.string().min(1, { message: "File Name is required" }),
  contentType: z.string().min(1, { message: "Content type is required" }),
  size: z.number(),
  isImage: boolean(),
});

export const POST = async (request: Request) => {
  try {
    const body = await request.json();
    const validation = fileUploadSchema.safeParse(body);
    if (!validation.success) {
      return NextResponse.json(
        { error: "Invalid request body" },
        { status: 400 }
      );
    }
    const { fileName, contentType, size } = validation.data;
    const command = new PutObjectCommand({
      Bucket: process.env.AWS_BUCKET_NAME,
      Key: `${uuidv4()}-${fileName}`,
      ContentType: contentType,
      ContentLength: size,
    });
    const presignedUrl = await getSignedUrl(s3, command, { expiresIn: 360 });
    return NextResponse.json({ presignedUrl, Key: `${uuidv4()}-${fileName}` });
  } catch (err) {
    console.log(err);
    return NextResponse.json(
      { error: "Something went wrong" },
      { status: 500 }
    );
  }
};
