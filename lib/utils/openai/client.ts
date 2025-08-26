import { initClient } from "@ts-rest/core";
import { ApiContractV1 } from ".";

export const clientApi = initClient(ApiContractV1, {
  baseUrl: process.env.NEXT_PUBLIC_APP_URL || "http://localhost:3000",
  baseHeaders: {
    "Content-Type": "application/json",
  },
});
