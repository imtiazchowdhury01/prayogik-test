// @ts-nocheck
export const dynamic = "force-dynamic";

import { getTags } from "../tags/_actions/tags.action";
import { getAllNewsLetterSubscribers } from "./_actions/newsletters.action";
import { columns } from "./_components/columns";
import { DataTable } from "./_components/data-table";

const NewLetters = async () => {
  const allnewslettersubscribers = await getAllNewsLetterSubscribers();
  const tagOptions = await getTags();
  // console.log("tagopions result:", tagOptions);
  // console.log('allnewslettersubscribers result:', allnewslettersubscribers);

  return (
    <div className="h-full flex-1 flex-col space-y-8 flex">
      <DataTable
        data={allnewslettersubscribers}
        tagOptions={tagOptions}
        columns={columns}
      />
    </div>
  );
};

export default NewLetters;
