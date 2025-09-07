// components/event-form/BasicInfoSection.tsx
import React from "react";
import { UseFormReturn } from "react-hook-form";
import { Calendar, DollarSign, FileText } from "lucide-react";
import { Element } from "react-scroll";
import {
  FormField,
  FormItem,
  FormLabel,
  FormControl,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import JoditEditor from "jodit-react";

interface BasicInfoSectionProps {
  form: UseFormReturn<any>;
  eventTypes: ReadonlyArray<{ value: string; label: string }>;
  eventStatusOptions: ReadonlyArray<{ value: string; label: string }>;
  joditConfig: any;
  watchType?: string;
}

export const BasicInfoSection: React.FC<BasicInfoSectionProps> = ({
  form,
  eventTypes,
  eventStatusOptions,
  joditConfig,
  watchType,
}) => {
  return (
    <Element name="section-basic" id="section-basic">
      <Card className="border-0 shadow-lg bg-card/80 backdrop-blur-sm">
        <CardHeader className="pb-4">
          <CardTitle className="flex items-center gap-3 text-xl">
            <div className="w-8 h-8 rounded-lg bg-brand-accent flex items-center justify-center">
              <Calendar className="h-4 w-4 text-gray-700" />
            </div>
            Basic Information
          </CardTitle>
          <p className="text-muted-foreground">
            Essential details about your event
          </p>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <FormField
              control={form.control}
              name="title"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="text-base font-medium">
                    <span className="text-destructive mr-1">*</span>
                    Title
                  </FormLabel>
                  <FormControl>
                    <Input
                      placeholder="e.g. Annual Tech Conference 2024"
                      className="h-12 text-base"
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="slug"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="text-base font-medium">
                    <span className="text-destructive mr-1">*</span>Slug
                  </FormLabel>
                  <FormControl>
                    <Input
                      placeholder="annual-tech-conference-2024"
                      className="h-12 text-base bg-muted/50"
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>

          <FormField
            control={form.control}
            name="description"
            render={({ field }) => (
              <FormItem>
                <FormLabel className="text-base font-medium">
                  Description
                </FormLabel>
                <FormControl>
                  <div className="border rounded-lg overflow-hidden">
                    <JoditEditor
                      value={field.value || ""}
                      onBlur={field.onChange}
                      config={joditConfig}
                    />
                  </div>
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <FormField
              control={form.control}
              name="date"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="flex items-center gap-2 text-base font-medium">
                    <p>
                      <span className="text-destructive mr-1">*</span>
                      Event Date & Time
                    </p>
                  </FormLabel>
                  <FormControl>
                    <Input
                      disabled={form.formState.isSubmitting}
                      type="datetime-local"
                      className="h-12 text-base w-fit"
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="type"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="text-base font-medium">
                    <span className="text-destructive mr-1">*</span>
                    Event Type
                  </FormLabel>
                  <Select
                    onValueChange={field.onChange}
                    defaultValue={field.value}
                  >
                    <FormControl>
                      <SelectTrigger className="h-12 text-base">
                        <SelectValue placeholder="Select event type" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      {eventTypes.map((type) => (
                        <SelectItem key={type.value} value={type.value}>
                          {type.label}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Price field - only show for PAID events */}
            {watchType === "PAID" && (
              <FormField
                control={form.control}
                name="price"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="flex items-center gap-2 text-base font-medium">
                      <DollarSign className="h-4 w-4" />
                      <span className="text-destructive mr-1">*</span>
                      Price
                    </FormLabel>
                    <FormControl>
                      <Input
                        type="number"
                        step="0.01"
                        min="0"
                        placeholder="0.00"
                        className="h-12 text-base"
                        {...field}
                        value={field.value || ""}
                        onChange={(e) => {
                          const value = e.target.value;
                          field.onChange(value === "" ? undefined : value);
                        }}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            )}

            <FormField
              control={form.control}
              name="status"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="flex items-center gap-2 text-base font-medium">
                    <FileText className="h-4 w-4" />
                    <span className="text-destructive mr-1">*</span>
                    Status
                  </FormLabel>
                  <Select
                    onValueChange={field.onChange}
                    defaultValue={field.value}
                  >
                    <FormControl>
                      <SelectTrigger className="h-12 text-base">
                        <SelectValue placeholder="Select event status" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      {eventStatusOptions.map((status) => (
                        <SelectItem key={status.value} value={status.value}>
                          {status.label}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>
        </CardContent>
      </Card>
    </Element>
  );
};
