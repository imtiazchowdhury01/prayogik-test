// @ts-nocheck
import React from "react";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { BadgeCheck, AlertCircle, Clock } from "lucide-react";

const TeacherStatusAlert = ({ status }) => {
  switch (status) {
    case "PENDING":
      return (
        <Alert className="max-w-xl mx-auto bg-yellow-50 border-yellow-200">
          <Clock className="h-5 w-5 text-yellow-600" />
          <AlertTitle className="text-yellow-800">Under Review</AlertTitle>
          <AlertDescription className="text-yellow-700">
            Your application is currently pending for approval. We'll notify you
            once it's reviewed.
          </AlertDescription>
        </Alert>
      );
    case "VERIFIED":
      return (
        <Alert className="max-w-xl mx-auto bg-green-50 border-green-200">
          <BadgeCheck className="h-5 w-5 text-green-600" />
          <AlertTitle className="text-green-800">Verified!</AlertTitle>
          <AlertDescription className="text-green-700">
            Your details have been verified successfully.
          </AlertDescription>
        </Alert>
      );
    case "REJECTED":
      return (
        <Alert className="max-w-xl mx-auto bg-red-50 border-red-200">
          <AlertCircle className="h-5 w-5 text-red-600" />
          <AlertTitle className="text-red-800">Application Rejected</AlertTitle>
          <AlertDescription className="text-red-700">
            Unfortunately, your submission has been rejected. Please contact
            support for more details.
          </AlertDescription>
        </Alert>
      );
    default:
      return null;
  }
};

export default TeacherStatusAlert;
