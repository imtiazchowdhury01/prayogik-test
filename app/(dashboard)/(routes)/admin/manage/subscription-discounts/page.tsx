export const dynamic = "force-dynamic";

import { getSubscriptionDiscounts } from "@/services/admin";
import { columns } from "./_components/columns";
import { DataTable } from "./_components/data-table";
import { SubscriptionDiscount } from "@prisma/client";
import { Pick } from "@prisma/client/runtime/library";

// Server component
const SubscriptionDiscountList = async () => {
  let data: Pick<
    SubscriptionDiscount,
    "id" | "name" | "discountPercentage" | "isDefault"
  >[] = [];

  try {
    const response = await getSubscriptionDiscounts();

    data = convertData(response);
  } catch (err) {
    console.error("Failed to fetch courses details:", err);
  }

  return (
    <div className="h-full flex-1 flex-col space-y-8 flex">
      <DataTable data={data} columns={columns} />
    </div>
  );
};

const convertData = (
  data: Pick<
    SubscriptionDiscount,
    "id" | "name" | "discountPercentage" | "isDefault"
  >[]
) => {
  return data.map((item) => ({
    id: item.id,
    name: item.name,
    discountPercentage: item.discountPercentage,
    isDefault: item.isDefault,
  }));
};

export default SubscriptionDiscountList;
