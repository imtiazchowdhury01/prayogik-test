"use client";
import { convertNumberToBangla } from "@/lib/convertNumberToBangla";
import React, { useState, useEffect, useMemo } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { AlertCircle, Mail, User, Phone } from "lucide-react";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import { handleCheckout } from "@/lib/actions/checkout";
import {
  CheckoutStorage,
  UserStorage,
} from "@/lib/utils/storage/checkoutEmailStorage";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Alert, AlertDescription } from "@/components/ui/alert";
import toast from "react-hot-toast";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import RequiredFieldStar from "@/components/common/requiredFieldStar";
import { PurchaseType } from "@prisma/client";

// Validation schema
const formSchema = z.object({
  name: z.string().min(1, "নাম প্রয়োজন"),
  email: z.string().email("একটি বৈধ ইমেইল দিন"),
  mobile: z
    .string()
    .min(11, "১১ সংখ্যার মোবাইল নাম্বার প্রয়োজন")
    .regex(/^[0-9]{11}$/, "১১ সংখ্যার মোবাইল নাম্বার লিখুন"),
  profession: z.string().optional(),
});

const EventCheckoutForm = ({ event, isSignedIn, isPaymentSuccessful }: any) => {
  const router = useRouter();
  const { data: session } = useSession();

  const [isProcessing, setIsProcessing] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");
  const [userInfoContinued, setUserInfoContinued] = useState(false);
  const [storedUserInfo, setStoredUserInfo] = useState({
    name: "",
    email: "",
    mobile: "",
  });
  console.log({ storedUserInfo, userInfoContinued });
  const [isEditing, setIsEditing] = useState<any>({
    name: false,
    email: false,
    mobile: false,
  });

  const currentUserInfo: any = useMemo(() => {
    return {
      name: session?.user?.name || storedUserInfo.name,
      email: session?.user?.email || storedUserInfo.email,
      mobile: storedUserInfo.mobile,
    };
  }, [session?.user, storedUserInfo]);

  const form = useForm({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: currentUserInfo.name || "",
      email: currentUserInfo.email || "",
      mobile: currentUserInfo.mobile || "",
      profession: currentUserInfo.profession || "",
    },
    mode: "onChange",
  });

  useEffect(() => {
    const initializeUserInfoState = () => {
      if (session?.user) {
        setUserInfoContinued(true);
        setStoredUserInfo({
          name: session.user.name || "",
          email: session.user.email || "",
          mobile: UserStorage.getPhone() || "",
        });
        return;
      }

      const savedEmail = CheckoutStorage.getEmail();
      const savedName = UserStorage.getName();
      const savedPhone = UserStorage.getPhone();
      const savedProfession = UserStorage.getProfession();

      if (savedEmail && savedName && savedPhone) {
        const userInfo = {
          name: savedName,
          email: savedEmail,
          mobile: savedPhone,
        };
        setStoredUserInfo(userInfo);
        setUserInfoContinued(true);
      }
    };

    initializeUserInfoState();
  }, [session?.user]);

  useEffect(() => {
    form.setValue("name", currentUserInfo.name);
    form.setValue("email", currentUserInfo.email);
    form.setValue("mobile", currentUserInfo.mobile);
  }, [currentUserInfo, form]);

  const handleFieldEdit = (field: any) => {
    setIsEditing((prev: any) => ({
      ...prev,
      [field]: true,
    }));
  };

  const handleFieldSave = (field: any) => {
    const value = form.getValues(field);

    if (field === "email") {
      CheckoutStorage.saveEmail(value);
    } else if (field === "name") {
      UserStorage.saveName(value);
    } else if (field === "mobile") {
      UserStorage.savePhone(value);
    } else if (field === "profession") {
      UserStorage.saveProfession(value);
    }

    setStoredUserInfo((prev) => ({
      ...prev,
      [field]: value,
    }));

    setIsEditing((prev: any) => ({
      ...prev,
      [field]: false,
    }));
  };

  const onSubmit = async () => {
    setIsProcessing(true);
    setErrorMessage("");

    try {
      const formData = new FormData();
      formData.append("eventId", event?.id);
      formData.append("type", PurchaseType.EVENT);
      formData.append("amount", (event?.price).toString());
      formData.append("email", currentUserInfo.email);
      formData.append("name", currentUserInfo.name);
      formData.append("mobile", currentUserInfo.mobile);
      formData.append("profession", currentUserInfo.profession);

      const result: any = await handleCheckout(formData);

      if (result.success) {
        if (result?.data?.url) {
          router.push(result?.data?.url);
        } else {
          toast.success("পেমেন্ট সফলভাবে সম্পন্ন হয়েছে");
          router.refresh();
          CheckoutStorage.clearEmail();
          UserStorage.clearName();
          UserStorage.clearPhone();
          UserStorage.clearProfession();
          if (session?.user?.email) {
            router.push(`/events/${event?.slug}`);
          } else {
            router.push(`/signin`);
          }
        }
      } else {
        toast.error("দুঃখিত! পেমেন্ট সম্পন্ন করা যায়নি");
        setErrorMessage(
          result?.message || "Checkout failed. Please try again."
        );
      }
    } catch (error) {
      console.error("Checkout error:", error);
      toast.error(
        "অপ্রত্যাশিত একটি সমস্যা হয়েছে। অনুগ্রহ করে আবার চেষ্টা করুন!"
      );
      setErrorMessage("An unexpected error occurred. Please try again.");
    } finally {
      setIsProcessing(false);
    }
  };

  const renderUserInfoField = (
    field: any,
    icon: any,
    label: any,
    placeholder: any
  ) => {
    const isFieldEditing = isEditing[field];
    const value = currentUserInfo[field];
    const isSessionField =
      session?.user && (field === "name" || field === "email");

    if (!userInfoContinued) {
      return (
        <FormField
          control={form.control}
          name={field}
          render={({ field: fieldProps }) => (
            <FormItem>
              <FormLabel className="text-base font-normal">
                <RequiredFieldStar labelText={label} />
              </FormLabel>
              <FormControl>
                <Input
                  className="h-12 shadow-customInput"
                  type={
                    field === "email"
                      ? "email"
                      : field === "mobile"
                      ? "tel"
                      : "text"
                  }
                  placeholder={placeholder}
                  {...fieldProps}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
      );
    }

    return (
      <div>
        <Label className="text-base font-normal mb-2 block">
          <RequiredFieldStar labelText={label} />
        </Label>
        <div className="flex gap-2 items-center justify-between p-3 bg-white border shadow-customInput rounded-lg">
          <div className="flex items-center gap-2 w-full">
            {React.createElement(icon, {
              className: "w-4 h-4 text-brand shrink-0",
            })}
            <div className="w-full">
              {isFieldEditing ? (
                <FormField
                  control={form.control}
                  name={field}
                  render={({ field: formField }) => (
                    <FormItem className="space-y-0">
                      <FormControl>
                        <Input
                          {...formField}
                          type={
                            field === "email"
                              ? "email"
                              : field === "mobile"
                              ? "tel"
                              : "text"
                          }
                          className="text-gray-700 text-sm sm:text-base font-normal w-full outline-0 border-0 focus:ring-0 h-fit rounded-none p-0"
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              ) : (
                <Input
                  type="text"
                  readOnly
                  value={value}
                  className="text-gray-700 text-sm sm:text-base font-normal w-full overflow-x-auto outline-0 border-0 h-fit rounded-none p-0"
                />
              )}
            </div>
          </div>

          {!isSessionField && (
            <Button
              type="button"
              variant="link"
              size="sm"
              onClick={() => {
                if (isFieldEditing) {
                  handleFieldSave(field);
                } else {
                  handleFieldEdit(field);
                }
              }}
              className="text-brand h-auto p-1 hover:no-underline font-normal text-sm sm:text-base"
            >
              {isFieldEditing ? "সেভ" : "পরিবর্তন"}
            </Button>
          )}
        </div>
      </div>
    );
  };

  const isUserInfoEmpty =
    !session?.user &&
    (!storedUserInfo.name || !storedUserInfo.email || !storedUserInfo.mobile);

  return (
    <Card>
      <CardHeader>
        <CardTitle className="sm:text-2xl text-xl font-semibold">
          রেজিস্ট্রেশন ডিটেলস
        </CardTitle>
        <CardDescription className="sr-only"></CardDescription>
      </CardHeader>
      <CardContent>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
            {(session?.user || userInfoContinued) && (
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <h3 className="text-lg font-semibold">আপনার তথ্য</h3>
                </div>

                {renderUserInfoField("name", User, "নাম", "আপনার নাম লিখুন")}
                {renderUserInfoField("email", Mail, "ইমেইল", "আপনার ইমেইল দিন")}
                {renderUserInfoField(
                  "mobile",
                  Phone,
                  "মোবাইল নাম্বার",
                  "নাম্বার লিখুন"
                )}
              </div>
            )}

            {errorMessage && (
              <Alert variant="destructive">
                <AlertCircle className="h-4 w-4" />
                <AlertDescription>{errorMessage}</AlertDescription>
              </Alert>
            )}

            {!isUserInfoEmpty && (
              <div className="flex justify-between items-center mt-4 text-xl font-bold border-t pr-2.5">
                <p className="pt-2">সর্বমোট</p>
                <p className="pt-2">
                  ৳{convertNumberToBangla(event?.price || 0)}
                </p>
              </div>
            )}

            {!isUserInfoEmpty && (
              <>
                <Button
                  type="submit"
                  className="w-full bg-[#E2136E] hover:bg-[#d70d65] disabled:bg-gray-400 disabled:text-gray-200 whitespace-nowrap"
                  size="lg"
                  disabled={isProcessing || isPaymentSuccessful}
                >
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="w-10 h-10"
                    viewBox="-6.6741 -11.07275 57.8422 66.4365"
                    fill="none"
                  >
                    <g fill="none">
                      <path d="M42.31 44.291H2.182C.981 44.291 0 43.308 0 42.107V2.186C0 .982.981 0 2.182 0H42.31c1.203 0 2.184.982 2.184 2.186v39.921c0 1.201-.981 2.184-2.184 2.184" />
                      <path
                        fill="#FFF"
                        d="M31.894 24.251l-14.107-2.246 1.909 8.329zm.572-.682L21.374 8.16l-3.623 13.106zm-15.402-2.482L5.441 6.239l15.221 1.819zm-5.639-6.154l-6.449-6.08h1.695zm24.504 1.15L33.2 23.486l-4.426-6.118zM21.417 30.232l10.71-4.3.454-1.365zm-8.933 7.821l4.589-16.102 2.326 10.479zm24.099-21.914l-1.128 3.056 4.059-.07z"
                      />
                    </g>
                  </svg>
                  {isProcessing ? <>প্রক্রিয়াধীন…</> : "বিকাশে পেমেন্ট করুন"}
                </Button>
                <p className="text-sm text-gray-600 sm:text-center text-left">
                  নিরাপদ পেমেন্ট প্রসেসিং বিকাশ এর মাধ্যমে। আপনার লেনদেন
                  সুরক্ষিত।
                </p>
              </>
            )}
          </form>
        </Form>
      </CardContent>
    </Card>
  );
};

export default EventCheckoutForm;
