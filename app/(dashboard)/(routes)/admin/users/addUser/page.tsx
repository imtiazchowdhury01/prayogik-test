// @ts-nocheck
"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import toast from "react-hot-toast";
import { Loader } from "lucide-react";

import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import RequiredFieldText from "@/components/common/requiredFieldText";
import RequiredFieldStar from "@/components/common/requiredFieldStar";

// Define validation schema with Zod
const formSchema = z.object({
  name: z.string().min(1, "Name is required"),
  username: z.string().min(3, "Username must be at least 3 characters"),
  email: z.string().email("Invalid email format"),
  password: z.string().min(6, "পাসওয়ার্ড কমপক্ষে ৬ অক্ষরের হতে হবে"),
});

const AddTeacher = () => {
  const [teacherCreated, setTeacherCreated] = useState(false);
  const [loading, setLoading] = useState(false);
  const [dialogVisible, setDialogVisible] = useState(false);
  const [usernameAvailability, setUsernameAvailability] = useState("");
  const [mailFormData, setMailFormData] = useState({
    name: "",
    username: "",
    email: "",
    password: "",
  });

  // Initialize React Hook Form with Zod resolver
  const {
    register,
    handleSubmit,
    setValue,
    getValues,
    reset,
    formState: { errors, isValid },
  } = useForm({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: "",
      email: "",
      username: "",
      password: "",
    },
  });

  const generatePassword = () => {
    const password = Math.random().toString(36).slice(-10);
    setValue("password", password, { shouldValidate: true });
  };

  const checkUsernameAvailability = async (username) => {
    if (username.length >= 3) {
      try {
        const response = await fetch(`/api/auth/check-username`, {
          body: JSON.stringify({ username }),
          method: "POST",
        });
        const data = await response.json();

        if (data.isAvailable) {
          setUsernameAvailability("ইউজারনেমটি ব্যবহারযোগ্য।");
        } else {
          setUsernameAvailability("Username is already taken");
        }
      } catch (error) {
        setUsernameAvailability("Error checking username availability");
      }
    }
  };

  const onSubmit = async (data) => {
    setLoading(true);
    try {
      const res = await fetch("/api/auth/signup", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      });

      if (res.ok) {
        setDialogVisible(true);
        setTeacherCreated(true);
        setMailFormData(data);
        reset();
        setUsernameAvailability("");
      } else {
        const error = await res.json();
        toast.error("Something went wrong. Try again!!");
      }
    } catch (error) {
      console.error("Error creating user:", error);
    } finally {
      setLoading(false);
    }
  };

  const sendCredentialsEmail = async () => {
    try {
      const res = await fetch("/api/auth/send-credential", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(mailFormData),
      });

      if (res.ok) {
        const data = await res.json();
        toast.success(data.message);
      } else {
        const error = await res.json();
        toast.error(error.error);
      }
    } catch (error) {
      console.error("Error sending email:", error);
      toast.error("Failed to send email. Please try again.");
    }
  };

  return (
    <div className="flex items-center justify-center min-h-screen">
      <div className="w-full max-w-xl p-6 bg-white rounded shadow">
        <h1 className="text-xl font-bold mb-4">Add User</h1>
        <RequiredFieldText />
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          <div>
            <RequiredFieldStar labelText="Name" />
            <Input
              id="name"
              {...register("name", {
                onChange: (e) => {
                  // Additional onChange logic if needed
                },
              })}
              placeholder="Enter user's name"
            />
            {errors.name && (
              <p className="text-red-500 text-sm mt-1">{errors.name.message}</p>
            )}
          </div>

          <div>
            <RequiredFieldStar labelText="Username" />
            <Input
              id="username"
              {...register("username", {
                onChange: (e) => {
                  checkUsernameAvailability(e.target.value);
                },
              })}
              placeholder="Enter username"
            />
            {errors.username && (
              <p className="text-red-500 text-sm mt-1">
                {errors.username.message}
              </p>
            )}
            {usernameAvailability && (
              <p
                className={`mt-1 text-sm ${
                  usernameAvailability.includes("available")
                    ? "text-green-500"
                    : "text-red-500"
                }`}
              >
                {usernameAvailability}
              </p>
            )}
          </div>

          <div>
            <RequiredFieldStar labelText="Email" />
            <Input
              id="email"
              {...register("email")}
              placeholder="Enter user's email"
            />
            {errors.email && (
              <p className="text-red-500 text-sm mt-1">
                {errors.email.message}
              </p>
            )}
          </div>

          <div>
            <RequiredFieldStar labelText="Password" />
            <div className="flex gap-2">
              <Input
                id="password"
                type="password"
                {...register("password")}
                placeholder="Enter password"
              />
              <Button type="button" onClick={generatePassword}>
                Generate
              </Button>
            </div>
            {errors.password && (
              <p className="text-red-500 text-sm mt-1">
                {errors.password.message}
              </p>
            )}
          </div>

          <div className="flex gap-4">
            <Button
              type="submit"
              disabled={loading || !usernameAvailability.includes("available")}
            >
              {loading ? <Loader className="w-4 h-4 animate-spin" /> : "Create"}
            </Button>
          </div>
        </form>
      </div>

      <Dialog
        open={dialogVisible}
        onOpenChange={(open) => {
          setDialogVisible(open);
        }}
      >
        <DialogContent>
          <DialogHeader>
            <DialogTitle>User Added Request is processed!</DialogTitle>
            <DialogDescription>
              The verification mail is sending to user's mail address for
              verification.
            </DialogDescription>
          </DialogHeader>

          <DialogFooter className="sm:justify-start">
            <DialogClose asChild>
              <Button
                type="button"
                variant="secondary"
                onClick={() => {
                  setDialogVisible(false);
                }}
              >
                Close
              </Button>
            </DialogClose>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default AddTeacher;
