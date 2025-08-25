"use client";
import { Button } from "@/components/ui/button";
import { UploadIcon } from "lucide-react";
import { useCallback, useRef, useState, useEffect } from "react";
import toast from "react-hot-toast";
import FileDisplay from "./FileDisplay";
import { useParams } from "next/navigation";
import { Cross2Icon } from "@radix-ui/react-icons";

const Uploader2 = ({
  videoTitle,
  onUploaded,
  onUploadStart,
  videoId,
  isReplacing,
  setIsUploadLoading,
  isUploading: isUploadingProp,
  onUploadStateChange,
}) => {
  const [uploadProgress, setUploadProgress] = useState(0);
  const [isUploading, setIsUploading] = useState(isUploadingProp || false);
  const [file, setFile] = useState(null);
  const [message, setMessage] = useState({
    variant: "",
    title: "",
    description: "",
  });
  const [uploadAttempted, setUploadAttempted] = useState(false);
  const [originalVideoId, setOriginalVideoId] = useState(videoId);
  const [isProcessingComplete, setIsProcessingComplete] = useState(false);
  const [isInCompletionPhase, setIsInCompletionPhase] = useState(false);
  const { courseId, lessonId } = useParams();

  // Update originalVideoId when videoId prop changes
  useEffect(() => {
    if (videoId && videoId !== originalVideoId) {
      setOriginalVideoId(videoId);
    }
  }, [videoId, originalVideoId]);

  // Notify parent component when upload state changes
  useEffect(() => {
    if (onUploadStateChange) {
      onUploadStateChange(isUploading || isInCompletionPhase);
    }
  }, [isUploading, isInCompletionPhase, onUploadStateChange]);

  const fileInputRef = useRef(null);

  const removeFile = () => {
    setFile(null);
    setIsUploading(false);
    setUploadAttempted(false);
    setUploadProgress(0);
    setIsProcessingComplete(false);
    setIsInCompletionPhase(false);
    setMessage({
      variant: "",
      title: "",
      description: "",
    });
    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
  };

  const closeAlert = () => {
    setMessage({
      variant: "",
      title: "",
      description: "",
    });
  };

  const handleFileChange = useCallback((event) => {
    const selectedFile = event.target.files[0];
    if (selectedFile) {
      setFile(selectedFile);
      setUploadAttempted(false);
      setUploadProgress(0);
      setIsProcessingComplete(false);
      setIsInCompletionPhase(false);
    }
  }, []);

  const handleDrop = useCallback((event) => {
    event.preventDefault();
    const droppedFile = event.dataTransfer.files[0];
    if (droppedFile) {
      setFile(droppedFile);
      setUploadAttempted(false);
      setUploadProgress(0);
      setIsProcessingComplete(false);
      setIsInCompletionPhase(false);
    }
  }, []);

  const handleDragOver = useCallback((event) => {
    event.preventDefault();
  }, []);

  // Client-side file upload to VdoCipher
  const uploadFileToVdoCipher = async (uploadCreds, file) => {
    return new Promise((resolve, reject) => {
      const xhr = new XMLHttpRequest();

      // Track upload progress
      xhr.upload.addEventListener("progress", (e) => {
        if (e.lengthComputable) {
          const percentComplete = Math.round((e.loaded / e.total) * 100);
          setUploadProgress(percentComplete);
        }
      });

      xhr.addEventListener("load", () => {
        if (xhr.status >= 200 && xhr.status < 300) {
          resolve(true);
        } else {
          reject(new Error(`Upload failed with status: ${xhr.status}`));
        }
      });

      xhr.addEventListener("error", () => {
        reject(new Error("Network error during upload"));
      });

      xhr.addEventListener("abort", () => {
        reject(new Error("Upload was aborted"));
      });

      // Prepare form data for VdoCipher upload
      const uploadFormData = new FormData();
      uploadFormData.append("key", uploadCreds.key);
      uploadFormData.append("policy", uploadCreds.policy);
      uploadFormData.append("x-amz-signature", uploadCreds["x-amz-signature"]);
      uploadFormData.append("x-amz-algorithm", uploadCreds["x-amz-algorithm"]);
      uploadFormData.append("x-amz-date", uploadCreds["x-amz-date"]);
      uploadFormData.append(
        "x-amz-credential",
        uploadCreds["x-amz-credential"]
      );
      uploadFormData.append("success_action_status", "201");
      uploadFormData.append("success_action_redirect", "");
      uploadFormData.append("file", file);

      xhr.open("POST", uploadCreds.uploadLink);
      xhr.send(uploadFormData);
    });
  };

  // Get video duration with retries
  const getVideoDurationWithRetries = async (videoId, maxRetries = 3) => {
    let duration = 0;
    let retryCount = 0;

    while (retryCount < maxRetries) {
      try {
        await new Promise((resolve) =>
          setTimeout(resolve, 3000 + retryCount * 2000)
        );

        const response = await fetch(`/api/vdocipher/${videoId}`);

        if (response.ok) {
          const data = await response.json();
          duration = data.length || 0;
          if (duration > 0) {
            break;
          }
        }

        retryCount++;
      } catch (error) {
        console.warn(
          `Failed to get video duration (attempt ${retryCount + 1}):`,
          error
        );
        retryCount++;
      }
    }

    return duration;
  };

  const handleUpload = useCallback(async () => {
    if (isUploading || uploadAttempted) {
      return;
    }

    if (!file) {
      setMessage({
        variant: "error",
        title: "No File Selected",
        description: "Please select a video file to upload.",
      });
      toast.error("No file selected.");
      return;
    }

    setIsUploadLoading(true);
    setIsUploading(true);
    setUploadAttempted(true);
    setUploadProgress(0);
    setIsProcessingComplete(false);
    setIsInCompletionPhase(false);

    // Notify parent that upload is starting
    if (onUploadStart) {
      onUploadStart();
    }

    let videoIdFromServer = null;
    let uploadCredentialsObtained = false;
    let clientUploadSuccessful = false;

    try {
      // Step 1: Get upload credentials and handle video replacement/database setup
      const initResponse = await fetch("/api/vdocipher", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          action: "initiate",
          videoTitle: videoTitle || "Untitled Video",
          courseId,
          lessonId,
          isReplacing,
          originalVideoId,
        }),
      });

      const initResult = await initResponse.json();

      if (!initResponse.ok || !initResult.success) {
        throw new Error(
          initResult.error ||
            initResult.details ||
            "Failed to initialize upload"
        );
      }

      videoIdFromServer = initResult.videoId;
      uploadCredentialsObtained = true;

      // Step 2: Upload file directly to VdoCipher from client
      await uploadFileToVdoCipher(initResult.uploadCredentials, file);
      clientUploadSuccessful = true;

      setIsProcessingComplete(true);
      setIsInCompletionPhase(true);

      // Step 3: Get video duration and finalize database
      const duration = await getVideoDurationWithRetries(videoIdFromServer, 3);

      // Step 4: Finalize the upload on server
      const finalizeResponse = await fetch("/api/vdocipher", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          action: "finalize",
          videoId: videoIdFromServer,
          duration,
          courseId,
          lessonId,
        }),
      });

      const finalizeResult = await finalizeResponse.json();

      if (!finalizeResponse.ok || !finalizeResult.success) {
        throw new Error(finalizeResult.error || "Failed to finalize upload");
      }

      setMessage({
        variant: "success",
        title: "Success!",
        description: finalizeResult.message,
      });

      toast.success(finalizeResult.message);

      // Call onUploaded callback with the new video ID and duration
      if (onUploaded && videoIdFromServer) {
        await onUploaded(videoIdFromServer, duration || 0);
      }

      setIsUploadLoading(false);

      // Reset the file after successful upload
      setTimeout(() => {
        setIsInCompletionPhase(false);
        removeFile();
      }, 3000);
    } catch (err) {
      console.error("Upload error:", err);
      const errorMessage = err.message || "An unexpected error occurred";

      toast.error(errorMessage);
      setMessage({
        variant: "error",
        title: "Upload Failed",
        description: errorMessage,
      });

      // Cleanup on error
      if (videoIdFromServer) {
        try {
          await fetch("/api/vdocipher", {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify({
              action: "cleanup",
              videoId: videoIdFromServer,
              courseId,
              lessonId,
              uploadCredentialsObtained,
              clientUploadSuccessful,
            }),
          });
        } catch (cleanupError) {
          console.error("Cleanup failed:", cleanupError);
        }
      }

      // Reset states on error to allow retry
      setUploadAttempted(false);
      setUploadProgress(0);
      setIsProcessingComplete(false);
      setIsInCompletionPhase(false);
      setIsUploadLoading(false);
    } finally {
      if (!isProcessingComplete) {
        setIsUploading(false);
      }
    }
  }, [
    file,
    videoTitle,
    onUploaded,
    onUploadStart,
    isUploading,
    uploadAttempted,
    originalVideoId,
    isReplacing,
    courseId,
    lessonId,
    setIsUploadLoading,
    isProcessingComplete,
  ]);

  // Handle the completion phase separately
  useEffect(() => {
    if (isProcessingComplete) {
      const completionTimer = setTimeout(() => {
        setIsUploading(false);
      }, 3000);

      return () => clearTimeout(completionTimer);
    }
  }, [isProcessingComplete]);

  const handleBrowseClick = () => {
    if (fileInputRef.current) {
      fileInputRef.current.click();
    }
  };

  const isUploadDisabled = isUploading || uploadAttempted || !file;
  const isBusy = isUploading || uploadAttempted;

  return (
    <div>
      <div
        className="flex flex-col items-center justify-center w-full gap-3"
        onDrop={handleDrop}
        onDragOver={handleDragOver}
      >
        <label
          style={{ minHeight: "200px" }}
          htmlFor="dropzone-file"
          className="flex flex-col items-center justify-center w-full h-64 border-2 border-gray-300 border-dashed rounded-lg cursor-pointer bg-gray-50"
        >
          <div className="flex flex-col items-center justify-center pt-5 pb-6 gap-4">
            <UploadIcon className="w-9 h-9 text-blue-500" />
            <p className="text-sm text-gray-500">
              Click or drag your file here
            </p>
          </div>
          <input
            id="dropzone-file"
            type="file"
            className="hidden"
            accept="video/*"
            onChange={handleFileChange}
            ref={fileInputRef}
            disabled={isBusy}
          />
        </label>
        <div className="text-center">
          <p className="text-sm">or</p>
          <Button
            style={{ paddingLeft: "40px", paddingRight: "40px" }}
            className="rounded-full mt-2 px-10 min-w-max bg-gray-700 hover:bg-gray-500"
            onClick={handleBrowseClick}
            disabled={isBusy}
          >
            Browse
          </Button>
        </div>
      </div>
      {(isUploading || isInCompletionPhase) && (
        <FileDisplay
          file={file}
          removeFile={removeFile}
          isUploading={isUploading || isInCompletionPhase}
          progress={uploadProgress}
          isUploadComplete={isProcessingComplete}
        />
      )}

      {file && !isUploading && !isInCompletionPhase && (
        <div className="mt-6 flex justify-between gap-4 bg-white px-3 py-2 rounded-md items-center">
          <p className="mr-2 text-sm text-gray-950">{file.name}</p>
          <div className="flex items-center">
            <button
              onClick={removeFile}
              className="text-red-600 hover:text-red-800"
              aria-label="Remove file"
            >
              <Cross2Icon h={6} w={6} />
            </button>
          </div>
        </div>
      )}
      {file && (
        <Button
          className="mt-4"
          onClick={handleUpload}
          disabled={isUploadDisabled}
        >
          {isBusy ? (isUploading ? "Uploading..." : "Saving...") : "Upload"}
        </Button>
      )}
    </div>
  );
};

export default Uploader2;
