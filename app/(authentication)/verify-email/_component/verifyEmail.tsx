//@ts-nocheck
"use client";

import { useEffect, useState, useRef } from "react";
import axios from "axios";
import toast from "react-hot-toast";
import { useSearchParams, useRouter } from "next/navigation";
import { AlertCircle, CheckCircle2, Loader2Icon } from "lucide-react";

const VerifyEmail = () => {
  const router = useRouter();
  const searchParams = useSearchParams();
  const token = searchParams.get("token");

  const [status, setStatus] = useState<null | true | false>(null);
  const [isVerifying, setIsVerifying] = useState(true);
  const isVerifiedRef = useRef(false);

  useEffect(() => {
    if (!token) {
      router.push("/");
      return;
    }

    if (isVerifiedRef.current) {
      setIsVerifying(false);
      return;
    }

    const verifyEmail = async () => {
      try {
        isVerifiedRef.current = true;

        const response = await axios.post(
          "/api/auth/verify-email",
          {
            secret: process.env.NEXTAUTH_SECRET,
          },
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );

        if (response.data.success) {
          setStatus(true);
          toast.success("ইমেইল সফলভাবে ভেরিফাইড হয়েছে!");

          setTimeout(() => {
            router.push("/signin");
          }, 2000);
        } else {
          throw new Error(response.data.message || "ভেরিফিকেশন ফাইলেড");
        }
      } catch (error) {
        setStatus(false);
        toast.error(error.response?.data?.message || "Something went wrong");
        router.push("/");
      } finally {
        setIsVerifying(false);
      }
    };

    verifyEmail();
  }, [token, router]);

  if (isVerifying) {
    return (
      <div className="text-center py-16">
        <div className="flex gap-2 items-center justify-center">
          <Loader2Icon className="h-5 w-5 animate-spin" />
          <span className="text-gray-800">
           আপনার ইমেইল ভেরিফাই করা হচ্ছে, অনুগ্রহ করে অপেক্ষা করুন...
          </span>
        </div>
      </div>
    );
  }

  return (
    <div className="text-center flex justify-center items-center py-16">
      <div className="flex gap-2 items-center">
        {status === true ? (
          <CheckCircle2 className="h-5 w-5 text-green-600" />
        ) : status === false ? (
          <AlertCircle className="h-5 w-5 text-red-500" />
        ) : null}
        <span className="text-gray-800">
          {status === true
            ? "ইমেইল সফলভাবে ভেরিফাইড করা হয়েছে!"
            : status === false
            ? "ইমেইল ভেরিফাইড ব্যর্থ হয়েছে।"
            : "অনুগ্রহ করে অপেক্ষা করুন..."}
        </span>
      </div>
    </div>
  );
};

export default VerifyEmail;
