// "use client";

// import { useState, useEffect, useRef, useCallback } from "react";
// import { useSession } from "next-auth/react";
// import axios from "axios";
// import { clientApi } from "@/lib/utils/openai/client";

// interface SubscriptionData {
//   subscriptions: any[];
//   userSubscription: any;
//   hasActiveSubscription: boolean;
//   paymentStatus: string;
// }

// interface UseSubscriptionDataReturn {
//   isLoading: boolean;
//   data: SubscriptionData | null;
//   error: string | null;
// }

// export function useSubscriptionData(): UseSubscriptionDataReturn {
//   const { data: session } = useSession();
//   const [isLoading, setIsLoading] = useState<boolean>(false);
//   const [data, setData] = useState<SubscriptionData | null>(null);
//   const [error, setError] = useState<string | null>(null);

//   // Use refs to prevent infinite loops
//   const fetchedRef = useRef<boolean>(false);
//   const sessionIdRef = useRef<string | null>(null);
//   const abortControllerRef = useRef<AbortController | null>(null);

//   const fetchSubscriptionData = useCallback(async (currentSession: any) => {
//     // Don't fetch if user is not authenticated
//     if (!currentSession?.user) {
//       setData(null);
//       setIsLoading(false);
//       return;
//     }

//     // Prevent duplicate fetches for the same session
//     const currentSessionId =
//       currentSession?.user?.id || currentSession?.user?.email;
//     if (fetchedRef.current && sessionIdRef.current === currentSessionId) {
//       return;
//     }

//     try {
//       // Cancel previous request if exists
//       if (abortControllerRef.current) {
//         abortControllerRef.current.abort();
//       }

//       // Create new abort controller
//       abortControllerRef.current = new AbortController();
//       const signal = abortControllerRef.current.signal;

//       setIsLoading(true);
//       setError(null);

//       // Fetch subscriptions and user subscription in parallel
//       const [subscriptionsResponse, userSubscriptionResponse] =
//         await Promise.all([
//           axios.get(`${process.env.NEXT_PUBLIC_APP_URL}/api/subscriptions`, {
//             signal,
//           }),
//           axios.get(
//             `${process.env.NEXT_PUBLIC_APP_URL}/api/user/subscription`,
//             { signal }
//           ),
//         ]);

//       if (signal.aborted) return;

//       const subscriptions = subscriptionsResponse.data;
//       const userSubscription = userSubscriptionResponse.data;
//       const hasActiveSubscription = userSubscription?.status === "ACTIVE";

//       let paymentStatus = ""; // Default to empty string instead of "FAILED"

//       // Only fetch payment status if we have subscriptions
//       if (subscriptions && subscriptions.length > 0 && subscriptions[0]?.id) {
//         try {
//           const fetchBkashManualPayment: any =
//             await clientApi.getBkashManualSinglePayment({
//               params: {
//                 paymentId: subscriptions[0].id,
//               },
//             });

//           if (!signal.aborted && fetchBkashManualPayment?.body?.status) {
//             paymentStatus = fetchBkashManualPayment.body.status;
//           }
//         } catch (paymentError) {
//           console.warn("Error fetching payment status:", paymentError);
//           // Keep paymentStatus as empty string on error
//         }
//       }

//       if (signal.aborted) return;

//       const subscriptionData: SubscriptionData = {
//         subscriptions,
//         userSubscription,
//         hasActiveSubscription,
//         paymentStatus,
//       };

//       setData(subscriptionData);
//       fetchedRef.current = true;
//       sessionIdRef.current = currentSessionId;
//     } catch (err) {
//       if (axios.isCancel(err) || (err as any).name === "AbortError") {
//         return; // Ignore cancelled requests
//       }

//       console.error("Error fetching subscription data:", err);
//       setError(
//         err instanceof Error ? err.message : "Failed to fetch subscription data"
//       );

//       // On error, set data to null instead of default values
//       setData(null);

//       fetchedRef.current = true;
//       sessionIdRef.current = currentSessionId;
//     } finally {
//       setIsLoading(false);
//     }
//   }, []);

//   useEffect(() => {
//     // Only start loading when we have a session
//     if (session?.user) {
//       fetchSubscriptionData(session);
//     } else {
//       // If no session, immediately set to null
//       setData(null);
//       setIsLoading(false);
//     }

//     // Cleanup function
//     return () => {
//       if (abortControllerRef.current) {
//         abortControllerRef.current.abort();
//       }
//     };
//   }, [session, fetchSubscriptionData]);

//   // Reset when session changes
//   useEffect(() => {
//     const currentSessionId = session?.user?.email || null;
//     if (sessionIdRef.current && sessionIdRef.current !== currentSessionId) {
//       fetchedRef.current = false;
//       sessionIdRef.current = null;
//       setData(null);
//       setError(null);
//     }
//   }, [session?.user?.email]);

//   return { isLoading, data, error };
// }

'use client';
 
import { useState, useEffect, useRef, useCallback } from "react";
import { useSession } from "next-auth/react";
import axios from "axios";
import { clientApi } from "@/lib/utils/openai/client";
 
interface SubscriptionData {
  subscriptions: any[];
  userSubscription: any;
  hasActiveSubscription: boolean;
  paymentStatus: string;
}
 
interface UseSubscriptionDataReturn {
  isLoading: boolean;
  data: SubscriptionData | null;
  error: string | null;
}
 
export function useSubscriptionData(): UseSubscriptionDataReturn {
  const { data: session, status } = useSession();
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [data, setData] = useState<SubscriptionData | null>(null);
  const [error, setError] = useState<string | null>(null);
 
  // Use refs to prevent infinite loops
  const fetchedRef = useRef<boolean>(false);
  const sessionIdRef = useRef<string | null>(null);
  const abortControllerRef = useRef<AbortController | null>(null);
 
  const fetchSubscriptionData = useCallback(async (currentSession: any) => {
    // Prevent duplicate fetches for the same session
    const currentSessionId = currentSession?.user?.id || currentSession?.user?.email || 'anonymous';
    if (fetchedRef.current && sessionIdRef.current === currentSessionId) {
      return;
    }
 
    try {
      // Cancel previous request if exists
      if (abortControllerRef.current) {
        abortControllerRef.current.abort();
      }
 
      // Create new abort controller
      abortControllerRef.current = new AbortController();
      const signal = abortControllerRef.current.signal;
 
      setIsLoading(true);
      setError(null);
 
      // Check if user is authenticated
      if (!currentSession?.user) {
        const unauthenticatedData: SubscriptionData = {
          subscriptions: [],
          userSubscription: null,
          hasActiveSubscription: false,
          paymentStatus: "FAILED",
        };
        setData(unauthenticatedData);
        fetchedRef.current = true;
        sessionIdRef.current = currentSessionId;
        return;
      }
 
      // Fetch subscriptions and user subscription in parallel
      const [subscriptionsResponse, userSubscriptionResponse] = await Promise.all([
        axios.get(
          `${process.env.NEXT_PUBLIC_APP_URL}/api/subscriptions`,
          { signal }
        ),
        axios.get(
          `${process.env.NEXT_PUBLIC_APP_URL}/api/user/subscription`,
          { signal }
        )
      ]);
 
      if (signal.aborted) return;
 
      const subscriptions = subscriptionsResponse.data;
      const userSubscription = userSubscriptionResponse.data;
      const hasActiveSubscription = userSubscription?.status === "ACTIVE";
 
      let paymentStatus = "FAILED";
 
      // Only fetch payment status if we have subscriptions
      if (subscriptions && subscriptions.length > 0 && subscriptions[0]?.id) {
        try {
          const fetchBkashManualPayment: any = await clientApi.getBkashManualSinglePayment({
            params: {
              paymentId: subscriptions[0].id,
            },
          });
         
          if (!signal.aborted && fetchBkashManualPayment?.body?.status) {
            paymentStatus = fetchBkashManualPayment.body.status;
          }
        } catch (paymentError) {
          console.warn("Error fetching payment status:", paymentError);
          // Continue with default paymentStatus
        }
      }
 
      if (signal.aborted) return;
 
      const subscriptionData: SubscriptionData = {
        subscriptions,
        userSubscription,
        hasActiveSubscription,
        paymentStatus,
      };
 
      setData(subscriptionData);
      fetchedRef.current = true;
      sessionIdRef.current = currentSessionId;
     
    } catch (err) {
      if (axios.isCancel(err) || (err as any).name === 'AbortError') {
        return; // Ignore cancelled requests
      }
     
      console.error("Error fetching subscription data:", err);
      setError(err instanceof Error ? err.message : "Failed to fetch subscription data");
     
      const errorData: SubscriptionData = {
        subscriptions: [],
        userSubscription: null,
        hasActiveSubscription: false,
        paymentStatus: "FAILED",
      };
      setData(errorData);
     
      fetchedRef.current = true;
      sessionIdRef.current = currentSessionId;
    } finally {
      setIsLoading(false);
    }
  }, []);
 
  useEffect(() => {
    // Only fetch when session status is ready (not loading)
    if (status === "loading") {
      return;
    }
 
    fetchSubscriptionData(session);
 
    // Cleanup function
    return () => {
      if (abortControllerRef.current) {
        abortControllerRef.current.abort();
      }
    };
  }, [session, status, fetchSubscriptionData]);
 
  // Reset when session changes
  useEffect(() => {
    const currentSessionId = session?.user?.email || 'anonymous';
    if (sessionIdRef.current && sessionIdRef.current !== currentSessionId) {
      fetchedRef.current = false;
      sessionIdRef.current = null;
      setData(null);
      setError(null);
    }
  }, [session?.user?.email]);
 
  return { isLoading, data, error };
}