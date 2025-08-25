// @ts-nocheck

import { Card, CardContent, CardHeader } from "@/components/ui/card";

import moment from "moment";
import BalanceOverviewLoader from "./BalanceOverviewLoader";
import { formatPrice } from "@/lib/format";

const monthNames = [
  "",
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

export default function AccountOverview({ overview, loading, paymentHistory }) {
  const getLastTransaction = (transactions) => {
    return transactions.reduce((last, current) => {
      return new Date(current.date) > new Date(last.date) ? current : last;
    });
  };
  let lastTransaction;
  if (paymentHistory.length > 0) {
    lastTransaction = getLastTransaction(paymentHistory);
  }

  return (
    <div>
      <Card className="bg-white border border-primary-100 overflow-hidden">
        <CardHeader>
          <h2 className="text-xl font-semibold">Overview</h2>
        </CardHeader>

        <CardContent>
          {loading ? null : !overview || overview.length === 0 ? ( // <BalanceOverviewLoader />
            <div className="py-4 text-center text-gray-500">
              <h5>No payment methods found</h5>
            </div>
          ) : (
            <div className="flex flex-col space-y-4">
              <div className="flex gap-x-2 max-lg:justify-between">
                <span className="font-normal text-gray-500">
                  Available Balance:
                </span>
                <span className="text-primary-500 font-bold text-base">
                  {formatPrice(
                    parseInt(overview?.remaining_balance, 10).toFixed(2)
                  )}
                </span>
              </div>

              <div className="flex gap-x-2 max-lg:justify-between">
                <span className="font-normal text-gray-500">
                  Total Earned in {monthNames[overview?.month]} {overview?.year}
                  :
                </span>
                <span className="text-primary-500 font-normal">
                  {formatPrice(parseInt(overview?.total_earned, 10).toFixed(2))}
                </span>
              </div>

              <div className="flex gap-x-2  max-lg:justify-between">
                <span className="font-normal text-gray-500">
                  Total Paid for {monthNames[overview?.month]} {overview?.year}:
                </span>
                <span className="text-primary-500 font-normal">
                  {formatPrice(
                    parseInt(overview?.total_payments, 10).toFixed(2)
                  )}
                </span>
              </div>

              <div className="flex text-sm gap-x-2 max-lg:justify-between">
                <span className="font-normal text-gray-500">
                  Last Payment On:
                </span>
                <span className="text-primary-500">
                  {overview?.last_transaction_date
                    ? moment(overview?.last_transaction_date).format(
                        "MMMM D, YYYY, h:mm A"
                      )
                    : "N/A"}
                </span>
              </div>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
