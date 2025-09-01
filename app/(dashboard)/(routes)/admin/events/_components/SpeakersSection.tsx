// components/event-form/SpeakersSection.tsx
import React from "react";
import { UseFormReturn, useFieldArray } from "react-hook-form";
import { User, Plus } from "lucide-react";
import { Element } from "react-scroll";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { SpeakerCard } from "./SpeakerCard";

interface SpeakersSectionProps {
  form: UseFormReturn<any>;
  onSpeakerImageUpload: (file: File, index: number) => void;
  speakerImageUploading: { [key: number]: boolean };
}

export const SpeakersSection: React.FC<SpeakersSectionProps> = ({
  form,
  onSpeakerImageUpload,
  speakerImageUploading,
}) => {
  const {
    fields: speakerFields,
    append: appendSpeaker,
    remove: removeSpeaker,
  } = useFieldArray({
    control: form.control,
    name: "speakers",
  });

  return (
    <Element name="section-speakers" id="section-speakers">
      <Card className="border-0 shadow-lg bg-card/80 backdrop-blur-sm">
        <CardHeader className="pb-4">
          <div className="flex items-center justify-between">
            <div>
              <CardTitle className="flex items-center gap-3 text-xl">
                <div className="w-8 h-8 rounded-lg bg-brand-accent flex items-center justify-center">
                  <User className="h-4 w-4 text-gray-700" />
                </div>
                Event Speakers
              </CardTitle>
              <p className="text-muted-foreground mt-1">
                Add speakers to showcase your event's expertise
              </p>
            </div>
            <Button
              type="button"
              variant="outline"
              onClick={() =>
                appendSpeaker({
                  name: "",
                  designation: "",
                  avatarUrl: "",
                })
              }
              className="h-10"
            >
              <Plus className="h-4 w-4 mr-2" />
              Add Speaker
            </Button>
          </div>
        </CardHeader>
        <CardContent>
          {speakerFields.length === 0 ? (
            <div className="text-center py-12 text-muted-foreground">
              <User className="h-12 w-12 mx-auto mb-4 opacity-50" />
              <p className="text-lg font-medium mb-2">No speakers added yet</p>
              <p>Click "Add Speaker" to get started</p>
            </div>
          ) : (
            <div className="space-y-6">
              {speakerFields.map((field, index) => (
                <SpeakerCard
                  key={field.id}
                  form={form}
                  index={index}
                  onRemove={() => removeSpeaker(index)}
                  onImageUpload={onSpeakerImageUpload}
                  imageUploading={speakerImageUploading[index] || false}
                />
              ))}
            </div>
          )}
        </CardContent>
      </Card>
    </Element>
  );
};