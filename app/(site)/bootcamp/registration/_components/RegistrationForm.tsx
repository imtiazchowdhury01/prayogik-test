"use client";

import React, { useState } from "react";
import { FormInput } from "./FormInput";

export const RegistrationForm = () => {
  const [formData, setFormData] = useState({
    fullName: "আমজাদ হোসেন",
    phoneOrEmail: "",
    email: "",
    phone: "",
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // Handle form submission
  };

  const handleChange = (name: string, value: string) => {
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  return (
    <section className="flex flex-col flex-1 p-8 bg-white rounded-lg basis-0 min-w-60 max-md:p-6 max-sm:p-4">
      <h2 className="text-3xl font-bold leading-none text-gray-800 max-sm:text-2xl">
        আপনার তথ্য গুলো দিন
      </h2>

      <form
        onSubmit={handleSubmit}
        className="flex flex-col w-full gap-4 mt-4 text-sm"
      >
        <FormInput
          label="আপনার পূর্ণ নাম"
          value={formData.fullName}
          onChange={(value) => handleChange("fullName", value)}
        />

        <FormInput
          label="ইমেইল দিন"
          value={formData.phoneOrEmail}
          onChange={(value) => handleChange("phoneOrEmail", value)}
          placeholder="এখানে লিখুন..."
        />

        <FormInput
          label="ইমেইল দিন"
          value={formData.email}
          onChange={(value) => handleChange("email", value)}
          placeholder="এখানে লিখুন..."
        />

        <FormInput
          label="ফোন নম্বর"
          value={formData.phone}
          onChange={(value) => handleChange("phone", value)}
          placeholder="+৮৮০..."
        />

        <button
          type="submit"
          className="w-full p-3 text-base font-semibold text-white rounded-md cursor-pointer mt-7 bg-primary-brand hover:bg-primary-700 min-h-12"
        >
          এগিয়ে যান
        </button>
      </form>
    </section>
  );
};
