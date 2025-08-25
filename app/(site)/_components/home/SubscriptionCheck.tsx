// @ts-nocheck
"use client";

import { useEffect } from "react";
import axios from "axios";
import toast from "react-hot-toast";
import { useSession } from "next-auth/react";
import { Urls } from "@/constants/urls";

export const SubscriptionCheck = () => {
  const {
    data: {
      user: { id: userId },
    },
  } = useSession();

  useEffect(() => {
    const fetchSubscriptions = async () => {
      try {
        const response = await axios.get(Urls.user.subscription);

        if (response?.data?.status === "EXPIRED") {
          toast.error(
            "সাবস্ক্রিপশনের মেয়াদ শেষ হয়ে গেছে, অনুগ্রহ করে এটি রিনিউ করুন।"
          );
        }
      } catch (err) {
        console.error(
          "Error fetching subscriptions:",
          err.response ? err.response.data : err.message
        );
      }
    };

    if (userId) {
      fetchSubscriptions();
    }
  }, [userId]);

  return null;
};
