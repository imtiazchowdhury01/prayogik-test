// @ts-nocheck
"use client";

import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Drawer } from "@/components/ui/drawer";
import DrawerBody from "@/components/drawerBody/drawer-body";
import { Skeleton } from "@/components/ui/skeleton";
import {
  Calendar1,
  CreditCard,
  Mail,
  MoreHorizontal,
  RefreshCw,
  Smartphone,
  User,
  Save,
  X,
  CalendarDays,
} from "lucide-react";
import { useRouter } from "next/navigation";
import { useState, useRef, useCallback } from "react";
import { clientApi } from "@/lib/utils/openai/client";
import { Calendar } from "@/components/ui/calendar";
import EditSubscribersForm from "./EditSubscribersForm";
import toast from "react-hot-toast";

export function DataTableRowActions({ row }) {
  // const userId = "67a9cc1ea9aed02d3c62b6c4";
  const userId = row.original.userId;
  const [dialogVisible, setDialogVisible] = useState(false);
  const [editDialogOpen, setEditDialogOpen] = useState(false);
  const [drawerOpen, setDrawerOpen] = useState(false);
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const [resetPassIdDialogOpen, setresetPassIdDialogOpen] = useState();
  const [resetPassUserId, setresetPassUserId] = useState("");
  const [loading, setLoading] = useState(false);
  const [resetPassLoading, setresetPassLoading] = useState(false);
  const [editLoading, setEditLoading] = useState(false);
  const [paymentDetails, setPaymentDetails] = useState(null);
  const [title, setTitle] = useState("Payment Details");

  // Form state for editing
  const [editForm, setEditForm] = useState({
    name: "",
    email: "",
    status: "",
    subscriptionExpiresAt: "",
    subscriptionCreatedAt: "",
  });

  // Ref for the dropdown trigger to manage focus
  const triggerRef = useRef(null);

  // Helper function to format date for input
  const formatDateForInput = (dateString) => {
    if (!dateString) return "";
    try {
      const date = new Date(dateString);

      // Get local date components
      const year = date.getFullYear();
      const month = String(date.getMonth() + 1).padStart(2, "0");
      const day = String(date.getDate()).padStart(2, "0");
      const hours = String(date.getHours()).padStart(2, "0");
      const minutes = String(date.getMinutes()).padStart(2, "0");

      return `${year}-${month}-${day}T${hours}:${minutes}`;
    } catch (error) {
      console.error("Error formatting date for input:", error);
      return "";
    }
  };
  // Helper function to format date for display
  const formatDateForDisplay = (dateString) => {
    if (!dateString) return "Not set";
    try {
      const date = new Date(dateString);
      return date.toLocaleString("en-US", {
        year: "numeric",
        month: "short",
        day: "numeric",
        hour: "2-digit",
        minute: "2-digit",
      });
    } catch (error) {
      console.error("Error formatting date for display:", error);
      return "Invalid date";
    }
  };

  const handleEdit = (subscriber) => {
    // console.log("subscriber result:", subscriber);
    // Populate form with existing user data
    setEditForm({
      name: subscriber.name || "",
      email: subscriber.email || "",
      status: subscriber.subscriptionStatus || "",
      subscriptionExpiresAt: formatDateForInput(
        subscriber.subscriptionExpiresAt
      ),
      subscriptionCreatedAt: formatDateForInput(
        subscriber.subscriptionCreatedAt
      ),
    });
    setEditDialogOpen(true);
  };
  const router = useRouter();

  const handleEditSubmit = async (values: z.infer<typeof formSchema>) => {
    const subscriberId = row.original.id;
    setEditLoading(true);

    try {
      // Validate subscription ID on client side
      if (!subscriberId || subscriberId.length !== 24) {
        throw new Error("Invalid subscription ID");
      }

      // Format dates back to ISO string before sending
      const formData = {
        status: values.status,
        subscriptionExpiresAt: values.subscriptionExpiresAt
          ? new Date(values.subscriptionExpiresAt).toISOString()
          : null,
        subscriptionCreatedAt: values.subscriptionCreatedAt
          ? new Date(values.subscriptionCreatedAt).toISOString()
          : null,
      };

      // console.log("Subscriber ID:", subscriberId);
      // console.log("FormData being sent:", formData);

      // // Make the API call to update subscription
      // const response = await fetch(`/api/subscribers/${subscriberId}`, {
      //   method: "PUT",
      //   headers: {
      //     "Content-Type": "application/json",
      //   },
      //   body: JSON.stringify(formData),
      // });

      // const result = await response.json();

      // if (!response.ok) {
      //   // Handle specific error cases
      //   if (response.status === 404) {
      //     throw new Error(
      //       "This subscription no longer exists. It may have been deleted by another user."
      //     );
      //   } else if (response.status === 400) {
      //     throw new Error(result.message || "Invalid data provided");
      //   } else {
      //     throw new Error(result.message || "Failed to update subscription");
      //   }
      // }

      // // console.log("Subscription updated successfully:", result);

      // // Close dialog and show success message
      // setEditDialogOpen(false);
      // toast.success("Subscription updated successfully");
      // router.refresh();

      // Make API call with ts-rest client
      const response = await clientApi.updateSubscriber({
        params: { id: subscriberId },
        body: { ...formData },
      });

      // Handle response status
      if (response.status === 200) {
        setEditDialogOpen(false);
        toast.success("Subscription updated successfully");
        router.refresh();
      } else if (response.status === 404) {
        throw new Error(
          "This subscription no longer exists. It may have been deleted by another user."
        );
      } else {
        throw new Error(response.body.error || "Failed to update subscription");
      }
    } catch (error) {
      console.error("Error updating subscription:", error);

      // Show appropriate error message to user
      if (error.message.includes("no longer exists")) {
        toast.error("This subscription was deleted. Please refresh the page.");
        // Optionally refresh the entire list
        // window.location.reload();
      } else {
        toast.error(error.message || "Failed to update subscription");
      }
    } finally {
      setEditLoading(false);
    }
  };

  const handleEditFormChange = (field, value) => {
    setEditForm((prev) => ({
      ...prev,
      [field]: value,
    }));
  };

  // Function to fetch payment details based on userId
  const fetchPaymentDetails = async (userId) => {
    setLoading(true);
    try {
      const response = await fetch(`/api/bkash-manual-payment`, {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
        },
      });

      if (!response.ok) {
        throw new Error("Failed to fetch payment details");
      }

      const result = await response.json();

      // console.log("result result:", result.data);

      // Filter payments for the specific user
      const userPayments = result.data.filter(
        (payment) => payment.userId === userId
      );

      setPaymentDetails(userPayments);

      // Set dynamic title based on user data
      if (userPayments.length > 0 && userPayments[0].user) {
        setTitle(`Payment Details - ${userPayments[0].user.name}`);
      } else {
        setTitle("Payment Details");
      }
    } catch (error) {
      console.error("Error fetching payment details:", error);
      setPaymentDetails([]);
    } finally {
      setLoading(false);
    }
  };

  // Handle dropdown open/close with proper focus management
  const handleDropdownOpenChange = useCallback(
    (open) => {
      setDropdownOpen(open);

      // If closing, immediately blur any focused elements to prevent aria-hidden conflicts
      if (!open) {
        // Force blur on any focused elements within the dropdown
        const focusedElement = document.activeElement;
        if (
          focusedElement &&
          focusedElement.closest("[data-radix-popper-content-wrapper]")
        ) {
          focusedElement.blur();
        }

        // Return focus to trigger after animation completes
        setTimeout(() => {
          if (triggerRef.current && !drawerOpen) {
            triggerRef.current.focus();
          }
        }, 150); // Wait for Radix animation to complete
      }
    },
    [drawerOpen]
  );

  // Handle details click with proper focus management
  const handleDetailsClick = useCallback(async () => {
    try {
      // Immediately blur any focused elements to prevent aria-hidden conflicts
      const focusedElement = document.activeElement;
      if (
        focusedElement &&
        focusedElement.closest("[data-radix-popper-content-wrapper]")
      ) {
        focusedElement.blur();
      }

      setDrawerOpen(true);
      // Close dropdown immediately
      setDropdownOpen(false);

      // Use the userId from studentProfile or fallback to direct userId
      const targetUserId =
        row.original.studentProfile?.userId || row.original.userId;
      await fetchPaymentDetails(targetUserId);
    } catch (error) {
      console.error("Error handling details click:", error);
      // Reset states on error
      setDrawerOpen(false);
      setDropdownOpen(false);
    }
  }, [row.original]);

  // Handle drawer close with proper cleanup
  const handleDrawerOpenChange = useCallback((open) => {
    setDrawerOpen(open);
    if (!open) {
      setDropdownOpen(false);
      setPaymentDetails(null); // Clear data when drawer closes

      // Return focus to trigger after drawer closes
      setTimeout(() => {
        if (triggerRef.current) {
          triggerRef.current.focus();
        }
      }, 100);
    }
  }, []);

  return (
    <>
      <DropdownMenu
        open={dropdownOpen}
        onOpenChange={handleDropdownOpenChange}
        modal={true}
      >
        <DropdownMenuTrigger asChild>
          <Button
            ref={triggerRef}
            variant="ghost"
            className="flex h-8 w-8 p-0 data-[state=open]:bg-muted"
            aria-label="Open actions menu"
          >
            <MoreHorizontal className="h-4 w-4" />
            <span className="sr-only">Open menu</span>
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end" className="w-[160px]">
          <DropdownMenuItem
            className="cursor-pointer"
            onClick={(e) => {
              e.preventDefault();
              // Blur focused elements before action
              const focusedElement = document.activeElement;
              if (
                focusedElement &&
                focusedElement.closest("[data-radix-popper-content-wrapper]")
              ) {
                focusedElement.blur();
              }
              handleEdit(row.original);
              setDropdownOpen(false);
            }}
            onSelect={(e) => {
              e.preventDefault();
              // Blur focused elements before action
              const focusedElement = document.activeElement;
              if (
                focusedElement &&
                focusedElement.closest("[data-radix-popper-content-wrapper]")
              ) {
                focusedElement.blur();
              }
              handleEdit(row.original);
            }}
          >
            Edit
          </DropdownMenuItem>

          <DropdownMenuItem
            className="cursor-pointer"
            onClick={(e) => {
              e.preventDefault();
              handleDetailsClick();
            }}
            onSelect={(event) => {
              // Prevent default to handle async operation
              event.preventDefault();
              handleDetailsClick();
            }}
          >
            Details
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>

      {/* Edit subscriber Dialog */}
      <Dialog open={editDialogOpen} onOpenChange={setEditDialogOpen}>
        <DialogContent className="sm:max-w-[600px] max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <User className="h-5 w-5" />
              Edit Subscribers Details
            </DialogTitle>
          </DialogHeader>
          {/* edit subscriber form */}
          <EditSubscribersForm
            handleEditSubmit={handleEditSubmit}
            editForm={editForm}
            handleEditFormChange={handleEditFormChange}
            setEditDialogOpen={setEditDialogOpen}
            editLoading={editLoading}
          />
        </DialogContent>
      </Dialog>

      {/*Pyment Details drawer */}
      <Drawer
        direction="right"
        open={drawerOpen}
        onOpenChange={handleDrawerOpenChange}
      >
        <DrawerBody
          title={loading ? <Skeleton className="w-32 h-4 " /> : title}
          description={loading ? "" : "All Bkash manual payments for this user"}
          className="overflow-y-auto overflow-x-hidden md:w-6/12 lg:w-6/12 xl:w-4/12 2xl:w-4/12 w-full max-h-screen"
        >
          <PaymentDetailsTable payments={paymentDetails} loading={loading} />
        </DrawerBody>
      </Drawer>
    </>
  );
}

// Payment Details Table Component
function PaymentDetailsTable({ payments, loading }) {
  if (loading) {
    return (
      <div
        className="space-y-4"
        role="status"
        aria-label="Loading payment details"
      >
        {[1, 2, 3].map((i) => (
          <div key={i} className="flex space-x-4">
            <Skeleton className="w-full h-12" />
          </div>
        ))}
        {/* <span className="sr-only">Loading payment details...</span> */}
      </div>
    );
  }

  if (!payments || payments.length === 0) {
    return (
      <div
        className="text-center py-8 text-gray-500 border rounded-md"
        role="status"
      >
        No payment records found for this user.
      </div>
    );
  }

  return (
    <div className="space-y-6" role="list" aria-label="Payment records">
      {payments.map((payment, index) => (
        <div
          key={payment.id}
          className="border border-gray-200 rounded-lg p-6 space-y-4 shadow-sm hover:shadow-md transition-shadow duration-200 bg-white"
          role="listitem"
          aria-label={`Payment ${index + 1} of ${payments.length}`}
        >
          {/* Header Section */}
          <div className="flex flex-col sm:flex-row justify-between gap-4">
            <div className="space-y-2">
              <h4 className="font-semibold text-lg text-gray-900">
                {payment.user?.name || "User not specified"}
              </h4>
              <div className="flex flex-wrap gap-x-4 gap-y-1 text-sm">
                <p className="text-gray-600 flex items-center">
                  <Mail className="w-4 h-4 mr-1.5" />
                  {payment.user?.email || "N/A"}
                </p>
                <p className="text-gray-600 flex items-center">
                  <CreditCard className="w-4 h-4 mr-1.5" />
                  {payment.type || "N/A"}
                </p>
              </div>
            </div>

            <div className="flex flex-col items-end gap-1">
              <p
                className="text-2xl font-bold text-gray-900"
                aria-label={`Amount: ${payment.amount || 0} Taka`}
              >
                ৳{payment.amount?.toLocaleString() || "0"}
              </p>
              <span
                className={`px-2.5 py-1 rounded-full text-xs font-medium ${
                  payment.status === "COMPLETED"
                    ? "bg-green-100 text-green-800"
                    : payment.status === "FAILED"
                    ? "bg-red-100 text-red-800"
                    : "bg-yellow-100 text-yellow-800"
                }`}
              >
                {payment.status || "PENDING"}
              </span>
            </div>
          </div>

          {/* Details Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
            <div className="space-y-1">
              <p className="text-gray-500">Subscription Plan</p>
              <p className="font-medium text-gray-900">
                {payment.subscriptionPlan?.name || "N/A"}
              </p>
            </div>

            <div className="space-y-1">
              <p className="text-gray-500">Payment Method</p>
              <p className="font-medium text-gray-900 flex items-center">
                <Smartphone className="w-4 h-4 mr-2" />
                bKash Manual Payment
              </p>
            </div>

            <div className="space-y-1">
              <p className="text-gray-500">Transaction IDs</p>
              <div className="font-medium">
                {payment.trxId?.length > 0 ? (
                  <div className="flex flex-wrap gap-1">
                    {payment.trxId.map((id, idx) => (
                      <span
                        key={idx}
                        className="inline-block bg-gray-100 px-2 py-1 rounded text-xs font-mono"
                        aria-label={`Transaction ID ${idx + 1}: ${id}`}
                      >
                        {id}
                      </span>
                    ))}
                  </div>
                ) : (
                  <span className="text-gray-400">N/A</span>
                )}
              </div>
            </div>

            <div className="space-y-1">
              <p className="text-gray-500">Pay From</p>
              <div className="font-medium">
                {payment.payFrom?.length > 0 ? (
                  <span className="inline-flex items-center bg-gray-100 px-2.5 py-1 rounded-full text-xs">
                    <User className="w-3 h-3 mr-1.5" />
                    {payment.payFrom.join(", ")}
                  </span>
                ) : (
                  <span className="text-gray-400">N/A</span>
                )}
              </div>
            </div>
          </div>

          {/* Footer */}
          <div className="pt-2 border-t border-gray-100">
            <div className="flex flex-col sm:flex-row justify-between gap-2 text-xs text-gray-500">
              <p className="flex items-center">
                <Calendar1 className="w-3 h-3 mr-1.5" />
                Created:{" "}
                {new Date(payment.createdAt).toLocaleString("en-US", {
                  year: "numeric",
                  month: "short",
                  day: "numeric",
                  hour: "2-digit",
                  minute: "2-digit",
                })}
              </p>
              <p className="flex items-center">
                <RefreshCw className="w-3 h-3 mr-1.5" />
                Updated:{" "}
                {new Date(payment.updatedAt).toLocaleString("en-US", {
                  year: "numeric",
                  month: "short",
                  day: "numeric",
                  hour: "2-digit",
                  minute: "2-digit",
                })}
              </p>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}
