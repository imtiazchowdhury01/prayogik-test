import { Card, CardContent } from "@/components/ui/card";

import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";

const FaqSection = () => {
  const faqs = [
    {
      question: "আমি কি সব কোর্স ফ্রি পাবো মেম্বারশিপ নিলে?",
      answer:
        "হ্যাঁ, প্রায়োগিক প্রাইম সাবস্ক্রিপশনের আওতায় আপনি প্রিমিয়াম কোর্সগুলো ১০০% ফ্রি ব্যবহার করতে পারবেন।",
    },
    {
      question: "আমি কি এককটা কোর্স আলাদা করেও কিনতে পারবো?",
      answer:
        "অবশ্যই। আপনি মেম্বার না হয়েও যেকোনো কোর্স কিনে শেখা শুরু করতে পারেন।",
    },
    {
      question: "কোর্সের মেয়াদ কতদিন থাকবে?",
      answer: "একবার কিনলে কোর্সে আজীবনের এক্সেস থাকবে।",
    },
    {
      question: "ফ্রি কনটেন্ট পাবো কোথায়?",
      answer:
        "আমরা প্রতি মাসে কিছু ফ্রি রিসোর্স ও ভিডিও পাবলিশ করবো – মেইলিং লিস্টে থাকলে আপনি আগে পাবেন।",
    },
  ];

  return (
    <section className="py-16">
      <h2 className="text-3xl font-bold text-gray-900 mb-12 text-center">
        সিকিউ প্রশ্নোত্তর (FAQ)
      </h2>

      <Accordion type="single" collapsible className="space-y-4">
        {faqs.map((faq, index) => (
          <Card key={index} className="border border-gray-200">
            <CardContent className="p-0">
              <AccordionItem value={`item-${index}`} className="border-0">
                <AccordionTrigger className="w-full p-6 text-left flex items-center justify-between hover:bg-gray-50 transition-colors [&[data-state=open]>svg]:rotate-180">
                  <span className="text-lg font-semibold text-gray-900 pr-4">
                    {index + 1}. {faq.question}
                  </span>
                </AccordionTrigger>
                <AccordionContent>
                  <div className="px-6 pb-6">
                    <div className="p-4 bg-gray-50 rounded-lg">
                      <p className="text-gray-700">→ {faq.answer}</p>
                    </div>
                  </div>
                </AccordionContent>
              </AccordionItem>
            </CardContent>
          </Card>
        ))}
      </Accordion>
    </section>
  );
};

export default FaqSection;
