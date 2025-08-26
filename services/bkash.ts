"use server";

import { db } from "@/lib/db";
import axios from "axios";
import { v4 as uuidv4 } from "uuid";

interface BkashConfig {
  base_url: string | undefined;
  username: string | undefined;
  password: string | undefined;
  app_key: string | undefined;
  app_secret: string | undefined;
}

interface PaymentDetails {
  amount: number;
  callbackURL: string;
  orderId: string;
  reference: string;
}

export async function createPayment(
  bkashConfig: BkashConfig,
  paymentDetails: PaymentDetails
) {
  try {
    const { amount, callbackURL, orderId, reference } = paymentDetails;

    // Validation
    if (!amount) {
      return {
        statusCode: 2065,
        statusMessage: "amount required",
      };
    }

    if (amount < 1) {
      return {
        statusCode: 2065,
        statusMessage: "minimum amount 1",
      };
    }

    if (!callbackURL) {
      return {
        statusCode: 2065,
        statusMessage: "callbackURL required",
      };
    }

    // Get fresh token for live environment
    const authToken = await grantToken(bkashConfig);

    if (!authToken) {
      console.error("Failed to get authentication token");
      return {
        statusCode: 2048,
        statusMessage: "Authentication failed",
      };
    }

    console.log("Creating payment with amount:", amount);
    console.log("Using base URL:", bkashConfig?.base_url);

    const response = await axios.post(
      `${bkashConfig?.base_url}/tokenized/checkout/create`,
      {
        mode: "0011", //00000 for test, 0011 for live
        currency: "BDT",
        intent: "sale",
        amount: amount.toString(), // Ensure amount is string
        callbackURL,
        payerReference: reference || "1",
        merchantInvoiceNumber: orderId || "Inv_" + uuidv4().substring(0, 6),
      },
      {
        headers: {
          "Content-Type": "application/json",
          Accept: "application/json",
          authorization: authToken,
          "x-app-key": bkashConfig?.app_key,
        },
        timeout: 30000, // 30 seconds timeout
      }
    );

    return response?.data;
  } catch (error: any) {
    console.error(
      "Create Bkash Payment Error:",
      error?.response?.data || error.message
    );

    // If 401, clear the token and retry once
    if (error?.response?.status === 401) {
      console.log("Token expired, clearing and retrying...");
      await clearStoredToken();

      // Retry once with fresh token
      try {
        const freshToken = await grantToken(bkashConfig);
        if (!freshToken) {
          return {
            statusCode: 2048,
            statusMessage: "Authentication failed on retry",
          };
        }

        const retryResponse = await axios.post(
          `${bkashConfig?.base_url}/tokenized/checkout/create`,
          {
            mode: "0011",
            currency: "BDT",
            intent: "sale",
            amount: paymentDetails.amount.toString(),
            callbackURL: paymentDetails.callbackURL,
            payerReference: paymentDetails.reference || "1",
            merchantInvoiceNumber:
              paymentDetails.orderId || "Inv_" + uuidv4().substring(0, 6),
          },
          {
            headers: {
              "Content-Type": "application/json",
              Accept: "application/json",
              authorization: freshToken,
              "x-app-key": bkashConfig?.app_key,
            },
            timeout: 30000,
          }
        );

        return retryResponse?.data;
      } catch (retryError: any) {
        console.error(
          "Retry failed:",
          retryError?.response?.data || retryError.message
        );
        return {
          statusCode: 2048,
          statusMessage: "Payment creation failed after retry",
        };
      }
    }

    return {
      statusCode: error?.response?.status || 5000,
      statusMessage:
        error?.response?.data?.statusMessage || "Payment creation failed",
    };
  }
}

export async function executePayment(
  bkashConfig: BkashConfig,
  paymentID: string
) {
  try {
    const authToken = await grantToken(bkashConfig);

    if (!authToken) {
      console.error("Failed to get authentication token for execute");
      return null;
    }

    const response = await axios.post(
      `${bkashConfig?.base_url}/tokenized/checkout/execute`,
      {
        paymentID,
      },
      {
        headers: {
          "Content-Type": "application/json",
          Accept: "application/json",
          authorization: authToken,
          "x-app-key": bkashConfig?.app_key,
        },
        timeout: 30000,
      }
    );

    return response?.data;
  } catch (error: any) {
    console.error(
      "Error from bkash executePayment: ",
      error?.response?.data || error.message
    );
    return null;
  }
}

const grantToken = async (bkashConfig: BkashConfig) => {
  try {
    // For live environment, always get fresh token or check more frequently
    const findToken = await db.bkash.findFirst({
      orderBy: {
        updatedAt: "desc",
      },
    });

    // For live environment, check token more frequently (45 minutes instead of 1 hour)
    const tokenExpiryTime = 45 * 60 * 1000; // 45 minutes in milliseconds

    if (
      !findToken ||
      findToken.updatedAt < new Date(Date.now() - tokenExpiryTime)
    ) {
      console.log("Getting fresh token...");
      return await setToken(bkashConfig);
    }

    console.log("Using existing token");
    return findToken.auth_token;
  } catch (error) {
    console.error("Error in grantToken:", error);
    return await setToken(bkashConfig); // Fallback to getting new token
  }
};

const setToken = async (bkashConfig: BkashConfig) => {
  try {
    console.log("Requesting new token from bKash...");

    const response = await axios.post(
      `${bkashConfig?.base_url}/tokenized/checkout/token/grant`,
      {
        app_key: bkashConfig?.app_key,
        app_secret: bkashConfig?.app_secret,
      },
      {
        headers: {
          "Content-Type": "application/json",
          Accept: "application/json",
          username: bkashConfig?.username,
          password: bkashConfig?.password,
        },
        timeout: 30000,
      }
    );

    if (response?.data?.id_token) {
      console.log("Successfully received new token");

      // First, try to find existing token
      const existingToken = await db.bkash.findFirst({
        orderBy: {
          updatedAt: "desc",
        },
      });

      if (existingToken) {
        // Update existing token
        await db.bkash.update({
          where: {
            id: existingToken.id,
          },
          data: {
            auth_token: response?.data?.id_token,
            updatedAt: new Date(),
          },
        });
      } else {
        // Create new token record
        await db.bkash.create({
          data: {
            auth_token: response?.data?.id_token,
          },
        });
      }

      return response?.data?.id_token;
    } else {
      console.error("No id_token received from bKash");
      return null;
    }
  } catch (error: any) {
    console.error("Error in setToken:", error?.response?.data || error.message);

    // Log specific error details for debugging
    if (error?.response?.status === 401) {
      console.error("Authentication failed - check your live credentials");
    }

    return null;
  }
};

// Helper function to clear stored token
const clearStoredToken = async () => {
  try {
    const existingToken = await db.bkash.findFirst({
      orderBy: {
        updatedAt: "desc",
      },
    });

    if (existingToken) {
      await db.bkash.delete({
        where: {
          id: existingToken.id,
        },
      });
    }
  } catch (error) {
    console.error("Error clearing token:", error);
  }
};
