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
  amount: number; // product price
  callbackURL: string; // callback route
  orderId: string; // order ID
  reference: string; // optional reference
}

export async function createPayment(
  bkashConfig: BkashConfig,
  paymentDetails: PaymentDetails
) {
  try {
    const { amount, callbackURL, orderId, reference } = paymentDetails;

    if (!amount) {
      return {
        statusCode: 2065,
        statusMessage: "amount required",
      };
    } else {
      if (amount < 1) {
        return {
          statusCode: 2065,
          statusMessage: "minimum amount 1",
        };
      }
    }

    if (!callbackURL) {
      return {
        statusCode: 2065,
        statusMessage: "callbackURL required",
      };
    }

    const response = await axios.post(
      `${bkashConfig?.base_url}/tokenized/checkout/create`,
      {
        mode: "0011",
        currency: "BDT",
        intent: "sale",
        amount,
        callbackURL,
        payerReference: reference || "1",
        merchantInvoiceNumber: orderId || "Inv_" + uuidv4().substring(0, 6),
      },
      {
        headers: await authHeaders(bkashConfig),
      }
    );

    return response?.data;
  } catch (e) {
    console.error("Create Bkash Payment Error:", e);
    return e;
  }
}

export async function executePayment(
  bkashConfig: BkashConfig,
  paymentID: string
) {
  try {
    const response = await axios.post(
      `${bkashConfig?.base_url}/tokenized/checkout/execute`,
      {
        paymentID,
      },
      {
        headers: await authHeaders(bkashConfig),
      }
    );

    return response?.data;
  } catch (error) {
    console.log("Error from bkash executePayment: ", error);
    return null;
  }
}

const authHeaders = async (bkashConfig: BkashConfig) => {
  return {
    "Content-Type": "application/json",
    Accept: "application/json",
    authorization: await grantToken(bkashConfig),
    "x-app-key": bkashConfig?.app_key,
  };
};

const grantToken = async (bkashConfig: BkashConfig) => {
  try {
    const findToken = await db.bkash.findFirst({
      orderBy: {
        updatedAt: "desc",
      },
    });

    // Check if token exists and is not older than 1 hour
    if (!findToken || findToken.updatedAt < new Date(Date.now() - 3600000)) {
      return await setToken(bkashConfig);
    }

    return findToken.auth_token;
  } catch (e) {
    console.log("Error in grantToken:", e);
    return null;
  }
};

const setToken = async (bkashConfig: BkashConfig) => {
  try {
    const response = await axios.post(
      `${bkashConfig?.base_url}/tokenized/checkout/token/grant`,
      tokenParameters(bkashConfig),
      {
        headers: tokenHeaders(bkashConfig),
      }
    );

    if (response?.data?.id_token) {
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
    }

    return response?.data?.id_token;
  } catch (error) {
    console.error("Error in setToken:", error);
    return null;
  }
};

const tokenParameters = (bkashConfig: BkashConfig) => {
  return {
    app_key: bkashConfig?.app_key,
    app_secret: bkashConfig?.app_secret,
  };
};

const tokenHeaders = (bkashConfig: BkashConfig) => {
  return {
    "Content-Type": "application/json",
    Accept: "application/json",
    username: bkashConfig?.username,
    password: bkashConfig?.password,
  };
};
