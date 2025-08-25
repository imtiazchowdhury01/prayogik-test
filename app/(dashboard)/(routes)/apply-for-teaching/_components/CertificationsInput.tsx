import { useState, useEffect } from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import {
  FormControl,
  FormDescription,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Plus, X, Award } from "lucide-react";
import toast from "react-hot-toast";

// Certifications Input Component
interface CertificationsInputProps {
  initialCertifications: string[];
  onUpdateCertifications: (updatedCertifications: string[]) => void;
}

interface Certification {
  name: string;
  url: string;
}

const CertificationsInput = ({
  initialCertifications,
  onUpdateCertifications,
}: CertificationsInputProps) => {
  const [certifications, setCertifications] = useState<Certification[]>([
    { name: "", url: "" },
  ]);

  // Parse initial certifications when component mounts
  useEffect(() => {
    if (initialCertifications && initialCertifications.length > 0) {
      const parsedCertifications = initialCertifications.map((cert) => {
        // Try to parse the existing certification string format "Name - URL"
        const parts = cert.split(" - ");
        return {
          name: parts[0] || "",
          url: parts[1] || cert, // If no separator found, treat as URL
        };
      });
      setCertifications(parsedCertifications);
    }
  }, [initialCertifications]);

  // Custom URL validation function
  const isValidUrl = (url: string) => {
    if (!url.trim()) return true; // Allow empty URLs
    try {
      new URL(url);
      return true;
    } catch (error) {
      return false;
    }
  };

  // Add new certification entry
  const addCertification = () => {
    setCertifications([...certifications, { name: "", url: "" }]);
  };

  // Remove certification by index
  const removeCertification = (index: number) => {
    if (certifications.length > 1) {
      const updatedCertifications = certifications.filter(
        (_, i) => i !== index
      );
      setCertifications(updatedCertifications);
      updateParentComponent(updatedCertifications);
    }
  };

  // Update certification at specific index
  const updateCertification = (
    index: number,
    field: "name" | "url",
    value: string
  ) => {
    const updated = [...certifications];
    updated[index][field] = value;
    setCertifications(updated);
    // Only update parent when there's a valid URL to avoid losing UI state while typing
    if (field === "url" || updated[index].url.trim()) {
      updateParentComponent(updated);
    }
  };

  // Update parent component with formatted data
  const updateParentComponent = (updatedCertifications: Certification[]) => {
    // Only format certifications that have at least a URL (since that's what the original expected)
    const formattedCertifications = updatedCertifications
      .filter((cert) => cert.url.trim()) // Only include entries with URLs
      .map((cert) => {
        if (cert.name.trim() && cert.url.trim()) {
          return `${cert.name.trim()} - ${cert.url.trim()}`;
        } else {
          return cert.url.trim();
        }
      });

    onUpdateCertifications(formattedCertifications);
  };

  // Validate URLs on blur
  const validateUrl = (url: string, index: number) => {
    if (url.trim() && !isValidUrl(url)) {
      toast.error("Invalid URL format. Please enter a valid URL.");
    }
  };

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <FormLabel className="flex items-center gap-2">
          <span className="text-base font-medium">সার্টিফিকেশন</span>
        </FormLabel>
        <Button
          type="button"
          variant="outline"
          size="sm"
          onClick={addCertification}
          className="flex items-center gap-2"
        >
          <Plus className="w-4 h-4" />
          যোগ করুন
        </Button>
      </div>

      <div className="space-y-4">
        {certifications.map((cert, index) => (
          <div key={index} className="p-4 border rounded-lg bg-gray-50">
            <div className="flex items-center justify-between mb-3">
              <div className="flex items-center gap-2">
                <Award className="w-4 h-4 text-blue-600" />
                <span className="font-medium text-sm">
                  সার্টিফিকেশন {index + 1}
                </span>
              </div>
              {certifications.length > 1 && (
                <Button
                  type="button"
                  variant="ghost"
                  size="sm"
                  onClick={() => removeCertification(index)}
                  className="text-red-500 hover:text-red-700"
                >
                  <X className="w-4 h-4" />
                </Button>
              )}
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor={`cert-name-${index}`}>সার্টিফিকেটের নাম</Label>
                <Input
                  id={`cert-name-${index}`}
                  placeholder="যেমন: IELTS, TOEFL, Google Analytics"
                  value={cert.name}
                  onChange={(e) =>
                    updateCertification(index, "name", e.target.value)
                  }
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor={`cert-url-${index}`}>সার্টিফিকেট URL</Label>
                <Input
                  id={`cert-url-${index}`}
                  placeholder="https://certificate-url.com"
                  value={cert.url}
                  onChange={(e) =>
                    updateCertification(index, "url", e.target.value)
                  }
                  onBlur={(e) => {
                    validateUrl(e.target.value, index);
                    // Update parent component on blur to ensure final state is captured
                    updateParentComponent(certifications);
                  }}
                />
              </div>
            </div>
          </div>
        ))}
      </div>

      <FormDescription className="text-sm text-gray-600">
        আপনার প্রাসঙ্গিক সার্টিফিকেশন যোগ করুন।
      </FormDescription>
    </div>
  );
};

export default CertificationsInput;
