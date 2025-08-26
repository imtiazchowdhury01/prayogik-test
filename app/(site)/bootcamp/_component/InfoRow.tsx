import React from "react";

interface InfoRowProps {
  icon: string;
  text: string;
}

export const InfoRow: React.FC<InfoRowProps> = ({ icon, text }) => {
  return (
    <div className="flex items-center gap-2 mb-2 text-fontcolor-description">
      <img src={icon} alt="icon" className={` w-5 h-5`} />
      <p className="text-base">{text}</p>
    </div>
  );
};
