//@ts-nocheck

import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { formatDuration } from "@/lib/formatDuration";
import { DocumentTextIcon } from "@heroicons/react/24/outline";
import { FileIcon, CodeIcon } from "lucide-react";

const CourseInclusions = ({ course }) => {
  let courseDuration = course?.totalDuration / 60;

  let formattedDuration = formatDuration(courseDuration);
  return (
    <>
      {courseDuration !== 0 && (
        <div className="pt-6 md:py-4">
          <Card className="p-0 border-none shadow-none">
            <CardContent className="flex items-start p-0">
              {/* Left section for video and coding exercises */}
              <div className="mr-10">
                <CardHeader className="p-0">
                  {/* Title for course inclusions */}
                  <h1 className="mb-6 text-2xl font-bold text-gray-800">
                    This Course Includes
                  </h1>
                </CardHeader>

                {/* List of course items */}
                <ul className="grid grid-cols-1 gap-4 md:grid-cols-2">
                  {formattedDuration && (
                    <li className="flex items-center gap-2">
                      <FileIcon className="w-4 h-4 stroke-gray-400" />
                      <span>{formattedDuration} on-demand video</span>
                    </li>
                  )}

                  <li className="flex items-center gap-2">
                    <CodeIcon className="w-4 h-4 stroke-gray-400" />
                    <span>Quiz</span>
                  </li>

                  <li className="flex items-center gap-2">
                    <CodeIcon className="w-4 h-4 stroke-gray-400" />
                    <span>Assignments</span>
                  </li>
                </ul>
              </div>

              {/* Right section for assignments and other inclusions */}
              <div>
                {/* Additional course items */}
                <ul className="mt-12 space-y-2"></ul>
              </div>
            </CardContent>
          </Card>
        </div>
      )}
    </>
  );
};

export default CourseInclusions;
