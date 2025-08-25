import { Card, CardContent } from "@/components/ui/card";

import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";

const SubscriptionFaq = () => {
  const faqs = [
    {
      question: "কোন কোন কোর্স প্রাইম মেম্বাররা ফ্রিতে এক্সেস করতে পারবেন?",
      answer:
        " প্রাইম এর আওতাধীন সমস্ত প্রিমিয়াম কোর্স প্রাইম মেম্বার'রা এক্সেস করতে পারবেন।",
    },
    {
      question: "কোন কোর্সগুলো প্রাইম  মেম্বাররা ছাড়ে পেতে পারেন?",
      answer:
        "প্রিমিয়াম কোর্স ছাড়া অন্যান্য সকল কোর্সে প্রাইম  মেম্বাররা বিশেষ ডিসকাউন্টে এক্সেস পাবেন।",
    },
    {
      question:
        "নতুন কোর্স যুক্ত হলে প্রাইম  মেম্বাররা কি সেটিতে এক্সেস পাবেন?",
      answer:
        "অবশ্যই। নতুন কোনো প্রিমিয়াম কোর্স যুক্ত হলে সেটিতে প্রাইম  মেম্বাররা ফ্রিতে এক্সেস পাবেন, এবং অন্যান্য নতুন কোর্সে থাকবে ডিসকাউন্ট সুবিধা।",
    },
    {
      question: "সাবস্ক্রিপশন বাতিল করলে কি রিফান্ড পাওয়া যাবে?",
      answer:
        "দুঃখিত, সাবস্ক্রিপশন বাতিলের ক্ষেত্রে কোনো রিফান্ড প্রদান করা হয় না।",
    },
  ];

  return (
    <section className="pb-16 max-w-7xl mx-auto md:px-0 px-6 mt-10">
      <h2 className="text-3xl font-bold text-gray-900 mb-12 text-center">
        প্রশ্নোত্তর (FAQ)
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

export default SubscriptionFaq;
