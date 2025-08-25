import { Button } from "@/components/ui/button";
import { DialogFooter } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { CalendarDays, RefreshCw, Save, X } from "lucide-react";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";

// Define form schema
const formSchema = z.object({
  name: z.string().min(1, "Name is required").optional(),
  email: z.string().email("Invalid email address").optional(),
  status: z
    .enum(["ACTIVE", "INACTIVE", "EXPIRED", "CANCELLED", "PENDING"])
    .optional(),
  subscriptionCreatedAt: z
    .string()
    .refine((val) => !isNaN(new Date(val).getTime()), {
      message: "Invalid date format",
    }),
  subscriptionExpiresAt: z
    .string()
    .refine((val) => !isNaN(new Date(val).getTime()), {
      message: "Invalid date format",
    }),
});

type EditSubscribersFormProps = {
  handleEditSubmit: (values: z.infer<typeof formSchema>) => void;
  editForm: z.infer<typeof formSchema>;
  setEditDialogOpen: (open: boolean) => void;
  editLoading: boolean;
};

const EditSubscribersForm = ({
  handleEditSubmit,
  editForm,
  setEditDialogOpen,
  editLoading,
}: EditSubscribersFormProps) => {
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: editForm,
  });

  return (
    <Form {...form}>
      <form
        onSubmit={form.handleSubmit(handleEditSubmit)}
        className="space-y-6"
      >
        <div className="grid grid-cols-1 gap-4">
          {/* Name Field */}
          <FormField
            control={form.control}
            name="name"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Full Name</FormLabel>
                <FormControl>
                  <Input
                    {...field}
                    readOnly
                    placeholder="Enter full name"
                    className="bg-gray-100 focus-visible:ring-0 focus-visible:outline-none focus:ring-0 focus:border-0 focus-visible:border-0"
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          {/* Email Field */}
          <FormField
            control={form.control}
            name="email"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Email Address</FormLabel>
                <FormControl>
                  <Input
                    {...field}
                    readOnly
                    placeholder="Enter email address"
                    className="bg-gray-100 focus-visible:ring-0 focus-visible:outline-none focus:ring-0 focus:border-0 focus-visible:border-0"
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          {/* Status Field */}
          <FormField
            control={form.control}
            name="status"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Subscription Status</FormLabel>
                <Select onValueChange={field.onChange} value={field.value}>
                  <FormControl>
                    <SelectTrigger>
                      <SelectValue placeholder="Select status" />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent>
                    <SelectItem value="ACTIVE">Active</SelectItem>
                    <SelectItem value="INACTIVE">Inactive</SelectItem>
                    <SelectItem value="EXPIRED">Expired</SelectItem>
                    <SelectItem value="CANCELLED">Cancelled</SelectItem>
                    <SelectItem value="PENDING">Pending</SelectItem>
                  </SelectContent>
                </Select>
                <FormMessage />
              </FormItem>
            )}
          />

          {/* Date Fields Row */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <FormField
              control={form.control}
              name="subscriptionCreatedAt"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="flex items-center gap-2">
                    <CalendarDays className="h-4 w-4" />
                    Subscribed On
                  </FormLabel>
                  <FormControl>
                    <Input
                      type="datetime-local"
                      readOnly
                      {...field}
                      value={field.value || ""}
                      className="bg-gray-100 focus-visible:ring-0 focus-visible:outline-none focus:ring-0 focus:border-0 focus-visible:border-0"
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="subscriptionExpiresAt"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="flex items-center gap-2">
                    <CalendarDays className="h-4 w-4" />
                    Expires On
                  </FormLabel>
                  <FormControl>
                    <Input
                      type="datetime-local"
                      {...field}
                      value={field.value || ""}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>
        </div>

        <DialogFooter className="flex gap-2 pt-4">
          <Button
            type="button"
            variant="outline"
            onClick={() => setEditDialogOpen(false)}
            disabled={editLoading}
          >
            <X className="h-4 w-4 mr-2" />
            Cancel
          </Button>
          <Button
            type="submit"
            disabled={editLoading}
            className="min-w-[100px]"
          >
            {editLoading ? (
              <RefreshCw className="h-4 w-4 mr-2 animate-spin" />
            ) : (
              <Save className="h-4 w-4 mr-2" />
            )}
            {editLoading ? "Saving..." : "Save"}
          </Button>
        </DialogFooter>
      </form>
    </Form>
  );
};

export default EditSubscribersForm;
