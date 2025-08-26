"use client";
import {
  CheckCircle,
  Download,
  Phone,
  Mail,
  Calendar,
  User,
  XCircle,
  Clock,
} from "lucide-react";
import { useRouter } from "next/navigation";

const TeacherApplicationStatusCard = ({ status, applicationDetails }: any) => {
  const getStatusConfig = () => {
    switch (status) {
      case "VERIFIED":
        return {
          bgColor: "bg-green-50",
          borderColor: "border-green-200",
          iconBgColor: "bg-green-100",
          iconColor: "text-green-600",
          textColor: "text-green-600",
          titleColor: "text-green-800",
          descColor: "text-green-700",
          icon: CheckCircle,
          statusText: "অনুমোদিত",
          title: "আবেদন অনুমোদিত",
          description: "অভিনন্দন! আপনার শিক্ষকতার আবেদনটি অনুমোদিত হয়েছে",
          nextStepsTitle: "পরবর্তী ধাপসমূহ:",
          nextSteps: ["আমাদের টিম আপনার সাথে যোগাযোগ করবে"],
          showApprovalDate: true,
          approvalDateText: "অনুমোদনের তারিখ",
          approvalDate: applicationDetails?.updatedAt,
          primaryButtonText: "সাপোর্ট টিমের সাথে যোগাযোগ",
          primaryButtonIcon: Mail,
          showDownloadButton: true,
        };

      case "PENDING":
        return {
          bgColor: "bg-yellow-50",
          borderColor: "border-yellow-200",
          iconBgColor: "bg-yellow-100",
          iconColor: "text-yellow-600",
          textColor: "text-yellow-600",
          titleColor: "text-yellow-800",
          descColor: "text-yellow-700",
          icon: Clock,
          statusText: "পেন্ডিং",
          title: "আবেদন পর্যালোচনাধীন",
          description:
            "আপনার আবেদনটি সফলভাবে জমা হয়েছে এবং বর্তমানে পর্যালোচনার জন্য অপেক্ষমাণ",
          nextStepsTitle: "পরবর্তী ধাপসমূহ:",
          nextSteps: [
            "আমাদের টিম আপনার আবেদন পর্যালোচনা করবে",
            "প্রয়োজনে আমরা আপনার সাথে যোগাযোগ করব",
            "৫-৭ কার্যদিবসের মধ্যে ফলাফল জানানো হবে",
          ],
          showApprovalDate: false,
          primaryButtonText: "সাপোর্ট টিমের সাথে যোগাযোগ",
          primaryButtonIcon: Mail,
          showDownloadButton: false,
        };

      case "REJECTED":
        return {
          bgColor: "bg-red-50",
          borderColor: "border-red-200",
          iconBgColor: "bg-red-100",
          iconColor: "text-red-600",
          textColor: "text-red-600",
          titleColor: "text-red-800",
          descColor: "text-red-700",
          icon: XCircle,
          statusText: "বাতিল",
          title: "আবেদন বাতিল",
          description: "দুঃখিত, আপনার আবেদনটি এই মুহূর্তে অনুমোদন করা যায়নি",
          nextStepsTitle: "বাতিলের কারণ:",
          nextSteps: [
            "উল্লেখিত তথ্য আমাদের গাইডলাইন অনুযায়ী না হওয়ায়, আপনার আবেদনটি এই মুহূর্তে বাতিল করা হয়েছে। অনুগ্রহপূর্বক, আপনার কিছু জানার থাকলে সাপোর্ট টিমের সাথে যোগাযোগ করুন।",
          ],
          showApprovalDate: false,
          primaryButtonText: "সাপোর্ট টিমের সাথে যোগাযোগ",
          primaryButtonIcon: Mail,
          showDownloadButton: false,
        };

      default:
        // Fixed: Return APPROVED config directly instead of calling getStatusConfig() again
        return {
          bgColor: "bg-green-50",
          borderColor: "border-green-200",
          iconBgColor: "bg-green-100",
          iconColor: "text-green-600",
          textColor: "text-green-600",
          titleColor: "text-green-800",
          descColor: "text-green-700",
          icon: CheckCircle,
          statusText: "",
          title: "",
          description: "",
          nextStepsTitle: "",
          nextSteps: [""],
          showApprovalDate: true,
          approvalDateText: "অনুমোদনের তারিখ",
          approvalDate: "",
          primaryButtonText: "",
          primaryButtonIcon: Download,
          showDownloadButton: true,
        };
    }
  };

  const config = getStatusConfig();
  const StatusIcon = config.icon;
  const PrimaryButtonIcon = config.primaryButtonIcon;
  const router = useRouter();
  
  const formatSubmissionDate = (dateString: any) => {
    if (!dateString) return "Not set";

    // If already in Bengali format, return as-is
    if (typeof dateString === "string" && dateString.includes("জানুয়ারি")) {
      return dateString;
    }

    try {
      const date = new Date(dateString);
      return date.toLocaleString("bn-BD", {
        year: "numeric",
        month: "long",
        day: "numeric",
      });
    } catch (error) {
      console.error("Error formatting date:", error);
      return "Invalid date";
    }
  };

  return (
    <div className="space-y-6 mt-6">
      {/* Main Status Card */}
      <div
        className={`${config.bgColor} ${config.borderColor} border-2 rounded-lg`}
      >
        <div className="p-6">
          <div className="text-center space-y-4">
            <div
              className={`w-12 h-12 rounded-full flex items-center justify-center mx-auto`}
            >
              <StatusIcon className={`w-full h-full ${config.iconColor}`} />
            </div>
            <div>
              <p
                className={`${config.iconBgColor} ${config.borderColor} font-semibold px-2 mb-2 mx-auto border w-fit rounded-full text-gray-600 text-[14px]`}
              >
                {config.statusText}
              </p>
              <h2 className={`text-2xl font-bold ${config.titleColor} mb-3`}>
                {config.title}
              </h2>
              <p className={`${config.descColor} mb-6`}>{config.description}</p>
            </div>

            <div
              className={`${config.borderColor} text-left space-y-2 border p-4 rounded-lg`}
            >
              <p className={`font-semibold ${config.titleColor} mb-3 text-lg`}>
                {config.nextStepsTitle}
              </p>
              <ul className={`space-y-2 ${config.descColor}`}>
                {config.nextSteps.map((step, index) => (
                  <li key={index} className="flex items-start">
                    <span className={`${config.textColor} mr-2`}>•</span>
                    {step}
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>
      </div>

      {/* Application Details */}
      <div className="bg-white border rounded-lg">
        <div className="p-6">
          <div className="flex items-center gap-2 mb-6">
            <User className="w-5 h-5 text-gray-600" />
            <h3 className="text-2xl font-bold text-gray-800">আবেদনের বিবরণ</h3>
          </div>

          <div className="grid md:grid-cols-2 gap-6">
            <div className="space-y-4">
              <div>
                <p className="text-sm text-gray-600 mb-1">আবেদন নম্বর</p>
                <p className="font-semibold text-gray-800">
                  {applicationDetails?.applicationNumber}
                </p>
              </div>
              <div>
                <p className="text-sm text-gray-600 mb-1">আবেদনকারীর নাম</p>
                <p className="font-semibold text-gray-800">
                  {applicationDetails?.applicantName}
                </p>
              </div>
              <div>
                <p className="text-sm text-gray-600 mb-1">বিভাগীয় পদ</p>
                <p className="font-semibold text-gray-800">
                  {applicationDetails.specializedField.join(", ")}
                </p>
              </div>
            </div>

            <div className="space-y-4">
              <div>
                <p className="text-sm text-gray-600 mb-1">জমা দেওয়ার তারিখ</p>
                <div className="flex items-center gap-2">
                  <Calendar className="w-4 h-4 text-gray-500" />
                  <p className="font-semibold text-gray-800">
                    {formatSubmissionDate(applicationDetails?.submissionDate)}
                  </p>
                </div>
              </div>
              <div>
                <p className="text-sm text-gray-600 mb-1">ইমেইল</p>
                <div className="flex items-center gap-2">
                  <Mail className="w-4 h-4 text-gray-500" />
                  <p className="font-semibold text-gray-800">
                    {applicationDetails?.email}
                  </p>
                </div>
              </div>
              <div>
                <p className="text-sm text-gray-600 mb-1">ফোন</p>
                <div className="flex items-center gap-2">
                  <Phone className="w-4 h-4 text-gray-500" />
                  <p className="font-semibold text-gray-800">
                    {applicationDetails?.phone}
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Approval Date - Only show for approved status */}
      {config.showApprovalDate && (
        <div className="bg-green-50 border-green-200 border rounded-lg">
          <div className="p-4">
            <div className="flex items-center gap-2">
              <CheckCircle className="w-5 h-5 text-green-600" />
              <div>
                <p className="font-semibold text-green-800">
                  {config.approvalDateText}
                </p>
                <p className="text-green-700">
                  {formatSubmissionDate(config.approvalDate)}
                </p>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Action Buttons */}
      <div className="flex flex-wrap gap-4 justify-center">
        <button
          onClick={() => router.replace("/dashboard")}
          className="flex items-center gap-2 px-4 py-2 border border-gray-300 rounded-md hover:bg-gray-50 transition-colors"
        >
          <span>←</span>
          ফিরে যেতে ক্লিক করুন
        </button>
        <button
          onClick={() => router.replace("/contact")}
          className="bg-gray-800 hover:bg-gray-900 text-white flex items-center gap-2 px-4 py-2 rounded-md transition-colors"
        >
          <PrimaryButtonIcon className="w-4 h-4" />
          {config.primaryButtonText}
        </button>
      </div>

      {/* Help Section */}
      <div className="bg-white border rounded-lg">
        <div className="p-6 text-center">
          <h4 className="text-lg font-semibold text-gray-800 mb-3">
            সাহায্যের প্রয়োজন?
          </h4>
          <p className="text-gray-600 mb-4">
            কোনো প্রশ্ন বা সহায়তার জন্য আমাদের সাথে যোগাযোগ করুন
          </p>
          <div className="flex flex-wrap gap-4 justify-center text-sm">
            <div className="flex items-center gap-2">
              <Mail className="w-4 h-4 text-gray-500" />
              <span className="text-gray-700">contact@prayogik.com</span>
            </div>
            <div className="flex items-center gap-2">
              <Phone className="w-4 h-4 text-gray-500" />
              <span className="text-gray-700">০১৮১৪-৪৩২৮৭৫</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default TeacherApplicationStatusCard;
