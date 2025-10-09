"use client";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { QueryKeys } from "@/constants/query-keys";
import { clearServerCart, setServerCart } from "@/lib/actions/cart-cookie";
import { clientSideCertificationAccess } from "@/lib/utils/openai/client/certification";
import { PurchaseType } from "@prisma/client";
import { useQuery } from "@tanstack/react-query";
import { useSession } from "next-auth/react";
import { usePathname, useRouter } from "next/navigation";
import React from "react";

const CertificationEnrollButton = ({ initialCertification, preview }: any) => {
  const router = useRouter();
  const pathname = usePathname();
  const { data }: any = useSession();

  const {
    data: accessCertificationResponse,
    isLoading: accessCertificationLoading,
    error: accessCertificationError,
  } = useQuery<any>({
    queryKey: [
      QueryKeys.ACCESS_CERTIFICATION,
      data?.user?.id,
      initialCertification?.id,
    ],
    queryFn: () => clientSideCertificationAccess(initialCertification?.id),
    enabled: !!(data?.user?.id && initialCertification?.id && !preview),
    staleTime: 5 * 60 * 1000,
  });

  const handleRedirectToCheckout = async () => {
    if (initialCertification) {
      await clearServerCart();
      await setServerCart({
        type: "CERTIFICATION",
        items: [
          {
            certificationSlug: initialCertification?.slug,
            checkoutType: PurchaseType.CERTIFICATION,
          },
        ],
      });
      router.push("/checkout");
    }
  };

  // Navigate to learn certification
  const handleRedirectToLearnMore = () => {
    router.push(
      `${pathname}/${accessCertificationResponse?.nextLessonAndCourseSlug}`
    );
  };

  if (accessCertificationLoading) return <Skeleton className="w-40 h-12" />;

  if (accessCertificationResponse?.access) {
    return (
      <Button
        onClick={handleRedirectToLearnMore}
        variant={"primary"}
        className="pt-6 pb-6 md:text-base text-sm text-nowrap w-full md:w-auto"
      >
        চালিয়ে যান
      </Button>
    );
  }

  return (
    <Button
      onClick={handleRedirectToCheckout}
      variant={"primary"}
      className="pt-6 pb-6 md:text-base text-sm text-nowrap w-full md:w-auto"
      disabled={preview}
    >
      এখনই এনরোল করুন
    </Button>
  );
};

export default CertificationEnrollButton;
