//@ts-nocheck

import { formatDateToBangla } from "@/lib/utils/stringUtils";
import { Calendar, Mail, Phone } from "lucide-react";

// Individual field component
const DisplayField = ({ label, value, className = "", type }) => {
  // Get icon based on field type
  const getIcon = () => {
    switch (type) {
      case "email":
        return <Mail className="w-4 h-4 text-brand" />;
      case "phone":
        return <Phone className="w-4 h-4 text-brand" />;
      case "date":
        return <Calendar className="w-4 h-4 text-brand" />;
      default:
        return null;
    }
  };
  const icon = getIcon();
  // Handle array of specializations
  if (type === "specializations" && Array.isArray(value)) {
    return (
      <div className={className}>
        <p className="text-sm font-medium text-muted-foreground">{label}</p>
        <div className="flex flex-wrap gap-2 mt-1">
          {value.length > 0 ? (
            value.map((item, index) => (
              <span
                key={index}
                className="px-3 py-1 bg-gray-100 text-sm rounded-full"
              >
                {item}
              </span>
            ))
          ) : (
            <p className="mt-1 text-foreground leading-relaxed text-pretty text-sm">
              -
            </p>
          )}
        </div>
      </div>
    );
  }

  // Default field rendering
  return (
    <div className={className}>
      <p className="text-sm font-medium text-muted-foreground">{label}</p>
      <div className="mt-1 flex items-center gap-2">
        {icon}
        <p className="text-foreground leading-relaxed text-pretty text-sm break-words">
          {value || "-"}
        </p>
      </div>
    </div>
  );
};

// Main reusable component
const DisplayMode = ({ fields, layout = "grid", className = "" }) => {
  const formatValue = (value, type) => {
    switch (type) {
      case "date":
        return value ? formatDateToBangla(new Date(value), "PPP") : null;
      case "gender":
        return value === "MALE" ? "পুরুষ" : value === "FEMALE" ? "মহিলা" : null;
      case "specializations":
        return value;
      case "bio":
        // Truncate bio to 50 words
        if (!value) return null;
        const words = value.split(" ");
        if (words.length <= 50) return value;
        return words.slice(0, 50).join(" ") + "...";
      default:
        return value;
    }
  };

  const getLayoutClass = () => {
    switch (layout) {
      case "grid":
        return "grid grid-cols-1 md:grid-cols-2 gap-2 lg:gap-4";
      case "single":
        return "space-y-4";
      default:
        return "space-y-4";
    }
  };

  return (
    <div className={`space-y-4 ${className}`}>
      <div className={getLayoutClass()}>
        {fields.map((field, index) => (
          <DisplayField
            key={field.key || index}
            label={field.label}
            value={formatValue(field.value, field.type)}
            type={field.type}
            className={field.className}
          />
        ))}
      </div>
    </div>
  );
};

export default DisplayMode;
