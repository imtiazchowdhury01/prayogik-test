// @ts-nocheck
"use client";
import React, {
  createContext,
  useContext,
  ReactNode,
  useState,
  useCallback,
} from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { useSession } from "next-auth/react";
import { clientSidefetchUserSubscription } from "@/lib/utils/openai/client/user";
import { QueryKeys } from "@/constants/query-keys";
import { TrialCourseSelectionDialog } from "@/components/courseSeclection/TrialCourseSelectionDialog";
import toast from "react-hot-toast";
import { clientApi } from "@/lib/utils/openai/client";
import { useRouter } from "next/navigation";

interface Subscription {
  id: string;
  subscriptionPlanId?: string;
  expiresAt: string;
  status: string;
  isTrial: boolean;
  trialStartedAt?: string;
  trialEndsAt?: string;
  trialCourseLimit: number;
  trialSelectedCourseIds: string[];
  studentProfileId: string;
  createdAt?: string;
  updatedAt?: string;
}

interface TrialContextType {
  subscription: Subscription | null;
  isLoading: boolean;
  error: Error | null;
  isTrialModalOpen: boolean;
  submitTrialCourses: (courseIds: string[]) => Promise<any>;
  isSubmitting: boolean;
  closeTrialModal: () => void;
  openTrialModal: () => void;
}

const TrialContext = createContext<TrialContextType | undefined>(undefined);

// API function to submit trial course selection
const submitTrialCoursesApi = async (
  courseIds: string[],
  subscriptionId: string
): Promise<any> => {
  const response = await clientApi.createTrialCourseAccess({
    body: {
      courseIds,
      subscriptionId,
    },
  });

  if (!response.body?.success) {
    throw new Error(
      response.body?.message || "কোর্স নির্বাচন সংরক্ষণ করতে ব্যর্থ হয়েছে"
    );
  }

  return response.body?.data;
};

interface TrialProviderProps {
  children: ReactNode;
}

export function TrialProvider({ children }: TrialProviderProps) {
  const { data: session } = useSession();
  const queryClient = useQueryClient();
  const router = useRouter();

  // Local state to control modal visibility
  const [isModalForceClosed, setIsModalForceClosed] = useState(false);
  // Fetch user subscription
  const {
    data: subscription,
    error,
    isLoading,
  } = useQuery<any>({
    queryKey: [QueryKeys.USER_SUBSCRIPTION],
    queryFn: clientSidefetchUserSubscription,
    staleTime: 5 * 60 * 1000, // 5 minutes
    enabled: !!session,
    retry: (failureCount, error) => {
      // Don't retry if user is not authenticated
      if (error.message?.includes("401") || error.message?.includes("403")) {
        return false;
      }
      return failureCount < 2;
    },
  });

  // Mutation to submit trial courses
  const submitTrialCoursesMutation = useMutation({
    mutationFn: (courseIds: string[]) => {
      if (!subscription?.id) {
        throw new Error("সাবস্ক্রিপশন পাওয়া যায়নি");
      }
      return submitTrialCoursesApi(courseIds, subscription.id);
    },
    onSuccess: (data) => {
      // Invalidate and refetch subscription data
      queryClient.invalidateQueries({
        queryKey: [QueryKeys.USER_SUBSCRIPTION],
      });

      router.refresh();
      toast.success("আপনার কোর্স নির্বাচন সফলভাবে সংরক্ষিত হয়েছে!");
    },
    onError: (error: Error) => {
      console.error("Trial course submission error:", error);
      toast.error(error.message || "কোর্স নির্বাচন সংরক্ষণ করতে সমস্যা হয়েছে");
    },
  });

  // Functions to control modal visibility
  const closeTrialModal = useCallback(() => {
    setIsModalForceClosed(true);
  }, []);

  const openTrialModal = useCallback(() => {
    setIsModalForceClosed(false);
  }, []);

  // Determine if trial modal should be open
  const shouldShowModal = Boolean(
    subscription &&
      subscription?.subscriptionPlan?.isTrial &&
      subscription.status === "ACTIVE" &&
      subscription.trialSelectedCourseIds.length <
        subscription?.subscriptionPlan?.trialCourseLimit
  );

  const isTrialModalOpen = shouldShowModal && !isModalForceClosed;

  const contextValue: TrialContextType = {
    subscription: subscription || null,
    isLoading,
    error: error as Error | null,
    isTrialModalOpen,
    closeTrialModal,
    openTrialModal,
    submitTrialCourses: submitTrialCoursesMutation.mutateAsync,
    isSubmitting: submitTrialCoursesMutation.isPending,
  };

  return (
    <TrialContext.Provider value={contextValue}>
      {children}

      {/* Trial Course Selection Dialog */}
      <TrialCourseSelectionDialog />
    </TrialContext.Provider>
  );
}

// Hook to use the trial context
export function useTrialContext() {
  const context = useContext(TrialContext);
  if (context === undefined) {
    throw new Error("useTrialContext must be used within a TrialProvider");
  }
  return context;
}
