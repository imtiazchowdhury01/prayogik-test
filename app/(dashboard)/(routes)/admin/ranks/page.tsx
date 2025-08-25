export const dynamic = "force-dynamic";
import { cookies } from "next/headers";
import { columns } from "./_components/columns";
import { DataTable } from "./_components/data-table";
import { Urls } from "@/constants/urls";

const Ranks = async () => {
  let data: any = [];

  try {
    const response = await fetch(Urls.admin.ranks, {
      headers: {
        Cookie: cookies().toString(),
      },
    });
    const responseJson = await response.json();

    data = responseJson;
  } catch (err) {
    console.error("Failed to fetch ranks:", err);
  }

  return (
    <div className="h-full flex-1 flex-col space-y-8 flex">
      <DataTable data={data} columns={columns} />
    </div>
  );
};

export default Ranks;
