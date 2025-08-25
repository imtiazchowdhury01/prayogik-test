"use client";
import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Copy, Check, ExternalLink } from "lucide-react";
import { formatLiveCourseTime } from "@/lib/utils/formatLiveCourseTime";

const LiveLinkCard = ({ course }: any) => {
  const [copiedStates, setCopiedStates] = useState<Record<string, boolean>>({});

  const handleCopy = async (text: string, key: string) => {
    try {
      await navigator.clipboard.writeText(text);
      setCopiedStates((prev) => ({ ...prev, [key]: true }));

      // Reset the copied state after 2 seconds
      setTimeout(() => {
        setCopiedStates((prev) => ({ ...prev, [key]: false }));
      }, 2000);
    } catch (err) {
      console.error("Failed to copy text: ", err);
    }
  };

  const CopyButton = ({ text, copyKey }: { text: string; copyKey: string }) => {
    const isCopied = copiedStates[copyKey];

    return (
      <motion.button
        onClick={() => handleCopy(text, copyKey)}
        className={`px-3 py-2 text-sm rounded-md transition-all duration-300 ${
          isCopied
            ? "bg-gray-200 text-gray-700"
            : "bg-[#4AAFA6] text-white hover:bg-[#3a9690]"
        }`}
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
      >
        <AnimatePresence mode="wait" initial={false}>
          {isCopied ? (
            <motion.div
              key="check"
              initial={{ scale: 0, rotate: -180 }}
              animate={{ scale: 1, rotate: 0 }}
              exit={{ scale: 0, rotate: 180 }}
              transition={{ duration: 0.3, ease: "easeOut" }}
            >
              <Check size={16} />
            </motion.div>
          ) : (
            <motion.div
              key="copy"
              initial={{ scale: 0, rotate: 180 }}
              animate={{ scale: 1, rotate: 0 }}
              exit={{ scale: 0, rotate: -180 }}
              transition={{ duration: 0.3, ease: "easeOut" }}
            >
              <Copy size={16} />
            </motion.div>
          )}
        </AnimatePresence>
      </motion.button>
    );
  };

  return (
    <motion.div
      className="border rounded-lg p-6 bg-[#E7F5F4] border-[#4AAFA6]"
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 0.3, ease: "easeOut" }}
    >
      <div className="text-center">
        <motion.h3
          className="text-lg font-semibold text-brand mb-2"
          initial={{ y: -10, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.1, duration: 0.3 }}
        >
          আপনার এই কোর্সে অ্যাক্সেস রয়েছে
        </motion.h3>

        {/* Live Course Information */}
        {(course?.courseLiveLink ||
          course?.courseLiveLinkPassword ||
          course?.courseLiveLinkScheduledAt) && (
          <motion.div
            className="bg-white rounded-lg p-4 mb-4 border border-[#4AAFA6]/20"
            initial={{ y: 10, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.25, duration: 0.3 }}
          >
            <h4 className="text-md font-medium text-brand mb-3">
              লাইভ ক্লাস তথ্য
            </h4>

            <div className="space-y-3 text-left">
              {course?.courseLiveLink && (
                <div>
                  <label className="block text-sm font-medium text-fontcolor mb-1">
                    লাইভ লিংক:
                  </label>
                  <div className="flex items-center gap-2">
                    <input
                      type="text"
                      value={course.courseLiveLink}
                      readOnly
                      className="flex-1 px-3 py-2 text-sm bg-gray-50 border border-gray-200 rounded-md focus:outline-none"
                    />
                    <CopyButton
                      text={course.courseLiveLink}
                      copyKey="liveLink"
                    />
                  </div>
                </div>
              )}

              {course?.courseLiveLinkPassword && (
                <div>
                  <label className="block text-sm font-medium text-fontcolor mb-1">
                    পাসওয়ার্ড:
                  </label>
                  <div className="flex items-center gap-2">
                    <input
                      type="text"
                      value={course.courseLiveLinkPassword}
                      readOnly
                      className="flex-1 px-3 py-2 text-sm bg-gray-50 border border-gray-200 rounded-md focus:outline-none"
                    />
                    <CopyButton
                      text={course.courseLiveLinkPassword}
                      copyKey="password"
                    />
                  </div>
                </div>
              )}

              {course?.courseLiveLinkScheduledAt && (
                <div>
                  <label className="block text-sm font-medium text-fontcolor mb-1">
                    নির্ধারিত সময়:
                  </label>
                  <div className="px-3 py-2 text-sm bg-gray-50 border border-gray-200 rounded-md">
                    {formatLiveCourseTime(course?.courseLiveLinkScheduledAt)}
                  </div>
                </div>
              )}
            </div>

            {course?.courseLiveLink && (
              <motion.div
                className="mt-4"
                initial={{ y: 10, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ delay: 0.4, duration: 0.3 }}
              >
                <a
                  href={course.courseLiveLink}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center px-4 py-2 text-sm font-medium text-white bg-brand rounded-md hover:bg-bg-[#3a9690] transition-colors"
                >
                  <ExternalLink className="h-4 w-4 mr-2" />
                  লাইভ ক্লাসে যোগ দিন
                </a>
              </motion.div>
            )}
          </motion.div>
        )}
      </div>
    </motion.div>
  );
};

export default LiveLinkCard;
