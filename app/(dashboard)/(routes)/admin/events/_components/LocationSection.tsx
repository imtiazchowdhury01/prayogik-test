// components/event-form/LocationSection.tsx
import React from "react";
import { UseFormReturn } from "react-hook-form";
import { MapPin, Globe } from "lucide-react";
import { Element } from "react-scroll";
import {
  FormField,
  FormItem,
  FormLabel,
  FormControl,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Checkbox } from "@/components/ui/checkbox";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

interface LocationSectionProps {
  form: UseFormReturn<any>;
  watchIsOnline: boolean;
}

export const LocationSection: React.FC<LocationSectionProps> = ({
  form,
  watchIsOnline,
}) => {
  return (
    <Element name="section-location" id="section-location">
      <Card className="border-0 shadow-lg bg-card/80 backdrop-blur-sm">
        <CardHeader className="pb-4">
          <CardTitle className="flex items-center gap-3 text-xl">
            <div className="w-8 h-8 rounded-lg bg-brand-accent flex items-center justify-center">
              <MapPin className="h-4 w-4 text-gray-700" />
            </div>
            Event Location
          </CardTitle>
          <p className="text-muted-foreground">
            Where will your event take place?
          </p>
        </CardHeader>
        <CardContent className="space-y-6">
          <FormField
            control={form.control}
            name="isOnline"
            render={({ field }) => (
              <FormItem>
                <div className="flex items-center space-x-3 p-4 border rounded-lg bg-muted/30">
                  <FormControl>
                    <Checkbox
                      checked={field.value}
                      onCheckedChange={field.onChange}
                      className="data-[state=checked]:bg-brand data-[state=checked]:border-brand"
                    />
                  </FormControl>
                  <div className="flex items-center gap-2">
                    <Globe className="h-4 w-4 text-brand/70" />
                    <FormLabel className="text-base font-medium cursor-pointer">
                      This is an online event
                    </FormLabel>
                  </div>
                </div>
              </FormItem>
            )}
          />

          {!watchIsOnline ? (
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <FormField
                control={form.control}
                name="location"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-base font-medium">
                      <span className="text-destructive mr-1">*</span>
                      Location
                    </FormLabel>
                    <FormControl>
                      <Input
                        placeholder="Enter event venue address"
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
                name="mapLocation"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-base font-medium">
                      Map Location
                    </FormLabel>
                    <FormControl>
                      <Input
                        placeholder="Google Maps URL or coordinates"
                        className="h-12 text-base"
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>
          ) : (
            <FormField
              control={form.control}
              name="zoomLink"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="text-base font-medium">
                    Meeting Link
                  </FormLabel>
                  <FormControl>
                    <Input
                      placeholder="https://zoom.us/j/... or meeting platform URL"
                      type="url"
                      className="h-12 text-base"
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          )}
        </CardContent>
      </Card>
    </Element>
  );
};