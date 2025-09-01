// components/event-form/SpeakerCard.tsx
import React from "react";
import { UseFormReturn } from "react-hook-form";
import { Trash2, Upload } from "lucide-react";
import {
  FormField,
  FormItem,
  FormLabel,
  FormControl,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";

interface SpeakerCardProps {
  form: UseFormReturn<any>;
  index: number;
  onRemove: () => void;
  onImageUpload: (file: File, index: number) => void;
  imageUploading: boolean;
}

export const SpeakerCard: React.FC<SpeakerCardProps> = ({
  form,
  index,
  onRemove,
  onImageUpload,
  imageUploading,
}) => {
  return (
    <Card className="border border-border/50 bg-muted/20">
      <CardContent className="p-6">
        <div className="flex items-center justify-between mb-4">
          <h4 className="font-semibold text-lg flex items-center gap-2">
            Speaker {index + 1}
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

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <div className="space-y-4">
            <FormField
              control={form.control}
              name={`speakers.${index}.name`}
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="text-base font-medium">
                    <span className="text-destructive mr-1">*</span>
                    Speaker Name
                  </FormLabel>
                  <FormControl>
                    <Input
                      placeholder="Enter speaker's full name"
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
              name={`speakers.${index}.designation`}
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="text-base font-medium">
                    Designation
                  </FormLabel>
                  <FormControl>
                    <Input
                      placeholder="CEO, CTO, Senior Developer, etc."
                      className="h-11"
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>

          <div className="space-y-4">
            <FormLabel className="text-base font-medium">
              <span className="text-destructive mr-1">*</span>
              Speaker Photo
            </FormLabel>
            <div className="flex flex-col items-start gap-4">
              {form.watch(`speakers.${index}.avatarUrl`) && (
                <div className="relative group">
                  <img
                    src={
                      form.watch(`speakers.${index}.avatarUrl`) ||
                      "/default-image.jpg"
                    }
                    alt="Speaker"
                    className="rounded object-cover object-top border-4 border-background shadow-lg w-[221px] h-[160px]"
                  />
                  <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity rounded flex items-center justify-center">
                    <Badge variant="secondary" className="text-xs">
                      Current Photo
                    </Badge>
                  </div>
                </div>
              )}
              <div>
                <input
                  type="file"
                  accept="image/*"
                  onChange={(e) => {
                    const file = e.target.files?.[0];
                    if (file) onImageUpload(file, index);
                  }}
                  className="hidden"
                  id={`speaker-image-${index}`}
                />
                <Button
                  type="button"
                  variant="outline"
                  size="sm"
                  onClick={() =>
                    document.getElementById(`speaker-image-${index}`)?.click()
                  }
                  disabled={imageUploading}
                  className="h-10"
                >
                  <Upload className="h-3 w-3 mr-2" />
                  {imageUploading ? "Uploading..." : "Upload Photo"}
                </Button>
              </div>
            </div>
            <FormField
              control={form.control}
              name={`speakers.${index}.avatarUrl`}
              render={({ field }) => (
                <FormItem className="hidden">
                  <FormControl>
                    <Input {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>
        </div>
      </CardContent>
    </Card>
  );
};