import React from "react";
import { Sparkles } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { LeadStatus } from "@prisma/client";
import { LeadForm } from "@/components/common/LeadForm";

interface LeadsPageProps {
  searchParams: {
    type?: string;
    courseId?: string;
    eventId?: string;
    certificationId?: string;
    status?: LeadStatus;
  };
}

export const Leads = ({ searchParams }: LeadsPageProps) => {
  const {
    type,
    courseId,
    eventId,
    certificationId,
    status = LeadStatus.WAITING,
  } = searchParams;

  return (
    <div className="app-container py-20 min-h-[60vh] flex items-center justify-center">
      <div className="w-full max-w-2xl mx-auto">
        {/* Header Section */}
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-14 h-14 bg-gradient-to-br from-teal-500 to-teal-600 rounded-2xl mb-4">
            <Sparkles className="h-6 w-6 text-white" />
          </div>
          <h1 className="text-3xl font-bold text-gray-900 mb-2">
            রেজিস্ট্রেশন করুন
          </h1>
          <p className="text-gray-600 text-lg">
            আমাদের সাথে যুক্ত হতে আপনার তথ্য প্রদান করুন
          </p>
        </div>
        {/* form section */}
        <Card className="border border-gray-200 bg-white/80 ">
          <CardContent className="p-8">
            {/* <LeadForm
              type={type}
              courseId={courseId}
              eventId={eventId}
              certificationId={certificationId}
              status={status}
            /> */}
          </CardContent>
        </Card>
      </div>
    </div>
  );
};
