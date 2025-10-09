import toast from "react-hot-toast";

export interface Attendee {
  user?: {
    email?: string;
    name?: string;
  };
  purchase?: boolean;
  event?: {
    title?: string;
    type?: string;
    slug?: string;
    date?: string;
    location?: string;
    isOnline?: boolean;
    price?: number;
  };
}

export const sendMailToAttendees = async (attendees: Attendee[]) => {
  try {
    const attendeesArray = Array.isArray(attendees) ? attendees : [attendees];

    // Check if all attendees are for FREE events
    const allFreeEvents = attendeesArray.every(
      (attendee) => attendee.event?.type === "FREE"
    );

    let validAttendees: Attendee[];

    if (allFreeEvents) {
      // For FREE events, include all attendees with valid emails
      validAttendees = attendeesArray.filter(
        (attendee) => attendee.user?.email
      );
    } else {
      // For PAID events, filter out those who have already paid
      const unpaidAttendees = attendeesArray.filter(
        (attendee) => !attendee.purchase
      );

      validAttendees = unpaidAttendees.filter(
        (attendee) => attendee.user?.email
      );
    }

    if (validAttendees.length === 0) {
      if (allFreeEvents) {
        toast.error("কোনো বৈধ ইমেল ঠিকানা পাওয়া যায়নি।");
      } else {
        toast.error("পেমেন্ট বাকি আছে এমন কোনো অংশগ্রহণকারী পাওয়া যায়নি।");
      }
      return;
    }

    // Show loading toast
    const loadingToast = toast.loading("ইমেল পাঠানো হচ্ছে...");

    const response = await fetch("/api/events/payment-notification", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        attendees: validAttendees,
      }),
    });

    const data = await response.json();

    // Dismiss loading toast
    toast.dismiss(loadingToast);

    if (response.ok) {
      toast.success(
        data.message || `${validAttendees.length} জনকে ইমেল পাঠানো হয়েছে।`
      );
      return validAttendees.map((attendee) => attendee.user?.email);
    } else {
      toast.error(data.message || "ইমেল পাঠাতে ব্যর্থ হয়েছে।");
    }
  } catch (error) {
    console.error("Error sending emails:", error);
    toast.error("একটি সমস্যা হয়েছে, পরে আবার চেষ্টা করুন।");
    throw error;
  }
};

// Single attendee version
export const sendMailToAttendee = async (attendee: Attendee) => {
  if (!attendee.user?.email) {
    toast.error("এই ব্যবহারকারীর কোনো ইমেল ঠিকানা পাওয়া যায়নি।");
    return;
  }

  // For FREE events, don't check purchase status
  if (attendee.event?.type !== "FREE" && attendee.purchase) {
    toast.error("এই অংশগ্রহণকারী ইতিমধ্যে পেমেন্ট করেছেন।");
    return;
  }

  return sendMailToAttendees([attendee]);
};
