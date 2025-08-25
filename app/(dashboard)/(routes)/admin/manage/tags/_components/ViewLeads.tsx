import {
  Drawer,
  DrawerClose,
  DrawerContent,
  DrawerDescription,
  DrawerFooter,
  DrawerHeader,
  DrawerTitle,
} from "@/components/ui/drawer";

interface Subscriber {
  id: string;
  email: string;
  createdAt: string;
}

interface ViewLeadsProps {
  row: { name: string; leads: number };
  drawerOpen: boolean;
  setDrawerOpen: (open: boolean) => void;
  loadingSubscribers: boolean;
  leads: Subscriber[];
}

const ViewLeads = ({
  row,
  drawerOpen,
  setDrawerOpen,
  loadingSubscribers,
  leads,
}: ViewLeadsProps) => {
  return (
    <Drawer direction="right" open={drawerOpen} onOpenChange={setDrawerOpen}>
      <DrawerContent className="top-0 right-0 left-auto mt-0 w-[500px] rounded-none h-full">
        <div className="mx-auto w-full p-4">
          <DrawerHeader>
            <DrawerDescription className="sr-only hidden"></DrawerDescription>
            <DrawerTitle>
              Leads Details for{" "}
              <span className="border rounded-full px-2 font-light text-sm bg-gray-100 ml-2 capitalize">
                {row.name}
              </span>
            </DrawerTitle>
          </DrawerHeader>

          <div className="p-4">
            {loadingSubscribers ? (
              // sekleton loading state
              <div>
                <div className="h-6 w-32 bg-gray-200 dark:bg-gray-700 rounded mb-4 animate-pulse"></div>
                <div className="overflow-auto max-h-[calc(100vh-200px)]">
                  <table className="min-w-full divide-y divide-gray-200 border dark:divide-gray-700">
                    <tbody className="bg-white dark:bg-gray-900 divide-y divide-gray-200 dark:divide-gray-700">
                      {[...Array(3)].map((_, i) => (
                        <tr key={i}>
                          <td className="px-4 py-3 whitespace-nowrap">
                            <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded animate-pulse w-3/4"></div>
                          </td>
                          <td className="px-4 py-3 whitespace-nowrap">
                            <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded animate-pulse w-1/2"></div>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            ) : leads.length > 0 ? (
              <div>
                <p className="mb-4">Total leads: {leads.length}</p>
                <div className="overflow-auto max-h-[calc(100vh-200px)]">
                  <table className="min-w-full divide-y divide-gray-200 border dark:divide-gray-700">
                    <thead className="bg-gray-50 dark:bg-gray-800 sticky top-0">
                      <tr>
                        <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                          Email
                        </th>
                        <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                          Created At
                        </th>
                      </tr>
                    </thead>
                    <tbody className="bg-white dark:bg-gray-900 divide-y divide-gray-200 dark:divide-gray-700">
                      {leads.map((lead) => (
                        <tr
                          key={lead.id}
                          className="hover:bg-gray-50 dark:hover:bg-gray-800"
                        >
                          <td className="px-4 py-3 whitespace-nowrap text-sm font-medium text-gray-900 dark:text-white">
                            {lead.email}
                          </td>
                          <td className="px-4 py-3 whitespace-nowrap text-sm text-gray-500 dark:text-gray-400">
                            {new Date(lead.createdAt).toLocaleDateString()}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            ) : (
              <div className="border rounded-lg p-4 text-center text-gray-500 dark:text-gray-400">
                <p>No leads Found for this tag</p>
              </div>
            )}
          </div>
        </div>
        <DrawerFooter className="flex justify-end p-4">
          <DrawerClose>
            <div className="border rounded-md w-full p-2">Close</div>
          </DrawerClose>
        </DrawerFooter>
      </DrawerContent>
    </Drawer>
  );
};

export default ViewLeads;
