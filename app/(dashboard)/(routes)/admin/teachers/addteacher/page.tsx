// @ts-nocheck
"use client";

import { useState, useEffect } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
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
  DialogDescription,
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

// Define the schema for form validation
const teacherSchema = z.object({
  name: z.string().min(1, "Teacher name is required"),
  email: z.string().email("Valid email is required"),
  password: z.string().min(6, "পাসওয়ার্ড কমপক্ষে ৬ অক্ষরের হতে হবে"),
  teacherRankId: z.string().min(1, "Teacher rank is required"),
});

type TeacherFormValues = z.infer<typeof teacherSchema>;

const AddTeacher = () => {
  const [loading, setLoading] = useState(false);
  const [dialogVisible, setDialogVisible] = useState(false);
  const [ranks, setRanks] = useState([]);
  const [createdTeacher, setCreatedTeacher] = useState(null);
  const [emailSent, setEmailSent] = useState(false);

  // Initialize React Hook Form
  const form = useForm<TeacherFormValues>({
    resolver: zodResolver(teacherSchema),
    defaultValues: {
      name: "",
      email: "",
      password: "",
      teacherRankId: "",
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
        console.error("Error fetching ranks:", error);
        toast.error("Failed to load teacher ranks");
      }
    };

    fetchRanks();
  }, [form]);

  const generatePassword = () => {
    const password = Math.random().toString(36).slice(-10);
    form.setValue("password", password, { shouldValidate: true });
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
        const newTeacher = await res.json();
        setCreatedTeacher(data);

        // Send credentials email automatically
        await sendCredentialsEmail(data);

        // Show success dialog
        setDialogVisible(true);

        // Reset form
        form.reset({
          name: "",
          email: "",
          password: "",
          teacherRankId: ranks.length > 0 ? ranks[0].id : "",
        });
      } else {
        const error = await res.json();
        toast.error(error.message || "Failed to create teacher");
      }
    } catch (error) {
      console.error("Error creating teacher:", error);
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

      if (res.ok) {
        const data = await res.json();
        setEmailSent(true);
      } else {
        const error = await res.json();
        toast.error(error.error || "Failed to send email");
      }
    } catch (error) {
      console.error("Error sending email:", error);
      toast.error("Failed to send email. Please try again.");
    }
  };

  return (
    <div className="flex items-center justify-center min-h-screen">
      <div className="w-full max-w-xl p-6 bg-white rounded shadow">
        <h1 className="text-xl font-bold mb-4">Add Teacher</h1>
        <RequiredFieldText />

        <Form {...form}>
          <form
            onSubmit={form.handleSubmit(handleFormSubmit)}
            className="space-y-4"
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
                        type="text" // Using text type to show generated password
                        placeholder="Enter password"
                      />
                    </FormControl>
                    <Button type="button" onClick={generatePassword}>
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

            <Button type="submit" disabled={loading} className="w-full">
              {loading ? (
                <Loader className="w-4 h-4 animate-spin mr-2" />
              ) : (
                "Create Teacher"
              )}
            </Button>
          </form>
        </Form>
      </div>

      <Dialog open={dialogVisible} onOpenChange={setDialogVisible}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Teacher Added Successfully</DialogTitle>
          </DialogHeader>
          <DialogDescription className="">
            {emailSent
              ? "Login credentials have been sent to the teacher's email."
              : "Teacher has been created successfully."}
          </DialogDescription>
          <DialogFooter className="flex justify-center">
            <Button
              onClick={() => {
                setDialogVisible(false);
              }}
            >
              Close
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default AddTeacher;
