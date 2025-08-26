// @ts-nocheck
import React from "react";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";

export const BootcampFAQ: React.FC = () => {
  const faqs = [
    {
      id: 1,
      question: "কোর্সের ভর্তি বাতিল করা কী সম্ভব ?",
      answer: "",
    },
    {
      id: 2,
      question: "সার্টিফিকেটের মেয়াদ কী শেষ হবে ?",
      answer:
        "আপনার সার্টিফিকেটের মেয়াদ কখনোই শেষ হবেনা, আপনি নিজের সুবিধামত সার্টিফিকেটটি যখন ইচ্ছা ব্যবহার করতে পারবেন। আপনার সার্টিফিকেটের মেয়াদ কখনোই শেষ হবেনা, আপনি নিজের সুবিধামত সার্টিফিকেটটি যখন ইচ্ছা ব্যবহার করতে পারবেন।",
    },
    {
      id: 3,
      question: "কোন টেকনিকাল সমস্যা কিভাবে রিপোর্ট করবো ?",
      answer: "",
    },
    {
      id: 4,
      question: "পাসওয়ার্ড ভুলে গেলে কিভাবে ঠিক করবো ?",
      answer: "",
    },
    {
      id: 5,
      question: "আপনাদের সাতে কিভাবে যোগাযোগ করবো ?",
      answer: "",
    },
  ];

  return (
    <>
      <main className="w-full flex flex-col  mt-5 py-5 mx-auto my-0 ">
        <header className="flex gap-2 justify-between items-center mb-4 w-full text-slate-900 max-sm:flex-col max-sm:gap-1 max-sm:items-start">
          <h1 className="text-2xl font-bold leading-none max-sm:text-lg">
            কিছু প্রশ্ন এবং উত্তর
          </h1>
        </header>

        <div className="mt-4">
          <Accordion type="single" collapsible className="w-full">
            {faqs.map((data, ind) => {
              return (
                <AccordionItem
                  value={data?.id}
                  key={ind}
                  className="data-[state=open]:border-[1px] border-b-0 data-[state=open]:shadow-md p-3 rounded-lg data-[state=open]:border-greyscale-300 data-[state=open]:bg-white"
                >
                  <AccordionTrigger className="text-lg font-medium data-[state=open]:border-b-[1px] data-[state=open]:border-greyscale-100 hover:no-underline text-fontcolor-title ">
                    {data?.question}
                  </AccordionTrigger>
                  <AccordionContent className="text-base text-fontcolor-descriptionpt-3">
                    <div className="text-sm leading-5 text-slate-900 max-sm:text-sm max-sm:leading-4">
                      {data?.answer &&
                        data?.answer.split("\n").map((text, index) => (
                          <React.Fragment key={index}>
                            <p>{text}</p>
                            {index < data?.answer.split("\n").length - 1 && (
                              <br />
                            )}
                          </React.Fragment>
                        ))}
                    </div>
                  </AccordionContent>
                </AccordionItem>
              );
            })}
          </Accordion>
        </div>
      </main>
    </>
  );
};
