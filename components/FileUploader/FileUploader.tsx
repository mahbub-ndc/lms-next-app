import React, { use, useCallback, useEffect, useState } from "react";
import { FileRejection, useDropzone } from "react-dropzone";
import { Card } from "../ui/card";
import { cn } from "@/lib/utils";
import { UploadCloudIcon } from "lucide-react";
import { toast } from "sonner";
import { v4 as uuidv4 } from "uuid";
import { file, object } from "better-auth";
import { useConstructUrl } from "@/hooks/use-construct-url";

interface FileUpload {
  id: string | null;
  file: File | null;
  uploading: boolean;
  progress: number;
  key?: string;
  isDeleting: boolean;
  error: boolean;
  objectUrl?: string;
  fileType: "image" | "video";
}

interface IAppProps {
  onChange: (value: string) => void; // returns the uploaded S3 key
  value?: string; // controlled form value (S3 key)
}

export const FileUploader = ({ onChange, value }: IAppProps) => {
  const fileUrl = useConstructUrl(value || "");
  const [uploadState, setUploadState] = useState<FileUpload>({
    error: false,
    file: null,
    id: null,
    uploading: false,
    progress: 0,
    fileType: "image",
    isDeleting: false,
    key: value,
    //objectUrl: fileUrl,
  });

  // Cleanup object URL to avoid memory leaks
  useEffect(() => {
    return () => {
      if (uploadState.objectUrl) {
        URL.revokeObjectURL(uploadState.objectUrl);
      }
    };
  }, [uploadState.objectUrl]);

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
        toast.error("File too large, max limit is 5 MB");
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

      // Upload with progress tracking
      const xhr = new XMLHttpRequest();
      xhr.upload.onprogress = (event) => {
        if (event.lengthComputable) {
          const percent = Math.round((event.loaded / event.total) * 100);
          setUploadState((prev) => ({ ...prev, progress: percent }));
        }
      };

      xhr.onload = () => {
        if (xhr.status === 200) {
          setUploadState((prev) => ({
            ...prev,
            progress: 100,
            uploading: false,
            key: Key,
          }));
          toast.success("File uploaded successfully");
          onChange?.(Key); // Pass S3 key back to form
        } else {
          setUploadState((prev) => ({
            ...prev,
            uploading: false,
            error: true,
          }));
          toast.error("Upload failed");
        }
      };

      xhr.onerror = () => {
        setUploadState((prev) => ({
          ...prev,
          uploading: false,
          error: true,
        }));
        toast.error("Upload failed");
      };

      xhr.open("PUT", presignedUrl, true);
      xhr.setRequestHeader("Content-Type", file.type);
      xhr.send(file);
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
        file,
        isDeleting: false,
        progress: 0,
        uploading: false,
        objectUrl: URL.createObjectURL(file),
        error: false,
        fileType: "image",
        id: uuidv4(),
        key: undefined,
      });
      uploadFileToServer(file);
    }
  }, []);

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: { "image/*": [] },
    maxFiles: 1,
    maxSize: 5 * 1024 * 1024,
    multiple: false,
    onDropRejected: rejectedFiles,
  });

  return (
    <Card
      {...getRootProps()}
      className={cn(
        "relative border-2 border-dashed transition-colors duration-200 ease-in-out w-full h-64 flex flex-col items-center justify-center",
        uploadState.error
          ? "border-red-500 bg-red-50"
          : isDragActive
            ? "border-primary bg-primary/10"
            : "border-primary/30 bg-input/30"
      )}
    >
      <input {...getInputProps()} />

      {uploadState.objectUrl ? (
        <div className="flex flex-col items-center w-full px-4">
          <img
            src={uploadState?.objectUrl}
            className="h-48 object-contain m-auto py-2"
          />
          {uploadState.uploading && (
            <div className="w-1/3 bg-gray-200 rounded-full h-2 mt-2">
              <div
                className="bg-primary h-2 rounded-full transition-all duration-500 ease-out "
                style={{ width: `${uploadState.progress}%` }}
              />
              <span className="text-sm mt-1">{uploadState.progress}%</span>
            </div>
          )}
          {uploadState.error && (
            <p className="text-red-500 text-sm mt-2">Upload failed</p>
          )}
        </div>
      ) : (
        <div className="text-center flex flex-col items-center">
          <UploadCloudIcon size={28} />
          <p>
            Drop your files here, or{" "}
            <span className="text-primary">click to select files</span>
          </p>
        </div>
      )}
    </Card>
  );
};
