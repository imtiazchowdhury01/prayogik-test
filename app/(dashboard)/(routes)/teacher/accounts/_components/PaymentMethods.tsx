//@ts-nocheck
"use client";
import { useState } from "react";
import { Card, CardHeader, CardContent } from "@/components/ui/card";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { PlusCircle } from "lucide-react";
import { usePaymentMethods } from "../_hooks/usePaymentMethods";
import { PaymentMethodsTable } from "./PaymentMethodsTable";
import { PaymentMethodForm } from "./PaymentMethodForm";
import { ConfirmationModal } from "./ConfirmationModal";

export default function PaymentMethods({ teacherId }) {
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [addLoading, setAddLoading] = useState(false);
  const [editModalOpen, setEditModalOpen] = useState(false);
  const [deleteModalOpen, setDeleteModalOpen] = useState(false);
  const [selectedPaymentMethod, setSelectedPaymentMethod] = useState(null);

  const {
    paymentMethods,
    loading,
    createPaymentMethod,
    makePrimary,
    deletePaymentMethod,
  } = usePaymentMethods(teacherId);

  const handleAddPaymentMethod = async (formData) => {
    setAddLoading(true);
    try {
      const success = await createPaymentMethod(formData);
      if (success) {
        setIsAddModalOpen(false);
      }
    } catch (error) {
      console.error("Error in handleAddPaymentMethod:", error);
      toast.error("Failed to add payment method");
    } finally {
      setAddLoading(false);
    }
  };

  const handleMakePrimary = async () => {
    if (selectedPaymentMethod) {
      const success = await makePrimary(selectedPaymentMethod.id);
      if (success) {
        setEditModalOpen(false);
        setSelectedPaymentMethod(null);
      }
    }
  };

  const handleDelete = async () => {
    if (selectedPaymentMethod) {
      const success = await deletePaymentMethod(selectedPaymentMethod.id);
      if (success) {
        setDeleteModalOpen(false);
        setSelectedPaymentMethod(null);
      }
    }
  };

  const handleMakePrimaryOpen = (method) => {
    setSelectedPaymentMethod(method);
    setEditModalOpen(true);
  };

  const handleDeleteOpen = (method) => {
    setSelectedPaymentMethod(method);
    setDeleteModalOpen(true);
  };

  return (
    <Card>
      <CardHeader>
        <div className="flex flex-row flex-wrap gap-2 justify-between items-center">
          <h2 className="text-xl font-semibold">Your Payment Methods</h2>
          <div className="inline-flex">
            <a
              className="mt-2 flex items-center justify-center font-semibold cursor-pointer"
              onClick={() => setIsAddModalOpen(true)}
            >
              <PlusCircle className="mr-2 w-4 h-4" /> Add Bank Account
            </a>
          </div>
        </div>
      </CardHeader>

      <CardContent className="relative max-h-[500px] slim-scrollbar">
        <PaymentMethodsTable
          paymentMethods={paymentMethods}
          onMakePrimary={handleMakePrimaryOpen}
          onDelete={handleDeleteOpen}
          loading={loading}
        />
      </CardContent>

      {/* Add Payment Method Modal */}
      <Dialog open={isAddModalOpen} onOpenChange={setIsAddModalOpen}>
        <DialogContent className="bg-white rounded-lg shadow-lg p-6 max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle className="text-lg font-semibold">
              Add Bank Account
            </DialogTitle>
            <DialogDescription className="sr-only">
              Add a new bank account for payments
            </DialogDescription>
          </DialogHeader>
          <PaymentMethodForm
            onSubmit={handleAddPaymentMethod}
            loading={addLoading}
          />
        </DialogContent>
      </Dialog>

      {/* Make Primary Confirmation Modal */}
      <ConfirmationModal
        isOpen={editModalOpen}
        onClose={() => {
          setEditModalOpen(false);
          setSelectedPaymentMethod(null);
        }}
        onConfirm={handleMakePrimary}
        title="Make Primary Account"
        description="Are you sure you want to make this account primary? You will receive payments on your primary account."
        confirmText="Confirm"
      />

      {/* Delete Confirmation Modal */}
      <ConfirmationModal
        isOpen={deleteModalOpen}
        onClose={() => {
          setDeleteModalOpen(false);
          setSelectedPaymentMethod(null);
        }}
        onConfirm={handleDelete}
        title="Confirm Deletion"
        description="Are you sure you want to delete this payment method?"
        confirmText="Delete"
        confirmVariant="destructive"
      />
    </Card>
  );
}
