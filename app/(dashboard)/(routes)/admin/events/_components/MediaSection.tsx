// components/event-form/MediaSection.tsx
import React from "react";
import { UseFormReturn } from "react-hook-form";
import { ImageIcon, Upload } from "lucide-react";
import { Element } from "react-scroll";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";

interface MediaSectionProps {
  form: UseFormReturn<any>;
  uploading: boolean;
  onImageUpload: (file: File) => void;
}

export const MediaSection: React.FC<MediaSectionProps> = ({
  form,
  uploading,
  onImageUpload,
}) => {
  return (
    <Element name="section-media" id="section-media">
      <Card className="border-0 shadow-lg bg-card/80 backdrop-blur-sm">
        <CardHeader className="pb-4">
          <CardTitle className="flex items-center gap-3 text-xl">
            <div className="w-8 h-8 rounded-lg bg-brand-accent flex items-center justify-center">
              <ImageIcon className="h-4 w-4 text-gray-700" />
            </div>
            Event Media
          </CardTitle>
          <p className="text-muted-foreground">
            Add visual appeal to your event
          </p>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {form.watch("imageUrl") && (
              <div className="relative group">
                <img
                  src={form.watch("imageUrl") || "/placeholder.svg"}
                  alt="Event"
                  width={400}
                  height={240}
                  className="rounded-xl object-cover shadow-md"
                />
                <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity rounded-xl flex items-center justify-center">
                  <Badge variant="secondary">Current Event Image</Badge>
                </div>
              </div>
            )}
            <div>
              <input
                type="file"
                accept="image/*"
                onChange={(e) => {
                  const file = e.target.files?.[0];
                  if (file) onImageUpload(file);
                }}
                className="hidden"
                id="event-image"
              />
              <Button
                type="button"
                variant="outline"
                size="lg"
                onClick={() =>
                  document.getElementById("event-image")?.click()
                }
                disabled={uploading}
                className="h-12"
              >
                <Upload className="h-4 w-4 mr-2" />
                {uploading ? "Uploading..." : "Upload Event Image"}
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>
    </Element>
  );
};