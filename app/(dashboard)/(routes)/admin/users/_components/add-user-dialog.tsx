// @ts-nocheck
"use client";

import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import toast from "react-hot-toast";
import { Loader, Eye, EyeOff } from "lucide-react";

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
import { Checkbox } from "@/components/ui/checkbox";
import { useRouter } from "next/navigation";
import { useDebounce } from "@/hooks/use-debounce";
import { clientApi } from "@/lib/utils/openai/client";
import { Urls } from "@/constants/urls";

// Define validation schema with Zod
const formSchema = z.object({
  name: z.string().min(1, "Name is required"),
  username: z.string().min(3, "Username must be at least 3 characters"),
  email: z.string().email("Invalid email format"),
  password: z.string().min(6, "পাসওয়ার্ড কমপক্ষে ৬ অক্ষরের হতে হবে"),
  sendCredentials: z.boolean().optional(),
});

interface AddUserDialogProps {
  open: boolean;
  setOpen: React.Dispatch<React.SetStateAction<boolean>>;
}

const AddUserDialog: React.FC<AddUserDialogProps> = ({ open, setOpen }) => {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [usernameAvailability, setUsernameAvailability] = useState("");
  const [passwordVisible, setPasswordVisible] = useState(false);
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
    reset,
    watch,
    formState: { errors, isValid, isDirty },
    clearErrors,
  } = useForm({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: "",
      email: "",
      username: "",
      password: "",
      sendCredentials: false,
    },
  });

  const generatePassword = () => {
    const password = Math.random().toString(36).slice(-10);
    setValue("password", password, { shouldValidate: true });
  };

  const debouncedUsernameText = useDebounce(watch("username"), 500);

  useEffect(() => {
    const checkUsernameAvailability = async () => {
      if (debouncedUsernameText.length >= 3) {
        try {
          const response = await fetch(Urls.auth.checkUsername, {
            body: JSON.stringify({ username: debouncedUsernameText }),
            method: "POST",
          });
          const data = await response.json();

          if (data.isAvailable) {
            setUsernameAvailability("Username is available");
          } else {
            setUsernameAvailability("Username is already taken");
          }
        } catch (error) {
          setUsernameAvailability("Error checking username availability");
        }
      } else {
        setUsernameAvailability("");
      }
    };

    checkUsernameAvailability();
  }, [debouncedUsernameText]);

  const onSubmit = async (data) => {
    setLoading(true);
    try {
      const res = await fetch(Urls.auth.addUser, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      });

      const response = await res.json();

      if (res.ok) {
        setMailFormData(data);
        reset();
        setUsernameAvailability("");
        toast.success("User added and send credentials to user email!");
        setOpen(false); // Close the dialog after successful submission
        router.refresh();
      } else {
        const error = await res.json();
        toast.error(error?.error || "Something went wrong. Try again!");
      }
    } catch (error) {
      console.error("Error creating user:", error);
      toast.error("Failed to create user.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <Dialog
      open={open}
      onOpenChange={() => {
        setOpen(false);
        clearErrors();
        reset();
        setUsernameAvailability("");
      }}
    >
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Add User</DialogTitle>
          <DialogDescription>
            Please fill out the form to add a new user.
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
          <div>
            <RequiredFieldStar labelText="Name" />
            <Input
              id="name"
              {...register("name")}
              placeholder="Enter user's name"
            />
            {errors.name && (
              <p className="mt-1 text-sm text-red-500">{errors.name.message}</p>
            )}
          </div>

          <div>
            <RequiredFieldStar labelText="Username" />
            <Input
              id="username"
              {...register("username")}
              placeholder="Enter username"
            />
            {errors.username && (
              <p className="mt-1 text-sm text-red-500">
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
              <p className="mt-1 text-sm text-red-500">
                {errors.email.message}
              </p>
            )}
          </div>

          <div>
            <RequiredFieldStar labelText="Password" />
            <div className="flex gap-2 items-center">
              <div className="relative w-full">
                <Input
                  id="password"
                  type={passwordVisible ? "text" : "password"}
                  {...register("password")}
                  placeholder="Enter password"
                  className="pr-10 border rounded-md focus:ring-0 focus:outline-none w-full"
                />
                <button
                  type="button"
                  onClick={() => setPasswordVisible(!passwordVisible)}
                  className="absolute inset-y-0 right-1 flex items-center px-2"
                >
                  {passwordVisible ? (
                    <EyeOff className="text-slate-500" size={16} />
                  ) : (
                    <Eye className="text-slate-500" size={16} />
                  )}
                </button>
              </div>

              <Button
                type="button"
                variant={"outline"}
                onClick={generatePassword}
              >
                Generate
              </Button>
            </div>
            {errors.password && (
              <p className="mt-1 text-sm text-red-500">
                {errors.password.message}
              </p>
            )}
          </div>

          <div className="flex items-start gap-1">
            <Checkbox
              id="sendCredentials"
              {...register("sendCredentials")}
              onCheckedChange={(value) => {
                setValue("sendCredentials", value);
              }}
            />
            <label
              className="cursor-pointer text-sm font-normal text-muted-foreground"
              htmlFor="sendCredentials"
            >
              Send credentials to the email
            </label>
          </div>

          <div className="flex gap-2 justify-end">
            {isDirty && (
              <Button
                variant="secondary"
                type="button"
                onClick={() => {
                  setOpen(false);
                  clearErrors();
                  reset();
                  setUsernameAvailability("");
                }}
              >
                Cancel
              </Button>
            )}

            <Button
              type="submit"
              disabled={loading || !usernameAvailability.includes("available")}
            >
              {loading ? <Loader className="w-4 h-4 animate-spin" /> : "Create"}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
};

export default AddUserDialog;
