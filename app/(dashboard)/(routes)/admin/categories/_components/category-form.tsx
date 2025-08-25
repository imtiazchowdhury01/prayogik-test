// @ts-nocheck
import { createCategoryByAdmin, updateCategoryByAdmin } from "@/services/admin";
import RequiredFieldStar from "@/components/common/requiredFieldStar";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Checkbox } from "@/components/ui/checkbox";
import { zodResolver } from "@hookform/resolvers/zod";
import { Loader } from "lucide-react";
import { useRouter } from "next/navigation";
import { useState, useEffect } from "react";
import { useForm } from "react-hook-form";
import toast from "react-hot-toast";
import * as z from "zod";

const categorySchema = z
  .object({
    name: z.string().min(1, "Name is required"),
    slug: z.string().min(1, "Slug is required"),
    isChild: z.boolean().default(false),
    parentCategoryId: z.string().optional(),
  })
  .refine(
    (data) => {
      // If isChild is true, parentCategoryId must be provided
      if (data.isChild && !data.parentCategoryId) {
        return false;
      }
      return true;
    },
    {
      message: "Parent category is required when category is a child",
      path: ["parentCategoryId"],
    }
  );

type CategoryFormValues = z.infer<typeof categorySchema>;

type Category = {
  id: string;
  name: string;
  slug: string;
  isChild: boolean;
  parentCategoryId?: string;
};

type CategoryDialogProps = {
  initialData?: CategoryFormValues & { id?: string };
  open: boolean;
  setOpen: (open: boolean) => void;
  categories: any[];
};

export function CategoryDialog({
  initialData,
  open,
  setOpen,
  categories,
}: CategoryDialogProps) {
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  const form = useForm<CategoryFormValues>({
    resolver: zodResolver(categorySchema),
    defaultValues: initialData || {
      name: "",
      slug: "",
      isChild: false,
      parentCategoryId: undefined,
    },
  });

  const isChildValue = form.watch("isChild");

  // Filter parent categories (exclude current category if editing)
  const availableParentCategories = categories?.filter((category) => {
    // Don't show the current category being edited as a potential parent
    if (initialData?.id && category.id === initialData.id) return false;
    return true;
  });

  // Reset parentCategoryId when isChild changes to false
  useEffect(() => {
    if (!isChildValue) {
      form.setValue("parentCategoryId", undefined);
    }
  }, [isChildValue, form]);

  const handleFormSubmit = async (data: CategoryFormValues) => {
    setLoading(true);
    try {
      // Clean up data - remove parentCategoryId if not a child
      const cleanedData = {
        ...data,
        parentCategoryId: data.isChild ? data.parentCategoryId : null,
      };

      let temp = initialData?.id
        ? { id: initialData.id, ...cleanedData }
        : cleanedData;

      const response = initialData?.id
        ? await updateCategoryByAdmin(temp)
        : await createCategoryByAdmin(temp);

      setOpen(false);
      form.reset();
      router.refresh();
      toast.success("Category saved successfully");
    } catch (error) {
      toast.error(error?.message || "An unexpected error occurred");
      console.error("Error:", error);
    } finally {
      setLoading(false);
    }
  };

  // Helper function to generate slug from name
  const generateSlug = (name: string) => {
    return name
      .toLowerCase()
      .replace(/\s+/g, "-")
      .replace(/[^\w-]+/g, "");
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogContent className="max-w-md">
        <DialogHeader>
          <DialogTitle>
            {initialData ? "Edit Category" : "Create Category"}
          </DialogTitle>
          <DialogDescription>
            {initialData
              ? "Update the category details below"
              : "Fill in the details below to create a new category"}
          </DialogDescription>
        </DialogHeader>

        <Form {...form}>
          <form
            onSubmit={form.handleSubmit(handleFormSubmit)}
            className="space-y-4 mt-3"
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
                    <Input
                      {...field}
                      placeholder="Enter category name"
                      onChange={(e) => {
                        field.onChange(e);
                        // Auto-generate slug if no slug exists or if slug matches previous auto-generated value
                        const currentSlug = form.getValues("slug");
                        const previousName = field.value;
                        const previousAutoSlug = generateSlug(previousName);

                        if (!currentSlug || currentSlug === previousAutoSlug) {
                          form.setValue("slug", generateSlug(e.target.value), {
                            shouldValidate: true,
                          });
                        }
                      }}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="slug"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>
                    <RequiredFieldStar labelText="Slug" />
                  </FormLabel>
                  <FormControl>
                    <Input {...field} placeholder="Enter category slug" />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="isChild"
              render={({ field }) => (
                <FormItem className="flex flex-row items-start space-x-3 space-y-0">
                  <FormControl>
                    <Checkbox
                      checked={field.value}
                      onCheckedChange={field.onChange}
                    />
                  </FormControl>
                  <div className="space-y-1 leading-none">
                    <FormLabel>Set under parent category</FormLabel>
                  </div>
                  <FormMessage />
                </FormItem>
              )}
            />

            {isChildValue && (
              <FormField
                control={form.control}
                name="parentCategoryId"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>
                      <RequiredFieldStar labelText="Parent Category" />
                    </FormLabel>
                    <Select onValueChange={field.onChange} value={field.value}>
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="Select parent category" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        {availableParentCategories &&
                        availableParentCategories.length > 0 ? (
                          availableParentCategories.map((category) => (
                            <SelectItem key={category.id} value={category.id}>
                              {category.name}
                            </SelectItem>
                          ))
                        ) : (
                          <SelectItem value="" disabled>
                            No parent categories available
                          </SelectItem>
                        )}
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />
            )}

            <DialogFooter>
              <Button
                type="submit"
                disabled={!form.formState.isDirty || loading}
              >
                {loading ? (
                  <Loader className="w-4 h-4 animate-spin " />
                ) : initialData ? (
                  "Save Changes"
                ) : (
                  "Create"
                )}
              </Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}
