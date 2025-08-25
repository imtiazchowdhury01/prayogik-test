"use client";

import { useRouter, useSearchParams } from "next/navigation";

export function useUpdateQueryParam() {
  const router = useRouter();
  const searchParams = useSearchParams();

  return (key: string, value: string) => {
    const params = new URLSearchParams(searchParams.toString());
    params.set(key, value);
    router.replace(`?${params.toString()}`, { scroll: false });
  };
}
