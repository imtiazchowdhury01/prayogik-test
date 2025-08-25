"use client";

import React from "react";
import {
  FormField,
  FormItem,
  FormControl,
  FormMessage,
} from "@/components/ui/form";
import { Button } from "@/components/ui/button";

interface RequirementsProps {
  requirements: string[];
  onRequirementChange: {
    control: any; // Replace with appropriate type based on your ui/form library's control
  };
  addRequirement: () => void;
}

const Requirements: React.FC<RequirementsProps> = ({
  requirements,
  onRequirementChange,
  addRequirement,
}) => {
  return (
    <div>
      <h3 className="font-medium mt-4">Requirements</h3>
      {requirements.map((req, index) => (
        <FormField
          key={index}
          control={onRequirementChange.control}
          name={`requirements.${index}`}
          render={({ field }) => (
            <FormItem>
              <FormControl>
                <input
                  type="text"
                  {...field}
                  placeholder="Enter Requirement"
                  className="rounded-md border p-2 w-full"
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
      ))}
      <Button type="button" onClick={addRequirement}>
        Add Requirement
      </Button>
    </div>
  );
};

export default Requirements;
