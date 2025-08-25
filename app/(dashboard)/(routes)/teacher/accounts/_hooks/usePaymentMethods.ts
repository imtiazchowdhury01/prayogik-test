// @ts-nocheck
import { useState, useEffect } from "react";
import { clientApi } from "@/lib/utils/openai/client";
import toast from "react-hot-toast";

export const usePaymentMethods = (teacherId) => {
  const [paymentMethods, setPaymentMethods] = useState([]);
  const [loading, setLoading] = useState(false);

  const fetchPaymentMethods = async () => {
    setLoading(true);
    try {
      const response = await clientApi.getPaymentMethods({
        query: { teacherId },
      });

      if (response.status !== 200) {
        throw new Error("Failed to fetch payment methods");
      }

      setPaymentMethods(response.body);
    } catch (error) {
      console.error("Error fetching payment methods:", error);
      toast.error("Failed to fetch payment methods");
    } finally {
      setLoading(false);
    }
  };
  const createPaymentMethod = async (paymentMethodData) => {
    try {
      // Validate required fields before making API call
      const requiredFields = [
        "accountNumber",
        "type",
        "bankName",
        "branch",
        "accName",
      ];
      for (const field of requiredFields) {
        if (!paymentMethodData[field]) {
          toast.error(`${field} is required`);
          return false;
        }
      }

      const createResponse = await clientApi.createPaymentMethod({
        body: {
          teacherId,
          ...paymentMethodData,
        },
      });
      // console.log("createResponse result:", createResponse);

      if (createResponse.status !== 200) {
        throw new Error("Failed to add payment method");
      }

      const responseData = createResponse.body;

      // If the new method is active, deactivate all others
      if (paymentMethodData.active && responseData?.id) {
        try {
          await Promise.all(
            paymentMethods.map(async (method) => {
              if (method.id !== responseData.id) {
                await clientApi.updatePaymentMethod({
                  params: { id: method.id },
                  body: { id: method.id, active: false },
                });
              }
            })
          );
        } catch (updateError) {
          console.warn("Error updating other payment methods:", updateError);
        }
      }

      await fetchPaymentMethods();
      toast.success("Payment method added successfully");
      return true;
    } catch (error) {
      console.error("Error adding payment method:", error);
      const errorMessage = error.message || "Failed to add payment method";
      toast.error(errorMessage);
      return false;
    }
  };

  const makePrimary = async (paymentMethodId) => {
    try {
      const response = await fetch(`/api/teacher/payment/paymentMethods`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ id: paymentMethodId, active: true }),
      });

      if (response.ok) {
        // Deactivate other accounts
        await Promise.all(
          paymentMethods.map(async (method) => {
            if (method.id !== paymentMethodId) {
              await fetch(`/api/teacher/payment/paymentMethods/${method.id}`, {
                method: "PATCH",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ id: method.id, active: false }),
              });
            }
          })
        );

        await fetchPaymentMethods();
        toast.success("Payment method set as primary");
        return true;
      }
      return false;
    } catch (error) {
      console.error("Error making payment method primary:", error);
      toast.error("Failed to set as primary");
      return false;
    }
  };

  const deletePaymentMethod = async (paymentMethodId) => {
    try {
      const response = await fetch(
        `/api/teacher/payment/paymentMethods/${paymentMethodId}`,
        { method: "DELETE" }
      );

      if (response.ok) {
        await fetchPaymentMethods();
        toast.success("Payment method deleted successfully");
        return true;
      }
      return false;
    } catch (error) {
      console.error("Error deleting payment method:", error);
      toast.error("Failed to delete payment method");
      return false;
    }
  };

  useEffect(() => {
    if (teacherId) {
      fetchPaymentMethods();
    }
  }, [teacherId]);

  return {
    paymentMethods,
    loading,
    createPaymentMethod,
    makePrimary,
    deletePaymentMethod,
    refetch: fetchPaymentMethods,
  };
};
