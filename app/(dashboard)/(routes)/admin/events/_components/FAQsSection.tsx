// components/event-form/FAQsSection.tsx
import React from "react";
import { UseFormReturn, useFieldArray } from "react-hook-form";
import { HelpCircle, Plus } from "lucide-react";
import { Element } from "react-scroll";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { FAQCard } from "./FAQCard";

interface FAQsSectionProps {
  form: UseFormReturn<any>;
}

export const FAQsSection: React.FC<FAQsSectionProps> = ({ form }) => {
  const {
    fields: faqFields,
    append: appendFaq,
    remove: removeFaq,
  } = useFieldArray({
    control: form.control,
    name: "faqs",
  });

  return (
    <Element name="section-faqs" id="section-faqs">
      <Card className="border-0 shadow-lg bg-card/80 backdrop-blur-sm">
        <CardHeader className="pb-4">
          <div className="flex items-center justify-between">
            <div>
              <CardTitle className="flex items-center gap-3 text-xl">
                <div className="w-8 h-8 rounded-lg bg-brand-accent flex items-center justify-center">
                  <HelpCircle className="h-4 w-4 text-gray-700" />
                </div>
                Frequently Asked Questions
              </CardTitle>
              <p className="text-muted-foreground mt-1">
                Help attendees with common questions
              </p>
            </div>
            <Button
              type="button"
              variant="outline"
              onClick={() => appendFaq({ question: "", answer: "" })}
              className="h-10"
            >
              <Plus className="h-4 w-4 mr-2" />
              Add FAQ
            </Button>
          </div>
        </CardHeader>
        <CardContent>
          {faqFields.length === 0 ? (
            <div className="text-center py-12 text-muted-foreground">
              <HelpCircle className="h-12 w-12 mx-auto mb-4 opacity-50" />
              <p className="text-lg font-medium mb-2">No FAQs added yet</p>
              <p>Click "Add FAQ" to help your attendees</p>
            </div>
          ) : (
            <div className="space-y-6">
              {faqFields.map((field, index) => (
                <FAQCard
                  key={field.id}
                  form={form}
                  index={index}
                  onRemove={() => removeFaq(index)}
                />
              ))}
            </div>
          )}
        </CardContent>
      </Card>
    </Element>
  );
};