// @ts-nocheck

import Loader from "@/app/(dashboard)/(routes)/teacher/accounts/_components/Loader";
import {
  Table,
  TableBody,
  TableCaption,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import moment from "moment";

export default function EarningSourceTable({ revenues, loading }) {
  return (
    <>
      {loading ? (
        <Loader />
      ) : (
        <>
          <p className="text-sm font-medium text-gray-600 mb-2">
            Earning Sources
          </p>
          <div className="max-h-[80vh] slim-scrollbar">
            <Table className="border rounded-md">
              <TableHeader>
                <TableRow>
                  <TableHead className="min-w-max">Date</TableHead>
                  <TableHead className="min-w-max">Courses</TableHead>
                  <TableHead className="min-w-max">Rank (%)</TableHead>
                  <TableHead className="min-w-max text-right">
                    Earned Amount
                  </TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {!loading && revenues.length === 0 ? (
                  <TableRow key={0}>
                    <TableCell
                      colSpan={3}
                      className="text-center text-gray-500"
                    >
                      No earnings yet.
                    </TableCell>
                  </TableRow>
                ) : (
                  !loading &&
                  revenues.map((rev) => (
                    <TableRow key={rev.id}>
                      <TableCell>
                        {moment(rev?.revenueDate).format(
                          "MMM D, YYYY - h:mm A"
                        )}
                      </TableCell>
                      <TableCell className="font-medium">
                        {rev.course}
                      </TableCell>
                      <TableCell>
                        {rev.revenueTeacherRank}{" "}
                        {!!rev.revenuePercentage
                          ? `(${rev.revenuePercentage}
                        %)`
                          : "N/A"}
                      </TableCell>
                      <TableCell className="text-right">
                        {rev.amount.toFixed(2)} Tk
                      </TableCell>
                    </TableRow>
                  ))
                )}
              </TableBody>
            </Table>
          </div>
        </>
      )}
    </>
  );
}
