// @ts-nocheck
"use client";
import Loader from "./Loader";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { EllipsisVertical, MoreHorizontal } from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Button } from "@/components/ui/button";
import { useState } from "react";
import { Drawer } from "@/components/ui/drawer";
import DrawerBody from "@/components/drawerBody/drawer-body";
import EarningSourceTable from "../../../admin/teachers/[teacherId]/earnings/_components/earning-sources-table";
import { Skeleton } from "@/components/ui/skeleton";
import { clientApi } from "@/lib/utils/openai/client";

export default function EarningHistory({ earningHistory, loading }) {
  const statuses = [
    { value: "PAID", label: "PAID" },
    { value: "UNPAID", label: "UNPAID" },
    { value: "DUE", label: "DUE" },
  ];
  const monthNames = [
    "January",
    "February",
    "March",
    "April",
    "May",
    "June",
    "July",
    "August",
    "September",
    "October",
    "November",
    "December",
  ];

  const months = monthNames.map((label, index) => ({
    value: index + 1,
    label: label,
  }));

  const years = [];

  for (let year = 2020; year <= 2040; year++) {
    years.push({
      value: year,
      label: year.toString(),
    });
  }

  const [revloading, setRevLoading] = useState(false);
  const [title, setTitle] = useState("");
  const [revenues, setRevenues] = useState([]);
  const [drawerOpen, setDrawerOpen] = useState(false);

  const fetchRevenues = async (earningId) => {
    setRevLoading(true);
    try {
      const { body: data } = await clientApi.getTeacherEarningRevenues({
        params: {
          earningId,
        },
      });

      setRevenues(data);
      const response = await clientApi.getTeacherEarningById({
        params: {
          earningId,
        },
      });

      if (response.status !== 200) {
        throw new Error("Failed to fetch earning details");
      }

      const { month, year } = response.body;

      const monthName = new Date(year, month - 1).toLocaleString("default", {
        month: "long",
      });

      setTitle(`${monthName} ${year}`);
    } catch (error) {
      console.error("Error fetching revenues:", error);
    } finally {
      setRevLoading(false);
    }
  };

  return (
    <div>
      <Card>
        <CardHeader>
          <h2 className="text-xl font-semibold">Earning History</h2>
        </CardHeader>
        <CardContent className="relative overflow-x-hidden max-h-[500px] slim-scrollbar">
          {loading ? null : ( // <Loader />
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Month</TableHead>
                  <TableHead>Year</TableHead>
                  <TableHead>Total Earned</TableHead>
                  <TableHead>Total Paid</TableHead>
                  <TableHead>Remaining</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {!earningHistory || earningHistory.length === 0 ? (
                  <TableRow>
                    <TableCell
                      colSpan={7}
                      className="py-4 text-center text-gray-500"
                    >
                      <h5>No earning history found</h5>
                    </TableCell>
                  </TableRow>
                ) : (
                  earningHistory.map((earning) => (
                    <TableRow key={earning.id}>
                      <TableCell>
                        {monthNames[earning?.month - 1] ||
                          `Month ${earning?.month}`}
                      </TableCell>
                      <TableCell>{earning?.year || "N/A"}</TableCell>
                      <TableCell>
                        {earning?.total_earned.toFixed(2) || 0}
                      </TableCell>
                      <TableCell>
                        {earning?.total_paid.toFixed(2) || 0}
                      </TableCell>
                      <TableCell>
                        {earning?.balance_remaining.toFixed(2) || 0}
                      </TableCell>
                      <TableCell>{earning?.status || "N/A"}</TableCell>
                      <TableCell>
                        <DropdownMenu modal={false}>
                          <DropdownMenuTrigger asChild>
                            <Button
                              variant="ghost"
                              className="flex h-8 w-8 p-0 data-[state=open]:bg-muted"
                            >
                              <MoreHorizontal />
                              <span className="sr-only">Open menu</span>
                            </Button>
                          </DropdownMenuTrigger>

                          <DropdownMenuContent align="end" className="w-32">
                            <DropdownMenuItem
                              onClick={async () => {
                                setDrawerOpen(true);
                                await fetchRevenues(earning.id); // Fetch revenues data
                              }}
                              className="cursor-pointer"
                            >
                              Details
                            </DropdownMenuItem>
                          </DropdownMenuContent>
                        </DropdownMenu>
                      </TableCell>
                    </TableRow>
                  ))
                )}
              </TableBody>
            </Table>
          )}
        </CardContent>
      </Card>

      {/* Details drawer */}
      <Drawer direction="right" open={drawerOpen} onOpenChange={setDrawerOpen}>
        <DrawerBody
          title={revloading ? <Skeleton className="w-32 h-4" /> : title}
          description={
            revloading ? (
              <Skeleton className="w-36 h-4" />
            ) : (
              "All earnings are listed with courses"
            )
          }
        >
          {revloading ? (
            <Loader />
          ) : (
            <EarningSourceTable revenues={revenues} loading={revloading} />
          )}
        </DrawerBody>
      </Drawer>
    </div>
  );
}
