// hooks/useScrollSpy.ts
import { useEffect } from "react";

interface FormStep {
  id: string;
  label: string;
  icon: React.ComponentType<{ className?: string }>;
}

export const useScrollSpy = (
  steps: FormStep[],
  setCurrentStep: (step: string) => void
) => {
  useEffect(() => {
    const handleScroll = () => {
      const sections = steps.map((step) => step.id);
      const scrollPosition = window.scrollY + 200; // Offset for better detection

      for (let i = sections.length - 1; i >= 0; i--) {
        const element = document.getElementById(`section-${sections[i]}`);
        if (element && element.offsetTop <= scrollPosition) {
          setCurrentStep(sections[i]);
          break;
        }
      }
    };

    window.addEventListener("scroll", handleScroll);
    handleScroll(); // Initial check

    return () => window.removeEventListener("scroll", handleScroll);
  }, [steps, setCurrentStep]);
};