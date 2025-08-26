import React from "react";

interface FormInputProps {
  label: string;
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
}

export const FormInput: React.FC<FormInputProps> = ({
  label,
  value,
  onChange,
  placeholder,
}) => {
  return (
    <div>
      <label className="mb-1 font-medium text-slate-900">{label}</label>
      <input
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder}
        className="px-3 py-3 w-full bg-white rounded border border-solid shadow-sm border-[color:var(--Greyscale-300,#cbd5e1)] text-slate-500"
      />
    </div>
  );
};
