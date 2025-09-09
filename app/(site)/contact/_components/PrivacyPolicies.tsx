import { Card, CardContent } from "@/components/ui/card";
import { Shield } from "lucide-react";
import Link from "next/link";
import React from "react";

const PrivacyPolicies = () => {
  return (
    <div>
      <Card className="border-gray-200 bg-gray-50">
        <CardContent className="pt-6">
          <div className="flex items-start gap-3">
            <Shield className="w-5 h-5 text-brand mt-0.5 flex-shrink-0 " />
            <div className="space-y-2">
              <p className="text-sm font-medium">গোপনীয়তা এবং নিরাপত্তা</p>
              <p className="text-sm text-muted-foreground leading-relaxed">
                আপনার তথ্য সম্পূর্ণ নিরাপদ এবং গোপনীয় থাকবে। আমরা আপনার
                ব্যক্তিগত তথ্য তৃতীয় পক্ষের সাথে শেয়ার করি না। আমাদের
                <Link
                  href="https://policies.google.com/privacy"
                  target="_blank"
                  className="ml-1 text-blue-500 hover:underline"
                >
                  গোপনীয়তা নীতি
                </Link>{" "}
                এবং
                <Link
                  href="https://policies.google.com/terms"
                  target="_blank"
                  className="ml-1 text-blue-500 hover:underline"
                >
                  সেবার শর্তাবলী
                </Link>{" "}
                দেখুন।
              </p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default PrivacyPolicies;
