import React from "react";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
const Faq = () => {
  const faqData = [
    {
      id: "1",
      question: "কোর্সের ভর্তি বাতিল করা কী সম্ভব ?",
      answer:
        "আপনার সার্টিফিকেটের মেয়াদ কখনোই শেষ হবেনা, আপনি নিজের সুবিধামত সার্টিফিকেটটি যখন ইচ্ছা ব্যবহার করতে পারবেন। আপনার সার্টিফিকেটের মেয়াদ কখনোই শেষ হবেনা, আপনি নিজের সুবিধামত সার্টিফিকেটটি যখন ইচ্ছা ব্যবহার করতে পারবেন।",
    },
    {
      id: "2",
      question: "কোন টেকনিকাল সমস্যা কিভাবে রিপোর্ট করবো ?",
      answer:
        "আপনার সার্টিফিকেটের মেয়াদ কখনোই শেষ হবেনা, আপনি নিজের সুবিধামত সার্টিফিকেটটি যখন ইচ্ছা ব্যবহার করতে পারবেন। আপনার সার্টিফিকেটের মেয়াদ কখনোই শেষ হবেনা, আপনি নিজের সুবিধামত সার্টিফিকেটটি যখন ইচ্ছা ব্যবহার করতে পারবেন।",
    },
    {
      id: "3",
      question: "পাসওয়ার্ড ভুলে গেলে কিভাবে ঠিক করবো ?",
      answer:
        "আপনার সার্টিফিকেটের মেয়াদ কখনোই শেষ হবেনা, আপনি নিজের সুবিধামত সার্টিফিকেটটি যখন ইচ্ছা ব্যবহার করতে পারবেন। আপনার সার্টিফিকেটের মেয়াদ কখনোই শেষ হবেনা, আপনি নিজের সুবিধামত সার্টিফিকেটটি যখন ইচ্ছা ব্যবহার করতে পারবেন।",
    },
    {
      id: "4",
      question: "আপনাদের সাতে কিভাবে যোগাযোগ করবো ?",
      answer:
        "আপনার সার্টিফিকেটের মেয়াদ কখনোই শেষ হবেনা, আপনি নিজের সুবিধামত সার্টিফিকেটটি যখন ইচ্ছা ব্যবহার করতে পারবেন। আপনার সার্টিফিকেটের মেয়াদ কখনোই শেষ হবেনা, আপনি নিজের সুবিধামত সার্টিফিকেটটি যখন ইচ্ছা ব্যবহার করতে পারবেন।",
    },
  ];
  return (
    <section className="my-16" id="faq">
      <h4 className="mb-4 text-2xl font-bold text-fontcolor-title">
        কিছু প্রশ্ন এবং উত্তর
      </h4>
      <Accordion type="single" collapsible className="w-full">
        {faqData.map((data) => {
          return (
            <AccordionItem
              value={data.id}
              className="data-[state=open]:border-[1px] border-b-0 data-[state=open]:shadow-md p-4 rounded-lg data-[state=open]:border-greyscale-300"
            >
              <AccordionTrigger className="text-lg font-medium data-[state=open]:border-b-[1px] data-[state=open]:border-greyscale-300 hover:no-underline text-fontcolor-title ">
                {data.question}
              </AccordionTrigger>
              <AccordionContent className="text-base text-fontcolor-description pt-3">
                {data.answer}
              </AccordionContent>
            </AccordionItem>
          );
        })}
      </Accordion>
    </section>
  );
};

export default Faq;
