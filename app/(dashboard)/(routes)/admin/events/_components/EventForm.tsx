// components/event-form/EventForm.tsx
"use client";

import React, { useEffect } from "react";
import {
  Calendar,
  MapPin,
  ImageIcon,
  User,
  HelpCircle,
  Loader,
} from "lucide-react";
import { Form } from "@/components/ui/form";
import { Button } from "@/components/ui/button";
import { EventFormProgress } from "./EventFormProgress";
import { BasicInfoSection } from "./BasicInfoSection";
import { LocationSection } from "./LocationSection";
import { MediaSection } from "./MediaSection";
import { SpeakersSection } from "./SpeakersSection";
import { FAQsSection } from "./FAQsSection";
import { EVENT_TYPES } from "@/data/event-constant";
import { useEventForm } from "@/hooks/use-event-form";
import { useScrollSpy } from "@/hooks/use-scroll-spy";

const FORM_STEPS = [
  { id: "basic", label: "Basic Info", icon: Calendar },
  { id: "location", label: "Location", icon: MapPin },
  { id: "media", label: "Media", icon: ImageIcon },
  { id: "speakers", label: "Speakers", icon: User },
  { id: "faqs", label: "FAQs", icon: HelpCircle },
];

interface EventFormProps {
  initialData?: any;
  mode: "create" | "update";
}

export const EventForm: React.FC<EventFormProps> = ({ initialData, mode }) => {
  const {
    form,
    loading,
    uploading,
    speakerImageUploading,
    currentStep,
    setCurrentStep,
    watchIsOnline,
    joditConfig,
    handleEventImageUpload,
    handleSpeakerImageUpload,
    onSubmit,
    EVENT_STATUS_OPTIONS
  } = useEventForm(initialData, mode);
const watchType = form.watch("type");
  useScrollSpy(FORM_STEPS, setCurrentStep);

  // Apply Jodit styles
  useEffect(() => {
    const style = document.createElement("style");
    style.innerHTML = `
    .jodit-wysiwyg h1 {
      font-size: 20px !important;
      font-weight: bold !important;
      display: block !important;
    }
    .jodit-wysiwyg h2 {
      font-size: 18px !important;
      font-weight: bold !important;
      display: block !important;
    }
    .jodit-wysiwyg h3 {
      font-size: 16px !important;
      font-weight: bold !important;
      display: block !important;
    }
    .jodit-wysiwyg ul {
      list-style-type: disc !important;
      margin-left: 1.5em !important;
      padding-left: 1em !important;
    }
    .jodit-wysiwyg ol {
      list-style-type: decimal !important;
      margin-left: 1.5em !important;
      padding-left: 1em !important;
    }
    .jodit-wysiwyg li {
      display: list-item !important;
      margin-left: 0 !important;
    }
  `;
    document.head.appendChild(style);

    return () => {
      document.head.removeChild(style);
    };
  }, []);

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-muted/30 to-background">
      <div className="container mx-auto px-4 py-8 max-w-5xl">
        <div className="text-center mb-12">
          
          <h1 className="text-4xl font-bold text-foreground mb-2 text-balance">
            {mode === "create" ? "Create New Event" : "Edit Event"}
          </h1>
        </div>

        <EventFormProgress steps={FORM_STEPS} currentStep={currentStep} />

        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
            <BasicInfoSection
              form={form}
              eventTypes={EVENT_TYPES}
              joditConfig={joditConfig}
              eventStatusOptions={EVENT_STATUS_OPTIONS}
              watchType={watchType}
            />

            <LocationSection form={form} watchIsOnline={watchIsOnline} />

            <MediaSection
              form={form}
              uploading={uploading}
              onImageUpload={handleEventImageUpload}
            />

            <SpeakersSection
              form={form}
              onSpeakerImageUpload={handleSpeakerImageUpload}
              speakerImageUploading={speakerImageUploading}
            />

            <FAQsSection form={form} />

            <Button
              type="submit"
              disabled={
                loading ||
                uploading ||
                Object.values(speakerImageUploading).some(Boolean)
              }
              variant="primary"
            >
              {loading ? (
                <>
                  <Loader className="animate-spin h-4 w-4 mr-2" />
                  {mode === "create" ? "Creating..." : "Updating..."}
                </>
              ) : (
                <>{mode === "create" ? "Publish Event" : "Update Event"}</>
              )}
            </Button>
          </form>
        </Form>
      </div>
    </div>
  );
};
