// @ts-nocheck

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
import moment from "moment";

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

export default function PaymentHistory({ paymentHistory, loading }) {
  return (
    <div>
      <Card>
        <CardHeader>
          <h2 className="text-xl font-semibold">Payment History</h2>
        </CardHeader>
        <CardContent className="relative max-h-[500px] slim-scrollbar">
          {loading ? null : ( // <Loader />
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Payment Date</TableHead>
                  <TableHead>Month For</TableHead>
                  <TableHead>Year For</TableHead>
                  <TableHead>Amount Paid</TableHead>
                  <TableHead>Status</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {!paymentHistory || paymentHistory.length === 0 ? (
                  <TableRow>
                    <TableCell
                      colSpan={5}
                      className="py-4 text-center text-gray-500"
                    >
                      <h5>No payment history found</h5>
                    </TableCell>
                  </TableRow>
                ) : (
                  paymentHistory.map((payment) => (
                    <TableRow key={payment._id}>
                      <TableCell className="min-w-[190px] sm:min-w-max">
                        {moment(payment?.payment_date).format(
                          "MMM D, YYYY - h:mm A"
                        ) || "No Date"}
                      </TableCell>
                      <TableCell>
                        {monthNames[payment.month_paid_for - 1] ||
                          `Month ${payment.month_paid_for}`}
                      </TableCell>
                      <TableCell>{payment?.year_paid_for || "N/A"}</TableCell>
                      <TableCell>
                        {payment?.amount_paid.toFixed(2) || "N/A"}
                      </TableCell>
                      <TableCell>
                        {payment?.payment_status
                          ? payment?.payment_status
                          : "N/A"}
                      </TableCell>
                    </TableRow>
                  ))
                )}
              </TableBody>
            </Table>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
