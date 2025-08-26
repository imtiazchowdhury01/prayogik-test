// @ts-nocheck
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Form,
  FormControl,
  FormField,
  FormMessage,
} from "@/components/ui/form";
import { useState } from "react";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
// import { resetPassWord } from "../actions/reset-password";
import toast from "react-hot-toast";
import { Loader } from "lucide-react";
import RequiredFieldStar from "@/components/common/requiredFieldStar";
import { useSession } from "next-auth/react";
import { clientApi } from "@/lib/utils/openai/client";
// Define the validation schema using Zod
const schema = z
  .object({
    oldPassword: z
      .string()
      .min(6, { message: "Password must be at least 6 characters long" }),
    password: z
      .string()
      .min(6, { message: "Password must be at least 6 characters long" }),
    confirmPassword: z.string().min(6, {
      message: "Confirm password must be at least 6 characters long",
    }),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: "Passwords do not match",
    path: ["confirmPassword"],
  });

// ResetProfileUserPass component for changing user password
export function ResetProfileUserPass() {
  const {
    data: {
      user: { id: userId },
    },
  } = useSession();
  const [loading, setloading] = useState(false);

  const form = useForm({
    resolver: zodResolver(schema),
  });

  const { control, handleSubmit } = form;

  const onSubmit = async (data: any) => {
    setloading(true);
    try {
      // Call the API to reset the password
      const response = await clientApi.resetProfilePassword({
        body: {
          oldPassword: data.oldPassword,
          newPassword: data.password,
        },
        extraHeaders: {
          Cookie: document.cookie,
        },
      });
      // Check the response status and handle accordingly
      if (response.status === 200) {
        toast.success(response.body.message);
        form.reset({
          oldPassword: "",
          password: "",
          confirmPassword: "",
        });
      } else {
        throw new Error(response.body.error || "Failed to reset password");
      }
    } catch (error) {
      // Handle errors and show a toast notification
      toast.error(error.message || "Something went wrong");
      console.error("Error resetting password:", error);
    } finally {
      setloading(false);
    }
  };

  return (
    <div className="bg-white border p-6 rounded-lg mt-8 shadow-md">
      <div className="flex items-start gap-4 justify-between">
        <h1 className="text-2xl font-bold">Change Password</h1>
      </div>
      <hr className="border-gray-200 my-2" />

      <>
        <Form {...form}>
          <form onSubmit={handleSubmit(onSubmit)} className="grid gap-4 py-4">
            {/* Old Password Field */}
            <FormField
              control={control}
              name="oldPassword"
              render={({ field }) => (
                <div>
                  <Label htmlFor="oldPassword" className="text-right">
                    <RequiredFieldStar
                      className={"text-left mb-1"}
                      labelText={"Old Password"}
                    />
                  </Label>
                  <FormControl>
                    <Input
                      id="oldPassword"
                      type="password"
                      {...field}
                      className="col-span-3"
                    />
                  </FormControl>
                  <FormMessage />
                </div>
              )}
            />

            {/* New Password Field */}
            <FormField
              control={control}
              name="password"
              render={({ field }) => (
                <div>
                  <Label htmlFor="password" className="text-right">
                    <RequiredFieldStar
                      className={"text-left mb-1"}
                      labelText={"New Password"}
                    />
                  </Label>
                  <FormControl>
                    <Input
                      id="password"
                      type="password"
                      {...field}
                      className="col-span-3"
                    />
                  </FormControl>
                  <FormMessage />
                </div>
              )}
            />

            {/* Confirm Password Field */}
            <FormField
              control={control}
              name="confirmPassword"
              render={({ field }) => (
                <div>
                  <Label htmlFor="confirmPassword" className="text-right">
                    <RequiredFieldStar
                      className={"text-left mb-1"}
                      labelText={"Confirm Password"}
                    />
                  </Label>
                  <FormControl>
                    <Input
                      id="confirmPassword"
                      type="password"
                      {...field}
                      className="col-span-3"
                    />
                  </FormControl>
                  <FormMessage />
                </div>
              )}
            />

            <div className="flex justify-end mt-4">
              <Button
                type="submit"
                disabled={
                  loading || !form.formState.isDirty || !form.formState.isValid
                }
                className={
                  !form.formState.isValid || !form.formState.isDirty
                    ? "bg-gray-400"
                    : ""
                }
              >
                {loading ? (
                  <Loader className="w-4 h-4 animate-spin" />
                ) : (
                  "Update password"
                )}
              </Button>
            </div>
          </form>
        </Form>
      </>
    </div>
  );
}
