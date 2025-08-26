// @ts-nocheck
import { TextContent } from "@/components/TextContent";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { textLangChecker } from "@/lib/utils/textLangChecker";

const LiveCourseVisitorCard = ({ lesson, course }) => {
  console.log(lesson, "lessi");
  return (
    <div className="p-4 mb-4 bg-[#F3F9F9] rounded-md">
      <Accordion type="single" collapsible className="w-full">
        <AccordionItem value="lesson-details" className="border-none">
          <AccordionTrigger className="text-left hover:no-underline p-0">
            <p className="text-base text-black capitalize text-start">
              {textLangChecker(lesson?.title?.trim())}
            </p>
          </AccordionTrigger>
          <AccordionContent className="pt-4">
            {lesson.textContent && (
               <TextContent value={lesson?.textContent} size="sm"/>
            )}
          </AccordionContent>
        </AccordionItem>
      </Accordion>
    </div>
  );
};

export default LiveCourseVisitorCard;
