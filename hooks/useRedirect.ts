// @ts-nocheck
import { useState, useEffect } from "react";
import { useRouter, usePathname } from "next/navigation";

const useRedirect = () => {
  const [loading, setLoading] = useState(false);
  const router = useRouter();
  const pathname = usePathname();

  const redirect = (url) => {
    setLoading(true);
    router.push(url);
  };

  useEffect(() => {
    // Reset loading when the pathname changes
    setLoading(false);
  }, [pathname]);

  return { loading, setLoading, redirect };
};

export default useRedirect;
