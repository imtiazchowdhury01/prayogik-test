// @ts-nocheck
export const dynamic = "force-dynamic";

import { getTags } from "./_actions/tags.action";
import { columns } from "./_components/columns";
import { DataTable } from "./_components/data-table";

const Tags = async () => {
  const tags = await getTags();
  return (
    <div className="h-full flex-1 flex-col space-y-8 flex">
      <DataTable data={tags} columns={columns} />
    </div>
  );
};
export default Tags;
