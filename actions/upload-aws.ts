// @ts-nocheck
"use server";
import { CachedUrl } from "@/app/(course)/courses/[slug]/_components/Attachement";
import { db } from "@/lib/db";
import { getServerUserSession } from "@/lib/getServerUserSession";
import {
  S3Client,
  PutObjectCommand,
  DeleteObjectCommand,
  GetObjectCommand,
} from "@aws-sdk/client-s3";
import { getSignedUrl } from "@aws-sdk/s3-request-presigner";
// Configure AWS S3 client
const s3Client = new S3Client({
  region: process.env.AWS_REGION,
  credentials: {
    accessKeyId: process.env.AWS_ACCESS_KEY_ID,
    secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
  },
});

// Helper function to upload any file to S3 (Public Bucket)
async function uploadToAwsS3(file, userId, uniqueFilename) {
  const MAX_FILE_SIZE_BYTES =
    Number(process.env.MAX_FILE_SIZE_MB) * 1024 * 1024;
  if (file.size > MAX_FILE_SIZE_BYTES) {
    throw new Error(`File size exceeds ${process.env.MAX_FILE_SIZE_MB} MB`);
  }

  const fileBuffer = await file.arrayBuffer();

  const uploadParams = {
    Bucket: process.env.AWS_BUCKET_NAME,
    Key: uniqueFilename,
    Body: Buffer.from(fileBuffer),
    ContentType: file.type,
  };

  const res = await s3Client.send(new PutObjectCommand(uploadParams));
  console.log(res);

  // The URL for the uploaded file is directly accessible without presigned URL.
  const fileUrl = `https://${process.env.AWS_BUCKET_NAME}.s3.${process.env.AWS_REGION}.amazonaws.com/${uniqueFilename}`;
  console.log({ fileUrl });

  return { uniqueFilename, fileUrl };
}

// Function to delete the previous image from S3
export async function deleteImageFromS3(imageKey) {
  try {
    await s3Client.send(
      new DeleteObjectCommand({
        Bucket: process.env.AWS_BUCKET_NAME,
        Key: imageKey,
      })
    );
    console.log("File deleted successfully");

    return true;
  } catch (error) {
    console.error("Error deleting file from S3:", error);
    return false;
  }
}

// Upload the user's avatar image to S3
export async function uploadUserAvatarToS3(formData, userAvatarId) {
  const { userId } = await getServerUserSession();

  try {
    const file = formData.get("avatarSrc");
    const previousUrl = formData.get("previousUrl");

    if (!file) {
      throw new Error("No file provided");
    }

    if (previousUrl) {
      const previousKey = previousUrl.split(".amazonaws.com/")[1];
      if (previousKey) await deleteImageFromS3(previousKey);
    }

    const uniqueFilename = `${userId}/avatar/${Date.now()}-${file.name}`;
    const { fileUrl } = await uploadToAwsS3(file, userId, uniqueFilename);

    // Update user avatarUrl in the database
    const response = await db.user.update({
      where: { id: userAvatarId || userId },
      data: { avatarUrl: fileUrl },
    });

    return {
      success: true,
      key: uniqueFilename,
      url: fileUrl,
    };
  } catch (error) {
    console.error("Error uploading file to S3:", error);
    throw new Error("Failed to upload file");
  }
}

// Upload a course element (image, video, or document) to S3
export async function uploadCourseElementToS3(formData, courseId) {
  console.log("Course Element uploading...");

  const { userId } = await getServerUserSession();

  try {
    const file = formData.get("courseSrc");
    const previousUrl = formData.get("previousUrl");
    console.log("Preset file: ", file);
    console.log("Previous Url: ", previousUrl);

    if (!file) {
      throw new Error("No file provided");
    }

    // If a previous image exists, delete it from S3
    if (previousUrl) {
      const previousKey = previousUrl.split(".amazonaws.com/")[1];
      if (previousKey) await deleteImageFromS3(previousKey);
    }

    const uniqueFilename = `${courseId}/${Date.now()}-${file.name}`;

    // Upload the new image to S3 under /courses/{courseId}/{uniqueFileName}
    const { fileUrl } = await uploadToAwsS3(file, userId, uniqueFilename);
    console.log(fileUrl);

    // Update course imageUrl in the database
    // const response = await db.course.update({
    //   where: { id: courseId },
    //   data: { imageUrl: fileUrl },
    // });

    return {
      success: true,
      key: uniqueFilename,
      url: fileUrl,
    };
  } catch (error) {
    console.error("Error uploading course image to S3:", error);
    throw new Error("Failed to upload course image");
  }
}


export async function generatePresignedUrl(key: string): Promise<CachedUrl> {
  const command = new GetObjectCommand({
    Bucket: process.env.AWS_BUCKET_NAME,
    Key: key,
  });

  const url = await getSignedUrl(s3Client, command, { expiresIn: 360 }); // 6 minutes
  
  return {
    url,
    expiresAt: Date.now() + 330_000 // 5.5 minutes client-side
  };
}

export async function getPresignedUrl(attachment: any): Promise<CachedUrl> {
  try {
    const key = attachment?.url?.split(".amazonaws.com/")[1]?.split("?")[0];
    if (!key) throw new Error("Invalid S3 key");
    
    return await generatePresignedUrl(key);
  } catch (error) {
    console.error("Error generating presigned URL:", error);
    throw new Error("Failed to generate secure download link");
  }
}


