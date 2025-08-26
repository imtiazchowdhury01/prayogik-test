import React from "react";
import PaymentError from "./payment-error-alert";
import { PaymentSuccessAlert } from "./payment-success-alert";

export default function PaymentMessage({
  errorMessage,
  isPaymentSuccessful,
  transactionId,
  amount,
}: {
  errorMessage: string | undefined;
  isPaymentSuccessful: boolean;
  transactionId?: string;
  amount?: string;
}) {
  return (
    <div>
      {errorMessage && <PaymentError message={errorMessage} />}
      {isPaymentSuccessful && (
        <PaymentSuccessAlert trxID={transactionId!} amount={amount!} />
      )}
    </div>
  );
}
