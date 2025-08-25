// @ts-nocheck
"use client";
import { uploadUserAvatarToS3 } from "@/actions/upload-aws";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Loader } from "lucide-react";
import { useSession } from "next-auth/react";
import React, { useState } from "react";
import toast from "react-hot-toast";
import { PiImagesLight } from "react-icons/pi";
const UserAvatar = () => {
  const {
    data: { user },
  } = useSession();

  const [avatarSrc, setAvatarSrc] = useState(user?.info?.avatarUrl || "");
  const [isUploading, setIsUploading] = useState(false);
  const [isHovered, setIsHovered] = useState(false);

  const MAX_FILE_SIZE_BYTES =
    (Number(process.env.MAX_FILE_SIZE_MB) || 5) * 1024 * 1024;

  const handleFileUpload = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    if (file.size > MAX_FILE_SIZE_BYTES) {
      toast.error("File size must be less than 5MB");
      return;
    }

    setIsUploading(true);
    try {
      const formData = new FormData();
      formData.append("avatarSrc", file);

      if (avatarSrc) {
        formData.append("previousImageUrl", avatarSrc);
      }

      const response = await uploadUserAvatarToS3(formData);

      if (response.success) {
        setAvatarSrc(response.url);
        setIsHovered(false);
        setIsUploading(false);
        toast.success("Avatar changed successfully!");
      } else {
        setAvatarSrc(user?.avatarUrl || "");
        setIsHovered(false);
        setIsUploading(false);
        toast.error("File upload failed!");
      }
    } catch (error) {
      console.error("Error uploading file:", error);
      toast.error(error.message || "An unexpected error occurred");
    } finally {
      setIsUploading(false);
    }
  };

  return (
    <div className="flex items-center gap-4">
      <div
        className="relative w-36 h-36 max-sm:w-36 max-sm:h-36 group"
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={() => setIsHovered(false)}
      >
        <Avatar className="w-full h-full shadow-sm">
          <AvatarImage src={avatarSrc} alt={`prayogik_${user?.name}`} />
          <AvatarFallback className="text-xl !bg-bodyBackground">
            {user?.name?.toUpperCase()?.slice(0, 2)}
          </AvatarFallback>
        </Avatar>

        {/* Transparent overlay with edit icon */}
        {isUploading && (
          <div className="text-white cursor-pointer absolute inset-0 bg-black bg-opacity-40 flex items-center justify-center rounded-full">
            <Loader className="w-6 h-6 animate-spin" />
            <p className="ml-1">Uploading...</p>
          </div>
        )}

        {!isUploading && isHovered && (
          <div className="cursor-pointer absolute inset-0 bg-black bg-opacity-40 flex items-center justify-center rounded-full">
            <PiImagesLight className="cursor-pointer bg-white border-[.5px] border-primary rounded-full w-10 h-10 p-2 text-primary" />
            <input
              type="file"
              accept="image/*"
              className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
              onChange={handleFileUpload}
              disabled={isUploading}
            />
          </div>
        )}
      </div>
    </div>
  );
};

export default UserAvatar;
