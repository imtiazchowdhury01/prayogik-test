// @ts-nocheck
import { getServerSession } from "next-auth";
import { redirect } from "next/navigation";
import AccountOverview from "./_components/AccountOverview";
import PaymentHistory from "./_components/PaymentHistory";
import PaymentMethods from "./_components/PaymentMethods";
import EarningHistory from "./_components/EarningHistory";
import PageTitle from "@/components/pageTitle";
import { authOptions } from "@/app/api/auth/[...nextauth]/options";
import { clientApi } from "@/lib/utils/openai/client";

async function getAccountOverview(teacherProfileId: string) {
  console.log(teacherProfileId, "teacherProfileId in getAccountOverview");
  try {
    const response = await clientApi.getAccountOverview({
      query: { teacherId: teacherProfileId }
    });
    
    if (response.status !== 200) {
      throw new Error("Failed to fetch overview");
    }
    
    return response.body;
  } catch (error) {
    console.error("Error fetching account overview:", error);
    return null;
  }
}

async function getPaymentHistory(teacherProfileId: string) {
  try {
    const response = await clientApi.getPaymentHistory({
      query: { teacherId: teacherProfileId }
    });
    
    if (response.status !== 200) {
      throw new Error("Failed to fetch payment history");
    }
    
    return response.body;
  } catch (error) {
    console.error("Error fetching payment history:", error);
    return [];
  }
}

async function getEarningHistory(teacherProfileId: string) {
  try {
    const response = await clientApi.getEarningHistory({
      body: { teacherProfileId }
    });
    
    if (response.status !== 200) {
      throw new Error("Failed to fetch earning history");
    }
    
    const data = response.body;
    return data.map((item: any) => ({
      id: item.id,
      month: item.month,
      year: item.year,
      total_earned: item.earned,
      total_paid: item.paid,
      balance_remaining: item.remaining,
      status: item.status,
    }));
  } catch (error) {
    console.error("Error fetching earning history:", error);
    return [];
  }
}

export default async function TeacherAccount() {
  const session = await getServerSession(authOptions);
  if (!session?.user) {
    redirect("/login");
  }
  
  const teacherId = session.user.id;
  const teacherProfileId = session.user?.info?.teacherProfile?.id;
  
  if (!teacherProfileId) {
    return <div>Teacher profile not found</div>;
  }
  
  // Fetch all data in parallel
  const [overview, paymentHistory, earningHistory] = await Promise.all([
    getAccountOverview(teacherProfileId),
    getPaymentHistory(teacherProfileId),
    getEarningHistory(teacherProfileId),
  ]);
  
  return (
    <div className="max-w-4xl space-y-6">
      <PageTitle title="Accounts" />
      <AccountOverview
        overview={overview}
        loading={!overview}
        paymentHistory={paymentHistory}
      />
      <EarningHistory earningHistory={earningHistory} loading={false} />
      <PaymentHistory paymentHistory={paymentHistory} loading={false} />
      <PaymentMethods teacherId={teacherId} />
    </div>
  );
}