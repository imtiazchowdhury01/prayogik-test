// @ts-nocheck
export const dynamic = "force-dynamic";

import { columns } from "./_components/columns";
import { DataTable } from "./_components/data-table";
import { clientApi } from "@/lib/utils/openai/client";
import { cookies } from "next/headers";
import { z } from "zod";
import { BkashManualPaymentBodySchema } from "@/lib/utils/openai/types";
import { createAccordionScope } from "@radix-ui/react-accordion";

type BkashManualPaymentType = z.infer<typeof BkashManualPaymentBodySchema>;
// Server component
const ManualPayments = async () => {
  let data: BkashManualPaymentType[] = [];

  try {
    const response = await clientApi.getBkashPaymentsForAdmin({
      extraHeaders: {
        Cookie: cookies().toString(),
      },
    });

    if (response.status === 200) {
      data = convertData(response.body.data);
    }
  } catch (err) {
    console.error("Failed to fetch manual payments details:", err);
  }

  return (
    <div className="h-full flex-1 flex-col space-y-8 flex">
      <DataTable data={data} columns={columns} />
    </div>
  );
};

const convertData = (data: BkashManualPaymentType[]) => {
  return data.map((item: BkashManualPaymentType) => ({
    id: item.id || "",
    email: item.user.email,
    courseOrSubscriptionTitle: item.title,
    type: item.type,
    amount: item.amount,
    payableAmount: item.payableAmount,
    status: item.status,
    trxId: item.trxId?.join(", "),
    payFrom: item.payFrom,
    createAt: item.createdAt,
    updatedAt: item.updatedAt,
  }));
};

export default ManualPayments;
