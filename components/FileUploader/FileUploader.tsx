import React, { useCallback, useState } from "react";
import { FileRejection, useDropzone } from "react-dropzone";
import { Card, CardContent } from "../ui/card";
import { cn } from "@/lib/utils";
import { UploadCloudIcon } from "lucide-react";
import { toast } from "sonner";
import { v4 as uuidv4 } from "uuid";
import { set } from "zod";

interface fileUpload {
  id: String | null;
  file: File | null;
  uploading: boolean;
  progress: number;
  key?: string;
  isDeleting: boolean;
  error: boolean;
  objectUrl?: string;
  fileType: "image" | "video";
}

export const FileUploader = () => {
  const [uploadState, setUploadState] = useState<fileUpload>({
    error: false,
    file: null,
    id: null,
    uploading: false,
    progress: 0,
    fileType: "image",
    isDeleting: false,
  });

  const rejectedFiles = (filerejection: FileRejection[]) => {
    if (filerejection.length) {
      const tooManyFiles = filerejection.find(
        (rejection) => rejection.errors[0].code === "too-many-files"
      );
      if (tooManyFiles) {
        toast.error("Too many files selected, max is 1");
      }

      const largeFiles = filerejection.find(
        (rejection) => rejection.errors[0].code === "file-too-large"
      );
      if (largeFiles) {
        toast.error("File too large, max limit is 10 MB");
      }
    }
  };

  const uploadFileToServer = async (file: File) => {
    setUploadState((prev) => ({
      ...prev,
      progress: 0,
      uploading: true,
    }));
    try {
      const presignedResponse = await fetch("/api/S3/upload", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          fileName: file.name,
          contentType: file.type,
          size: file.size,
          isImage: true,
        }),
      });

      if (!presignedResponse.ok) {
        throw new Error("Failed to get presigned URL");
      }

      const { presignedUrl, Key } = await presignedResponse.json();

      await fetch(presignedUrl, {
        method: "PUT",
        headers: {
          "Content-Type": file.type,
        },
        body: file,
      });
      toast.success("File uploaded successfully");
    } catch (error) {
      console.error(error);
      setUploadState((prev) => ({
        ...prev,
        progress: 0,
        uploading: false,
        error: true,
      }));
      toast.error("File upload failed");
    }
  };

  const onDrop = useCallback((acceptedFiles: File[]) => {
    if (acceptedFiles.length > 0) {
      const file = acceptedFiles[0];
      setUploadState({
        file: file,
        isDeleting: false,
        progress: 0,
        uploading: false,
        objectUrl: URL.createObjectURL(file),
        error: false,
        fileType: "image",
        id: uuidv4(),
      });
      uploadFileToServer(file);
    }
  }, []);
  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: { "image/*": [] },
    maxFiles: 1,
    maxSize: 10 * 1024 * 1024,
    multiple: false,
    onDropRejected: rejectedFiles,
  });

  return (
    <Card
      {...getRootProps()}
      className={cn(
        "relative  border-2 border-dashed transition-colors duration-200 ease-in-out w-full h-64 flex flex-col items-center justify-center",
        isDragActive
          ? "border-primary bg-primary/10"
          : "border-primary/30 bg-input/30"
      )}
    >
      <div className="text-center flex flex-col items-center">
        <div>
          <input {...getInputProps()} />
          {isDragActive ? (
            <p>Drop the files here ...</p>
          ) : (
            <div className="flex flex-col items-center justify-center">
              <UploadCloudIcon size={28} />
              <p>
                Drop your files here, or{" "}
                <span className="text-primary">click to select files</span>
              </p>
            </div>
          )}
        </div>
      </div>
    </Card>
  );
};
