// @ts-nocheck
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { useState } from "react";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm, Controller } from "react-hook-form";
import { resetPassWord } from "../actions/reset-password";
import toast from "react-hot-toast";
import { Loader } from "lucide-react";
import RequiredFieldText from "@/components/common/requiredFieldText";
import RequiredFieldStar from "@/components/common/requiredFieldStar";
import { Checkbox } from "@/components/ui/checkbox";

// Define the validation schema using Zod
const schema = z
  .object({
    password: z
      .string()
      .min(6, { message: "পাসওয়ার্ড কমপক্ষে ৬ অক্ষরের হতে হবে" }),
    confirmPassword: z.string().min(6, { message: "পাসওয়ার্ড নিশ্চিত করুন।" }),
    sendCredentials: z.boolean().optional().default(false),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: "দয়া করে পাসওয়ার্ড দুটো মিলিয়ে দিন।",
    path: ["confirmPassword"],
  });

export function ResetUserPass({
  dialogOpen,
  setDialogOpen,
  userId,
}: {
  dialogOpen: boolean;
  setDialogOpen: React.Dispatch<React.SetStateAction<boolean>>;
  userId: string;
}) {
  const [loading, setloading] = useState(false);

  const form = useForm({
    resolver: zodResolver(schema),
  });

  const { control, handleSubmit } = form;

  // Handle form submission
  const onSubmit = async (data: any) => {
    setloading(true);
    try {
      // Handle the password reset logic here
      const response = await resetPassWord(
        userId,
        data.password,
        data.sendCredentials
      );
      toast.success(response?.message);
      setloading(false);
      setDialogOpen(false);
    } catch (error) {
      toast.error("Something went wrong");
      setloading(false);
      console.error("Error resetting password:", error);
    }
  };

  return (
    <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Reset Password</DialogTitle>
          <DialogDescription>
            Make sure to choose a strong password and confirm it below.
          </DialogDescription>
        </DialogHeader>
        <Form {...form}>
          <form onSubmit={handleSubmit(onSubmit)} className="grid gap-4 py-4">
            {/* Password Field */}
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

            <FormField
              control={form.control}
              name="sendCredentials"
              render={({ field }) => (
                <FormItem className="flex items-end gap-1">
                  <FormControl>
                    <Checkbox
                      checked={field.value}
                      onCheckedChange={(e) => field.onChange(e)}
                    />
                  </FormControl>
                  <FormLabel className="text-gray-500 font-normal mt-0">
                    {" "}
                    Send credentials to user via email
                  </FormLabel>
                  <FormMessage />
                </FormItem>
              )}
            />

            <DialogFooter>
              <Button type="submit">
                {loading ? (
                  <Loader className="w-4 h-4 animate-spin" />
                ) : (
                  "Update password"
                )}
              </Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}
