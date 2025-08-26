import { useState } from "react";
import { Input } from "@/components/ui/input";
import {
  FormControl,
  FormDescription,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import toast from "react-hot-toast";

// Certifications Input Component
interface CertificationsInputProps {
  initialCertifications: string[];
  onUpdateCertifications: (updatedCertifications: string[]) => void;
}

const CertificationsInput = ({
  initialCertifications,
  onUpdateCertifications,
}: CertificationsInputProps) => {
  const [inputCertificateUrl, setInputCertificateUrl] = useState("");
  const [certificates, setCertificates] = useState<string[]>(
    initialCertifications
  );

  // Custom URL validation function
  const isValidUrl = (url: string) => {
    try {
      new URL(url); // Use the browser's built-in URL parser
      return true;
    } catch (error) {
      return false;
    }
  };

  // Handle certificate change
  const handleCertificateChange = (value: string) => {
    if (value.endsWith(",")) {
      const newCert = value.slice(0, -1).trim(); // Remove comma and trim whitespace

      if (newCert) {
        if (isValidUrl(newCert)) {
          // Check if the new certificate already exists
          if (!certificates.includes(newCert)) {
            const updatedCertificates = [...certificates, newCert];
            setCertificates(updatedCertificates);
            onUpdateCertifications(updatedCertificates); // Return updated list
          } else {
            toast.error("This URL is already added.");
          }
        } else {
          toast.error("Invalid URL format. Please enter a valid URL.");
        }
      }

      setInputCertificateUrl(""); // Reset the input field after a comma
    } else {
      setInputCertificateUrl(value); // Update input field as user types
    }
  };

  // Remove certificate by index
  const removeCertificate = (index: number) => {
    const updatedCertificates = certificates.filter((_, i) => i !== index);
    setCertificates(updatedCertificates);
    onUpdateCertifications(updatedCertificates); // Return updated list
  };

  return (
    <div className="">
      <div className="w-full">
        <FormItem>
          <FormControl>
            <Input
              placeholder="Enter Certifications"
              value={inputCertificateUrl}
              onChange={(e) => handleCertificateChange(e.target.value)}
            />
          </FormControl>
          <FormDescription>
            Write certifications with "," as separator
          </FormDescription>
          <FormMessage />
        </FormItem>
      </div>

      {/* Display certificates with delete option */}
      <div className="flex flex-wrap gap-2 mt-2">
        {certificates.map((cert, index) => (
          <div
            key={index}
            className="flex items-center gap-2 bg-gray-200 px-2 py-1 rounded text-sm"
          >
            <span>{cert}</span>
            <button
              type="button"
              onClick={() => removeCertificate(index)}
              className="text-red-500 hover:text-red-700"
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-4 w-4"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
                strokeWidth="2"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M6 18L18 6M6 6l12 12"
                />
              </svg>
            </button>
          </div>
        ))}
      </div>
    </div>
  );
};

export default CertificationsInput;
