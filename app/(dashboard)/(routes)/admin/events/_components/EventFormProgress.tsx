// components/event-form/EventFormProgress.tsx
import React from "react";
import { Link, scroller } from "react-scroll";
import { CheckCircle2 } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";

interface FormStep {
  id: string;
  label: string;
  icon: React.ComponentType<{ className?: string }>;
}

interface EventFormProgressProps {
  steps: FormStep[];
  currentStep: string;
  completedSteps?: string[];
}

export const EventFormProgress: React.FC<EventFormProgressProps> = ({
  steps,
  currentStep,
  completedSteps = [],
}) => {
  const scrollToSection = (sectionId: string) => {
    scroller.scrollTo(`section-${sectionId}`, {
      duration: 1500,
      delay: 0,
      offset: -100,
    });
  };

  return (
    <Card className="mb-8 border-0 shadow-sm bg-card/50 backdrop-blur-sm sticky top-4 z-10">
      <CardContent className="p-6">
        <div className="flex items-center justify-between">
          {steps.map((step) => {
            const Icon = step.icon;
            const isCompleted = completedSteps.includes(step.id);
            const isCurrent = currentStep === step.id;

            return (
              <div key={step.id} className="flex items-center">
                <Link
                  to={`section-${step.id}`}
                  className="cursor-pointer"
                  onClick={() => scrollToSection(step.id)}
                >
                  <div
                    className={`flex items-center gap-3 transition-colors hover:text-brand ${
                      isCurrent ? "text-brand" : "text-muted-foreground"
                    }`}
                  >
                    <div
                      className={`w-10 h-10 rounded-full flex items-center justify-center border-2 transition-colors ${
                        isCurrent
                          ? "border-brand bg-brand/10"
                          : "border-muted hover:border-brand/50"
                      }`}
                    >
                      {isCompleted ? (
                        <CheckCircle2 className="h-5 w-5 text-green-600" />
                      ) : (
                        <Icon className="h-5 w-5" />
                      )}
                    </div>
                    <span className="font-medium hidden sm:block">
                      {step.label}
                    </span>
                  </div>
                </Link>
              </div>
            );
          })}
        </div>
      </CardContent>
    </Card>
  );
};