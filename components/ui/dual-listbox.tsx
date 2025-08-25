// @ts-nocheck
import React, { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  ChevronRight,
  ChevronLeft,
  Plus,
  Minus,
  SearchIcon,
} from "lucide-react";
import {
  FormField,
  FormItem,
  FormControl,
  FormMessage,
} from "@/components/ui/form";

const DualListBox = ({ options, field, mode = "multiple" }) => {
  // Initialize the state with the available and selected options based on field.value
  const [availableOptions, setAvailableOptions] = useState([]);
  const [selectedOptions, setSelectedOptions] = useState([]);
  const [searchAvailable, setSearchAvailable] = useState("");
  const [searchSelected, setSearchSelected] = useState("");

  // Synchronize the local state with field.value when it changes
  useEffect(() => {
    if (mode === "single") {
      // For single mode, only allow one selected item
      const selectedValue = field.value.length > 0 ? field.value[0] : null;
      const selectedOption = selectedValue
        ? options.find((opt) => opt.value === selectedValue)
        : null;

      setAvailableOptions(
        options.filter((opt) => !selectedOption || opt.value !== selectedValue)
      );
      setSelectedOptions(selectedOption ? [selectedOption] : []);
    } else {
      // Multiple selection mode
      setAvailableOptions(
        options.filter((opt) => !field.value.includes(opt.value))
      );
      setSelectedOptions(
        options.filter((opt) => field.value.includes(opt.value))
      );
    }
  }, [field.value, options, mode]);

  const moveToSelected = (option) => {
    if (mode === "single") {
      // For single mode: replace any existing selection with the new one
      setAvailableOptions([
        ...availableOptions.filter((o) => o !== option),
        ...selectedOptions,
      ]);
      setSelectedOptions([option]);
      field.onChange([option.value]);
    } else {
      // Multiple selection mode: add to existing selections
      setAvailableOptions(availableOptions.filter((o) => o !== option));
      setSelectedOptions([...selectedOptions, option]);
      field.onChange([...field.value, option.value]);
    }
  };

  const moveToAvailable = (option) => {
    if (mode === "single") {
      // For single mode: clear the selection
      setAvailableOptions([...availableOptions, option]);
      setSelectedOptions([]);
      field.onChange([]);
    } else {
      // Multiple selection mode: remove specific item
      setSelectedOptions(selectedOptions.filter((o) => o !== option));
      setAvailableOptions([...availableOptions, option]);
      field.onChange(field.value.filter((v) => v !== option.value));
    }
  };

  return (
    <FormItem>
      <FormControl>
        <div className="flex gap-2 rounded-md bg-white">
          {/* Available Items */}
          <div className="w-1/2">
            <div className="flex items-center border rounded-md rounded-b-none p-[2px] bg-white">
              <span className="pl-2">
                <SearchIcon className="text-gray-500" size={16} />
              </span>
              <div className="w-full">
                <Input
                  placeholder={`Search ${
                    mode === "single" ? "Subscriptions" : "Available Courses"
                  }`}
                  value={searchAvailable}
                  onChange={(e) => setSearchAvailable(e.target.value)}
                  className="rounded-md border-none outline-none !ring-0 focus-visible:ring-transparent pl-2 w-full"
                />
              </div>
            </div>
            <div className="text-muted-foreground scrollbar-hidden border border-t-0 rounded-md rounded-t-none p-2 h-64 overflow-y-scroll">
              {availableOptions
                .filter((opt) =>
                  opt.label
                    .toLowerCase()
                    .includes(searchAvailable.toLowerCase())
                )
                .map((opt) => (
                  <div
                    key={opt.value}
                    className="flex items-center hover:bg-gray-50 pl-2 rounded-sm"
                  >
                    <span className="flex-1">{opt.label}</span>
                    <Button
                      variant={"transparent"}
                      onClick={() => moveToSelected(opt)}
                    >
                      <Plus className="text-foreground" size={14} />
                    </Button>
                  </div>
                ))}

              {availableOptions.length === 0 && (
                <div className="flex items-center justify-center h-full">
                  <p className="text-muted-foreground">Empty list</p>
                </div>
              )}
            </div>
          </div>

          {/* Selected Items */}
          <div className="w-1/2">
            <div className="flex items-center border rounded-md rounded-b-none p-[2px]">
              <span className="pl-2">
                <SearchIcon className="text-gray-500" size={16} />
              </span>
              <div className="w-full">
                <Input
                  placeholder={`Search ${
                    mode === "single" ? "Subscription" : "Enrolled Courses"
                  }`}
                  value={searchSelected}
                  onChange={(e) => setSearchSelected(e.target.value)}
                  className="rounded-md border-none outline-none !ring-0 focus-visible:ring-transparent pl-2 w-full"
                />
              </div>
            </div>
            <div className="text-muted-foreground scrollbar-hidden border border-t-0 rounded-md rounded-t-none p-2 h-64 overflow-y-scroll">
              {selectedOptions
                .filter((opt) =>
                  opt.label.toLowerCase().includes(searchSelected.toLowerCase())
                )
                .map((opt) => (
                  <div
                    key={opt.value}
                    className="flex items-center hover:bg-gray-50 pl-2 rounded-sm"
                  >
                    <span className="flex-1">{opt.label}</span>
                    <Button
                      variant={"transparent"}
                      onClick={() => moveToAvailable(opt)}
                    >
                      <Minus className="text-foreground" size={14} />
                    </Button>
                  </div>
                ))}

              {selectedOptions.length === 0 && (
                <div className="flex items-center justify-center h-full">
                  <p className="text-muted-foreground">Empty list</p>
                </div>
              )}
            </div>
          </div>
        </div>
      </FormControl>
      {mode === "single" && selectedOptions.length > 0 && (
        <p className="text-xs text-muted-foreground mt-1">
          Only one subscription allowed. Selecting a new one will replace the
          current selection.
        </p>
      )}
      {/* <FormMessage /> */}
    </FormItem>
  );
};

export default DualListBox;
