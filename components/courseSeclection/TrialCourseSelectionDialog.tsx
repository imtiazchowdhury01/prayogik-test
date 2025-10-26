// "use client";

// import React from "react";
// import { Dialog, DialogContent } from "@/components/ui/dialog";
// import { useTrialContext } from "@/hooks/useTrialContext";
// import { CourseSelection } from "./courses-selection";

// export function TrialCourseSelectionDialog() {
//   const { isTrialModalOpen, subscription, closeTrialModal } = useTrialContext();

//   return (
//     <Dialog
//       open={isTrialModalOpen}
//       onOpenChange={(open) => {
//         if (!open) {
//           closeTrialModal();
//         }
//       }}
//     >
//       <DialogContent className="max-w-4xl w-[95vw] h-[85vh] flex flex-col p-0">
//         {/* Course Selection Content */}
//         <div className="flex-1 overflow-hidden px-6 pb-6">
//           <CourseSelection
//             maxSelections={subscription?.subscriptionPlan?.trialCourseLimit}
//             className="h-full py-6"
//           />
//         </div>
//       </DialogContent>
//     </Dialog>
//   );
// }

// @ts-nocheck
"use client";
import React, { useCallback } from "react";
import { Dialog, DialogContent } from "@/components/ui/dialog";
import { useTrialContext } from "@/hooks/useTrialContext";
import { CourseSelection } from "./courses-selection";

export function TrialCourseSelectionDialog() {
  const {
    isTrialModalOpen,
    subscription,
    closeTrialModal,
    submitTrialCourses,
    isSubmitting,
  } = useTrialContext();

  const handleSubmit = useCallback(
    async (selectedCourseIds: string[]) => {
      try {
        await submitTrialCourses(selectedCourseIds);
        // Modal will be closed by the onClose callback
      } catch (error) {
        // Error handling is done by the trial context
        throw error; // Re-throw to let CourseSelection handle it
      }
    },
    [submitTrialCourses]
  );

  return (
    <Dialog
      open={isTrialModalOpen}
      onOpenChange={(open) => {
        if (!open) {
          closeTrialModal();
        }
      }}
    >
      <DialogContent className="max-w-4xl w-[95vw] h-[85vh] flex flex-col p-0">
        {/* Course Selection Content */}
        <div className="flex-1 overflow-hidden px-6 pb-6">
          <CourseSelection
            maxSelections={subscription?.subscriptionPlan?.trialCourseLimit}
            previouslySelectedIds={subscription?.trialSelectedCourseIds || []}
            onSubmit={handleSubmit}
            onClose={closeTrialModal}
            isSubmitting={isSubmitting}
            className="h-full py-6"
            showHeader={true}
            enableSearch={true}
            enableMobileToggle={true}
            // Optional: Custom texts for trial context
            texts={{
              title: "কোর্স নির্বাচন করুন",
              subtitle:
                "সর্বোচ্চ {maxSelections}টি কোর্স বেছে নিন। নির্বাচিত: {selectedCount}/{maxSelections}",
              submitButtonText: "নির্বাচন সম্পন্ন করুন",
            }}
          />
        </div>
      </DialogContent>
    </Dialog>
  );
}
