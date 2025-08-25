// @ts-nocheck
"use client";

import { useState, useEffect } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import toast from "react-hot-toast";
import { Loader } from "lucide-react";
import RequiredFieldText from "@/components/common/requiredFieldText";
import RequiredFieldStar from "@/components/common/requiredFieldStar";
import {
  Form,
  FormField,
  FormItem,
  FormLabel,
  FormControl,
  FormMessage,
} from "@/components/ui/form";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Checkbox } from "@/components/ui/checkbox";
import { useRouter } from "next/navigation";
import { revalidatePage } from "@/actions/revalidatePage";

const teacherSchema = z.object({
  name: z.string().min(1, "Teacher name is required"),
  email: z.string().email("Valid email is required"),
  password: z.string().min(6, "পাসওয়ার্ড কমপক্ষে ৬ অক্ষরের হতে হবে"),
  teacherRankId: z.string().min(1, "Teacher rank is required"),
  sendCredentials: z.boolean().optional(),
});

type TeacherFormValues = z.infer<typeof teacherSchema>;

const AddTeacher = ({ open, setOpen }) => {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [ranks, setRanks] = useState([]);
  const [emailSent, setEmailSent] = useState(false);

  const form = useForm<TeacherFormValues>({
    resolver: zodResolver(teacherSchema),
    defaultValues: {
      name: "",
      email: "",
      password: "",
      teacherRankId: "",
      sendCredentials: false,
    },
  });

  useEffect(() => {
    const fetchRanks = async () => {
      try {
        const response = await fetch("/api/teacher/ranks");
        const data = await response.json();
        setRanks(data);
        if (data.length > 0) {
          form.setValue("teacherRankId", data[0].id);
        }
      } catch (error) {
        toast.error("Failed to load teacher ranks");
      }
    };
    fetchRanks();
  }, [form]);

  const generatePassword = () => {
    form.setValue("password", Math.random().toString(36).slice(-10), {
      shouldValidate: true,
    });
  };

  const handleFormSubmit = async (data: TeacherFormValues) => {
    setLoading(true);
    try {
      const res = await fetch("/api/auth/addteacher", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      });
      if (res.ok) {
        // await sendCredentialsEmail(data);
        setEmailSent(true);

        // Reset form
        form.reset({
          name: "",
          email: "",
          password: "",
          teacherRankId: ranks.length > 0 ? ranks[0].id : "",
          sendCredentials: false,
        });
        setOpen(false);
        toast.success(
          "Teacher added successfully and send credentials to user email!"
        );
        await revalidatePage([
          {
            route: "/",
            type: "layout",
          },
          {
            route: "/teachers",
            type: "page",
          },
        ]);
        router.refresh();
      } else {
        const error = await res.json();
        toast.error(error?.error || "Failed to create teacher");
      }
    } catch {
      toast.error("An error occurred while creating the teacher");
    } finally {
      setLoading(false);
    }
  };

  const sendCredentialsEmail = async (teacherData) => {
    try {
      setEmailSent(false);
      const res = await fetch("/api/auth/send-credential", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(teacherData),
      });
      if (!res.ok) {
        toast.error("Failed to send email");
      }
    } catch {
      toast.error("Failed to send email. Please try again.");
    }
  };

  return (
    <Dialog
      open={open}
      onOpenChange={() => {
        setOpen(false);
        form.reset({ teacherRankId: ranks[0].id });
        form.clearErrors();
      }}
    >
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Add Teacher</DialogTitle>
          <RequiredFieldText />
        </DialogHeader>
        <Form {...form}>
          <form
            onSubmit={form.handleSubmit(handleFormSubmit)}
            className="space-y-6"
          >
            <FormField
              control={form.control}
              name="name"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>
                    <RequiredFieldStar labelText="Name" />
                  </FormLabel>
                  <FormControl>
                    <Input {...field} placeholder="Enter teacher's name" />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="email"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>
                    <RequiredFieldStar labelText="Email" />
                  </FormLabel>
                  <FormControl>
                    <Input {...field} placeholder="Enter teacher's email" />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="password"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>
                    <RequiredFieldStar labelText="Password" />
                  </FormLabel>
                  <div className="flex gap-2">
                    <FormControl>
                      <Input
                        {...field}
                        type="text"
                        placeholder="Enter password"
                      />
                    </FormControl>
                    <Button
                      type="button"
                      variant={"outline"}
                      onClick={generatePassword}
                    >
                      Generate
                    </Button>
                  </div>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="teacherRankId"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>
                    <RequiredFieldStar labelText="Teacher Rank" />
                  </FormLabel>
                  <FormControl>
                    <Select
                      onValueChange={field.onChange}
                      defaultValue={field.value}
                      value={field.value}
                      disabled
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Select teacher rank" />
                      </SelectTrigger>
                      <SelectContent>
                        {ranks.map((rank) => (
                          <SelectItem key={rank.id} value={rank.id}>
                            {rank.name} - ({rank.feePercentage}%)
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="sendCredentials"
              render={({ field }) => (
                <FormItem className="flex items-center gap-1">
                  <FormControl>
                    <Checkbox
                      className="mt-1"
                      checked={field.value}
                      onCheckedChange={(e) => field.onChange(e)}
                    />
                  </FormControl>
                  <FormLabel className="cursor-pointer font-normal text-sm text-muted-foreground">
                    Send credentials to the email
                  </FormLabel>
                  <FormMessage />
                </FormItem>
              )}
            />

            <div className="flex gap-2 items-center justify-end">
              {form.formState.isDirty && (
                <Button
                  variant={"secondary"}
                  type="button"
                  onClick={() => {
                    setOpen(false);
                    form.reset({ teacherRankId: ranks[0].id });
                    form.clearErrors();
                  }}
                >
                  Cancel
                </Button>
              )}
              <Button type="submit" disabled={loading} className="">
                {loading ? (
                  <Loader className="w-4 h-4 animate-spin" />
                ) : (
                  "Create"
                )}
              </Button>
            </div>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
};

export default AddTeacher;
