import SubscriptionCheckout from "./_components/subscription-checkout";
import { getServerCart } from "@/lib/actions/cart-cookie";
import CourseCheckout from "./_components/course-checkout";
import { redirect } from "next/navigation";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { ArrowLeft } from "lucide-react";
import CheckoutWrapper from "./_components/checkout-wrapper";

interface CheckOutPageProps {
  searchParams: {
    error?: string;
    success?: string;
    trxID?: string;
    amount?: string;
  };
}

const CheckOutPage = async ({ searchParams }: CheckOutPageProps) => {
  // get data from cookies
  const cartData = await getServerCart();

  // if (cartData.items.length === 0) {
  //   redirect("/");
  // }
  return <CheckoutWrapper cartData={cartData} searchParams={searchParams} />;
};

export default CheckOutPage;
