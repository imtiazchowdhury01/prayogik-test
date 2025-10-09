// _components/common/section-title.tsx
import React from "react";

interface SectionTitleProps {
  title: string;
  className?: string;
  size?: string;
}

const CertificationSectionTitle: React.FC<SectionTitleProps> = ({
  title,
  className = "",
  size = "text-xl",
}) => {
  return (
    <h2 className={`${size} font-bold text-fontcolor-title ${className}`}>
      {title}
    </h2>
  );
};

export default CertificationSectionTitle;
