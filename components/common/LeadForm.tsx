// "use client";

// import React from "react";
// import { zodResolver } from "@hookform/resolvers/zod";
// import { Loader2 } from "lucide-react";
// import { useForm } from "react-hook-form";

// import {
//   leadFormSchema,
//   LeadFormValues,
// } from "@/app/(site)/leads/_schema/leads";
// import { Button } from "@/components/ui/button";

// import {
//   Form,
//   FormControl,
//   FormField,
//   FormItem,
//   FormLabel,
//   FormMessage,
// } from "@/components/ui/form";
// import { Input } from "@/components/ui/input";
// import { Separator } from "@/components/ui/separator";
// import toast from "react-hot-toast";
// import RequiredFieldStar from "./requiredFieldStar";
// import { LeadStatus } from "@prisma/client";

// interface LeadFormProps {
//   initialData?: Partial<LeadFormValues>;
//   courseId?: string;
//   eventId?: string;
//   certificationId?: string;
//   type?: string;
//   status?: LeadStatus; // New prop for initial status
//   isPreviewMode?: boolean; // New prop to indicate preview mode
// }

// export function LeadForm({
//   initialData,
//   courseId,
//   eventId,
//   certificationId,
//   type,
//   status = LeadStatus.WAITING, // Default status
//   isPreviewMode = false,
// }: LeadFormProps) {
//   const [isLoading, setIsLoading] = React.useState(false);

//   const form = useForm<LeadFormValues>({
//     resolver: zodResolver(leadFormSchema),
//     defaultValues: {
//       name: initialData?.name || "",
//       email: initialData?.email || "",
//       phone: initialData?.phone || "",
//       facebookProfile: initialData?.facebookProfile || "",
//       linkedin: initialData?.linkedin || "",
//       whatsapp: initialData?.whatsapp || "",
//       courseId: courseId || initialData?.courseId || "",
//       eventId: eventId || initialData?.eventId || "",
//       certificationId: certificationId || initialData?.certificationId || "",
//     },
//   });

//   const handleSubmit = async (data: LeadFormValues) => {
//     try {
//       setIsLoading(true);

//       // Build search params
//       const searchParams = new URLSearchParams();
//       if (type) searchParams.append("type", type);
//       if (courseId) searchParams.append("courseId", courseId);
//       if (eventId) searchParams.append("eventId", eventId);
//       if (certificationId)
//         searchParams.append("certificationId", certificationId);
//       if (status) searchParams.append("status", status); // or "WAITING"

//       const url = `${process.env.NEXT_PUBLIC_BASE_URL}/api/lead${
//         searchParams.toString() ? `?${searchParams.toString()}` : ""
//       }`;
//       // console.log("url result:", url);

//       const response = await fetch(url, {
//         method: "POST",
//         headers: {
//           "Content-Type": "application/json",
//         },
//         body: JSON.stringify(data),
//       });

//       const result = await response.json();

//       if (!response.ok) {
//         throw new Error(result.message || "কিছু ভুল হয়েছে।");
//       }

//       toast.success(result.message || "আপনি সফলভাবে ওয়েটিং লিস্টে রেজিস্ট্রেশন করেছেন। পরবর্তী আপডেট আমরা আপনাকে ইমেইলের মাধ্যমে জানিয়ে দেব।");
//       // console.log("Lead created successfully:", result.data);
//       form.reset();
//     } catch (error) {
//       const errorMessage =
//         error instanceof Error
//           ? error.message
//           : "কিছু ভুল হয়েছে। অনুগ্রহ করে আবার চেষ্টা করুন।";
//       toast.error(errorMessage);
//       console.error("Error submitting form:", error);
//     } finally {
//       setIsLoading(false);
//     }
//   };

//   return (
//     <Form {...form}>
//       <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-8">
//         {/* Basic Information */}
//         <div className="space-y-6">
//           <div className="flex items-center gap-3 mb-6">
//             <h3 className="text-xl font-semibold text-gray-800">
//               ব্যক্তিগত তথ্য
//             </h3>
//           </div>

//           <div className="grid grid-cols-1 md:grid-cols-1 gap-6">
//             <FormField
//               control={form.control}
//               name="name"
//               render={({ field }) => (
//                 <FormItem>
//                   <FormLabel className="text-sm font-medium text-gray-700">
//                     <RequiredFieldStar labelText="আপনার পূর্ণ নাম" />
//                   </FormLabel>
//                   <FormControl>
//                     <Input
//                       placeholder="আপনার পূর্ণ নাম"
//                       className="h-12 border-gray-200 focus:border-teal-500 focus:ring-teal-500/20 rounded-lg focus-visible:outline-none focus-visible:ring-0 focus-visible:ring-offset-0"
//                       {...field}
//                       disabled={isPreviewMode}
//                     />
//                   </FormControl>
//                   <FormMessage />
//                 </FormItem>
//               )}
//             />

//             <FormField
//               control={form.control}
//               name="email"
//               render={({ field }) => (
//                 <FormItem>
//                   <FormLabel className="text-sm font-medium text-gray-700">
//                     <RequiredFieldStar labelText="ইমেইল" />
//                   </FormLabel>
//                   <FormControl>
//                     <Input
//                       type="email"
//                       placeholder="example@email.com"
//                       className="h-12 border-gray-200 focus:border-teal-500 focus:ring-teal-500/20 rounded-lg focus-visible:outline-none focus-visible:ring-0 focus-visible:ring-offset-0"
//                       {...field}
//                       disabled={isPreviewMode}
//                     />
//                   </FormControl>
//                   <FormMessage />
//                 </FormItem>
//               )}
//             />
//           </div>

//           <FormField
//             control={form.control}
//             name="phone"
//             render={({ field }) => (
//               <FormItem>
//                 <FormLabel className="text-sm font-medium text-gray-700">
//                   <RequiredFieldStar labelText=" ফোন নম্বর" />
//                 </FormLabel>
//                 <FormControl>
//                   <Input
//                     placeholder="018XXXXXXXX"
//                     inputMode="numeric"
//                     pattern="[0-9]*"
//                     className="h-12 border-gray-200 focus:border-teal-500 focus:ring-teal-500/20 rounded-lg focus-visible:outline-none focus-visible:ring-0 focus-visible:ring-offset-0"
//                     {...field}
//                     onInput={(e) => {
//                       e.currentTarget.value = e.currentTarget.value.replace(
//                         /[^0-9]/g,
//                         ""
//                       );
//                     }}
//                     disabled={isPreviewMode}
//                   />
//                 </FormControl>
//                 <FormMessage />
//               </FormItem>
//             )}
//           />
//         </div>

//         <Separator className="my-8" />

//         {/* Social Profiles */}
//         <div className="space-y-6">
//           <div className="flex items-center gap-3 mb-6">
//             <h3 className="text-xl font-semibold text-gray-800">
//               সামাজিক যোগাযোগ
//             </h3>
//           </div>

//           <div className="grid grid-cols-1 gap-6">
//             <FormField
//               control={form.control}
//               name="facebookProfile"
//               render={({ field }) => (
//                 <FormItem>
//                   <FormLabel className="text-sm font-medium text-gray-700">
//                     ফেসবুক
//                   </FormLabel>
//                   <FormControl>
//                     <Input
//                       placeholder="https://facebook.com/yourusername"
//                       className="h-12  border-gray-200 focus:border-teal-500 focus:ring-teal-500/20 rounded-lg focus-visible:outline-none focus-visible:ring-0 focus-visible:ring-offset-0"
//                       {...field}
//                       disabled={isPreviewMode}
//                     />
//                   </FormControl>
//                   <FormMessage />
//                 </FormItem>
//               )}
//             />

//             <FormField
//               control={form.control}
//               name="linkedin"
//               render={({ field }) => (
//                 <FormItem>
//                   <FormLabel className="text-sm font-medium text-gray-700">
//                     লিংকডইন
//                   </FormLabel>
//                   <FormControl>
//                     <Input
//                       placeholder="https://linkedin.com/in/yourusername"
//                       className="h-12  border-gray-200 focus:border-teal-500 focus:ring-teal-500/20 rounded-lg focus-visible:outline-none focus-visible:ring-0 focus-visible:ring-offset-0"
//                       {...field}
//                       disabled={isPreviewMode}
//                     />
//                   </FormControl>
//                   <FormMessage />
//                 </FormItem>
//               )}
//             />

//             <FormField
//               control={form.control}
//               name="whatsapp"
//               render={({ field }) => (
//                 <FormItem>
//                   <FormLabel className="text-sm font-medium text-gray-700">
//                     হোয়াটস অ্যাপ
//                   </FormLabel>
//                   <FormControl>
//                     <Input
//                       placeholder="018XXXXXXXX"
//                       inputMode="numeric"
//                       pattern="[0-9]*"
//                       className="h-12 border-gray-200 focus:border-teal-500 focus:ring-teal-500/20 rounded-lg focus-visible:outline-none focus-visible:ring-0 focus-visible:ring-offset-0"
//                       {...field}
//                       onInput={(e) => {
//                         e.currentTarget.value = e.currentTarget.value.replace(
//                           /[^0-9]/g,
//                           ""
//                         );
//                       }}
//                       disabled={isPreviewMode}
//                     />
//                   </FormControl>
//                   <FormMessage />
//                 </FormItem>
//               )}
//             />
//           </div>
//         </div>

//         <div className="pt-4">
//           <Button
//             type="submit"
//             disabled={isLoading || isPreviewMode}
//             className="w-full h-14 bg-gradient-to-r from-teal-600 to-teal-600 hover:from-teal-700 hover:to-teal-700 text-white font-semibold rounded-lg  transition-all duration-200 transform "
//           >
//             {isLoading ? (
//               <>
//                 <Loader2 className="mr-3 h-5 w-5 animate-spin" />
//               </>
//             ) : (
//               <>সাবমিট করুন</>
//             )}
//           </Button>
//         </div>
//       </form>
//     </Form>
//   );
// }

"use client";

import React from "react";
import { zodResolver } from "@hookform/resolvers/zod";
import { Loader } from "lucide-react";
import { useForm } from "react-hook-form";

import {
  leadFormSchema,
  LeadFormValues,
} from "@/app/(site)/leads/_schema/leads";
import { Button, buttonVariants } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import toast from "react-hot-toast";
import { LeadStatus } from "@prisma/client";
import RequiredFieldStar from "./requiredFieldStar";

interface LeadFormProps {
  initialData?: Partial<LeadFormValues>;
  courseId?: string;
  eventId?: string;
  certificationId?: string;
  type?: string;
  status?: LeadStatus;
  isPreviewMode?: boolean;
  userInfo?: {
    name?: string;
    email?: string;
  };
  isUserRegistered?: boolean;
  userInfoLoading?: boolean;
}

export function LeadForm({
  initialData,
  courseId,
  eventId,
  certificationId,
  type,
  status = LeadStatus.WAITING,
  isPreviewMode = false,
  userInfo,
  isUserRegistered = false,
  userInfoLoading = false,
}: LeadFormProps) {
  const [isSubmitting, setIsSubmitting] = React.useState(false);
  const [emailCheckLoading, setEmailCheckLoading] = React.useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
  } = useForm<LeadFormValues>({
    resolver: zodResolver(leadFormSchema),
    defaultValues: {
      name: initialData?.name || userInfo?.name || "",
      email: initialData?.email || userInfo?.email || "",
      phone: initialData?.phone || "",
      facebookProfile: initialData?.facebookProfile || "",
      linkedin: initialData?.linkedin || "",
      whatsapp: initialData?.whatsapp || "",
      courseId: courseId || initialData?.courseId || "",
      eventId: eventId || initialData?.eventId || "",
      certificationId: certificationId || initialData?.certificationId || "",
    },
  });

  const onSubmit = async (data: LeadFormValues) => {
    try {
      setIsSubmitting(true);

      // Build search params
      const searchParams = new URLSearchParams();
      if (type) searchParams.append("type", type);
      if (courseId) searchParams.append("courseId", courseId);
      if (eventId) searchParams.append("eventId", eventId);
      if (certificationId)
        searchParams.append("certificationId", certificationId);
      if (status) searchParams.append("status", status);

      const url = `${process.env.NEXT_PUBLIC_BASE_URL}/api/lead${
        searchParams.toString() ? `?${searchParams.toString()}` : ""
      }`;

      const response = await fetch(url, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(data),
      });

      const result = await response.json();

      if (!response.ok) {
        throw new Error(result.message || "কিছু ভুল হয়েছে।");
      }

      toast.success(
        result.message ||
          "আপনি সফলভাবে ওয়েটিং লিস্টে রেজিস্ট্রেশন করেছেন। পরবর্তী আপডেট আমরা আপনাকে ইমেইলের মাধ্যমে জানিয়ে দেব।"
      );
      reset();
    } catch (error) {
      const errorMessage =
        error instanceof Error
          ? error.message
          : "কিছু ভুল হয়েছে। অনুগ্রহ করে আবার চেষ্টা করুন।";
      toast.error(errorMessage);
      console.error("Error submitting form:", error);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
      {/* Only show name field if user is not logged in */}
      {!userInfo?.name && (
        <div>
          <RequiredFieldStar
            labelText="আপনার পূর্ণ নাম"
            className="text-sm font-medium text-gray-700 mb-1 block"
          />
          <Input
            id="name"
            type="text"
            placeholder="আপনার পূর্ণ নাম লিখুন"
            {...register("name", { required: "নাম প্রয়োজন" })}
            className="w-full"
            disabled={isSubmitting || isPreviewMode}
          />
          {errors.name && (
            <p className="text-red-500 text-sm mt-1">{errors.name.message}</p>
          )}
        </div>
      )}

      {/* Show logged in user's name (read-only) */}
      {userInfo?.name && (
        <div>
          <Label className="text-sm font-medium text-gray-700 mb-1 block">
            আপনার নাম
          </Label>
          <div className="w-full px-3 py-2 border border-gray-300 rounded-md bg-gray-50 text-gray-700">
            {userInfo.name}
          </div>
        </div>
      )}

      {/* Only show email field if user is not logged in */}
      {!userInfo?.email && (
        <div>
          <Label
            htmlFor="email"
            className="text-sm font-medium text-gray-700 mb-1 block"
          >
            <RequiredFieldStar
              labelText="ইমেইল"
              className="text-sm font-medium text-gray-700 mb-1 block"
            />
          </Label>

          <div className="relative">
            <Input
              id="email"
              type="email"
              placeholder="ইমেইল ঠিকানা লিখুন"
              {...register("email", {
                required: "ইমেইল প্রয়োজন",
                pattern: {
                  value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i,
                  message: "সঠিক ইমেইল ঠিকানা লিখুন",
                },
              })}
              className="w-full"
              disabled={isSubmitting || isPreviewMode}
            />
            {emailCheckLoading && (
              <div className="absolute right-3 top-1/2 transform -translate-y-1/2">
                <Loader size={16} className="animate-spin text-gray-400" />
              </div>
            )}
          </div>
          {errors.email && (
            <p className="text-red-500 text-sm mt-1">{errors.email.message}</p>
          )}
        </div>
      )}

      {/* Show logged in user's email (read-only) */}
      {userInfo?.email && (
        <div>
          <RequiredFieldStar
            labelText="ইমেইল"
            className="text-sm font-medium text-gray-700 mb-1 block"
          />
          <div className="w-full px-3 py-2 border border-gray-300 rounded-md bg-gray-50 text-gray-700">
            {userInfo.email}
          </div>
        </div>
      )}

      <div>
        <RequiredFieldStar
          labelText="ফোন নম্বর"
          className="text-sm font-medium text-gray-700 mb-1 block"
        />
        <Input
          id="phone"
          type="tel"
          placeholder="ফোন নম্বার লিখুন"
          {...register("phone", {
            required: "ফোন নম্বার প্রয়োজন",
            pattern: {
              value: /^[0-9]{11}$/,
              message: "১১ সংখ্যার ফোন নম্বার লিখুন",
            },
          })}
          className="w-full"
          disabled={isSubmitting || isPreviewMode}
          onInput={(e) => {
            e.currentTarget.value = e.currentTarget.value.replace(
              /[^0-9]/g,
              ""
            );
          }}
        />
        {errors.phone && (
          <p className="text-red-500 text-sm mt-1">{errors.phone.message}</p>
        )}
      </div>

      <div>
        <Label
          htmlFor="facebookProfile"
          className="text-sm font-medium text-gray-700 mb-1 block"
        >
          ফেসবুক প্রোফাইল
        </Label>
        <Input
          id="facebookProfile"
          type="url"
          placeholder="https://facebook.com/yourusername"
          {...register("facebookProfile")}
          className="w-full"
          disabled={isSubmitting || isPreviewMode}
        />
        {errors.facebookProfile && (
          <p className="text-red-500 text-sm mt-1">
            {errors.facebookProfile.message}
          </p>
        )}
      </div>

      <div>
        <Label
          htmlFor="linkedin"
          className="text-sm font-medium text-gray-700 mb-1 block"
        >
          লিংকডইন প্রোফাইল
        </Label>
        <Input
          id="linkedin"
          type="url"
          placeholder="https://linkedin.com/in/yourusername"
          {...register("linkedin")}
          className="w-full"
          disabled={isSubmitting || isPreviewMode}
        />
        {errors.linkedin && (
          <p className="text-red-500 text-sm mt-1">{errors.linkedin.message}</p>
        )}
      </div>

      <div>
        <Label
          htmlFor="whatsapp"
          className="text-sm font-medium text-gray-700 mb-1 block"
        >
          হোয়াটস অ্যাপ নম্বার
        </Label>
        <Input
          id="whatsapp"
          type="tel"
          placeholder="018XXXXXXXX"
          {...register("whatsapp", {
            pattern: {
              value: /^[0-9]{11}$/,
              message: "১১ সংখ্যার নম্বার লিখুন",
            },
          })}
          className="w-full"
          disabled={isSubmitting || isPreviewMode}
          onInput={(e) => {
            e.currentTarget.value = e.currentTarget.value.replace(
              /[^0-9]/g,
              ""
            );
          }}
        />
        {errors.whatsapp && (
          <p className="text-red-500 text-sm mt-1">{errors.whatsapp.message}</p>
        )}
      </div>

      <Button
        type="submit"
        disabled={
          isPreviewMode ||
          isSubmitting ||
          isUserRegistered ||
          emailCheckLoading ||
          userInfoLoading
        }
        className={`w-full font-medium py-3 rounded-md transition-colors disabled:opacity-50 ${
          isUserRegistered
            ? buttonVariants({
                variant: "disabled",
              })
            : "bg-orange-500 hover:bg-orange-600 text-white"
        }`}
      >
        {emailCheckLoading || isSubmitting || userInfoLoading ? (
          <Loader size={16} className="animate-spin" />
        ) : isUserRegistered ? (
          "রেজিস্ট্রার্ড"
        ) : (
          "সাবমিট করুন"
        )}
      </Button>
    </form>
  );
}
