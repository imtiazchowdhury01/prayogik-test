import { Preview } from "@/components/preview";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { Lock } from "lucide-react";

interface Chapter {
  id: string;
  title: string;
  description: string;
  videoUrl?: string;
}

interface Course {
  chapters: Chapter[];
  attachments?: any[];
  purchases?: any[];
}

export default function CourseContent({ course }: { course: Course }) {
  return (
    <div className="max-w-4xl mx-auto">
      <div className="mt-6 md:mt-10">
        <h2 className="text-xl md:text-2xl font-semibold mb-5 md:mb-7">
          লেসন গুলো
        </h2>
        <Accordion type="single" collapsible className="w-full text-gray-700">
          {course.chapters.map((chapter) => (
            <AccordionItem
              key={chapter.id}
              className="border px-4 shadow-sm rounded-md mb-2"
              value={chapter.id}
            >
              <AccordionTrigger className="font-bold text-left hover:no-underline">
                {chapter.title}
              </AccordionTrigger>
              <AccordionContent className="pt-4 bg-white border-t space-y-4">
                <div className="flex justify-between items-start gap-x-4">
                  <div className="flex-1">
                    <Preview value={chapter.description!} />
                  </div>
                  <div className="flex items-center gap-x-2">
                    <Lock className="h-4 w-4" />
                  </div>
                </div>
              </AccordionContent>
            </AccordionItem>
          ))}
        </Accordion>
      </div>
    </div>
  );
}
