import React from "react";

interface InfoRowProps {
  icon: string;
  text: string;
}

export const InfoRow: React.FC<InfoRowProps> = ({ icon, text }) => {
  return (
    <div className="flex gap-2 items-center mb-2 text-slate-600">
      <img src={icon} alt="icon" className={` w-5 h-5`} />
      <p className="text-base">{text}</p>
    </div>
  );
};
