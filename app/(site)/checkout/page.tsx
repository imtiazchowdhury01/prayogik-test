import SubscriptionCheckout from "./_components/subscription-checkout";
import { getServerCart } from "@/lib/actions/cart-cookie";
import CourseCheckout from "./_components/course-checkout";
import { redirect } from "next/navigation";

const CheckOutPage = async () => {
  // get data from cookies
  const cartData = await getServerCart();

  if (cartData.items.length === 0) {
    redirect("/");
  }
  
  if (cartData?.type === "SUBSCRIPTION") {
    return <SubscriptionCheckout cartData={cartData} />;
  }

  if (cartData?.type === "COURSE") {
    return <CourseCheckout cartData={cartData} />;
  }
};

export default CheckOutPage;
