// components/event-form/FAQCard.tsx
import React from "react";
import { UseFormReturn } from "react-hook-form";
import { Trash2 } from "lucide-react";
import {
  FormField,
  FormItem,
  FormLabel,
  FormControl,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";

interface FAQCardProps {
  form: UseFormReturn<any>;
  index: number;
  onRemove: () => void;
}

export const FAQCard: React.FC<FAQCardProps> = ({ form, index, onRemove }) => {
  return (
    <Card className="border border-border/50 bg-muted/20">
      <CardContent className="p-6">
        <div className="flex items-center justify-between mb-4">
          <h4 className="font-semibold text-lg flex items-center gap-2">
            <div className="w-6 h-6 rounded-full bg-accent/20 flex items-center justify-center text-xs font-bold text-accent">
              {index + 1}
            </div>
            FAQ {index + 1}
          </h4>
          <Button
            type="button"
            variant="ghost"
            size="sm"
            onClick={onRemove}
            className="text-destructive hover:text-destructive hover:bg-destructive/10"
          >
            <Trash2 className="h-4 w-4" />
          </Button>
        </div>

        <div className="space-y-4">
          <FormField
            control={form.control}
            name={`faqs.${index}.question`}
            render={({ field }) => (
              <FormItem>
                <FormLabel className="text-base font-medium">Question</FormLabel>
                <FormControl>
                  <Input
                    placeholder="What question do attendees frequently ask?"
                    className="h-11"
                    {...field}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name={`faqs.${index}.answer`}
            render={({ field }) => (
              <FormItem>
                <FormLabel className="text-base font-medium">Answer</FormLabel>
                <FormControl>
                  <Textarea
                    placeholder="Provide a clear and helpful answer..."
                    rows={3}
                    className="resize-none"
                    {...field}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>
      </CardContent>
    </Card>
  );
};