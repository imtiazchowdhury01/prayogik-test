//@ts-nocheck
import React from "react";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
} from "@/components/ui/command";
import { Button } from "@/components/ui/button";
import { Check, ChevronsUpDown } from "lucide-react";
import { cn } from "@/lib/utils";
import { RequiredLabelText } from "./requiredLabelText";

export const BankSelector = ({
  districts = [],
  banks = [],
  branches = [],
  selectedDistrict,
  selectedBank,
  selectedBranch,
  onDistrictSelect,
  onBankSelect,
  onBranchSelect,
  districtOpen,
  bankOpen,
  branchOpen,
  setDistrictOpen,
  setBankOpen,
  setBranchOpen,
}) => {
  return (
    <>
      {/* District Selection */}
      <div className="mb-4">
        <label className="block text-sm font-medium text-gray-700">
          <RequiredLabelText text="Select District" className="m-0" />
        </label>
        <Popover open={districtOpen} onOpenChange={setDistrictOpen}>
          <PopoverTrigger asChild>
            <Button
              variant="outline"
              role="combobox"
              aria-expanded={districtOpen}
              className="mt-1 w-full justify-between"
            >
              {selectedDistrict || "Choose a district..."}
              <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
            </Button>
          </PopoverTrigger>
          <PopoverContent className="w-full p-0">
            <Command>
              <CommandInput placeholder="Search districts..." />
              <CommandEmpty>No district found.</CommandEmpty>
              <CommandGroup
                onWheel={(e) => e.stopPropagation()}
                className="max-h-60 overflow-y-auto"
              >
                {districts.map((district) => (
                  <CommandItem
                    key={district}
                    onSelect={() => onDistrictSelect(district)}
                  >
                    <Check
                      className={cn(
                        "mr-2 h-4 w-4",
                        selectedDistrict === district
                          ? "opacity-100"
                          : "opacity-0"
                      )}
                    />
                    {district}
                  </CommandItem>
                ))}
              </CommandGroup>
            </Command>
          </PopoverContent>
        </Popover>
      </div>

      {/* Bank Selection */}
      {banks.length > 0 && (
        <div className="mb-4">
          <label className="block text-sm font-medium text-gray-700">
            <RequiredLabelText text="Select Bank" className="m-0" />
          </label>
          <Popover open={bankOpen} onOpenChange={setBankOpen}>
            <PopoverTrigger asChild>
              <Button
                variant="outline"
                role="combobox"
                aria-expanded={bankOpen}
                className="mt-1 w-full justify-between"
              >
                {selectedBank
                  ? banks.find((bank) => bank.slug === selectedBank)?.name
                  : "Choose a bank..."}
                <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
              </Button>
            </PopoverTrigger>
            <PopoverContent className="w-full p-0">
              <Command>
                <CommandInput placeholder="Search banks..." />
                <CommandEmpty>No bank found.</CommandEmpty>
                <CommandGroup
                  onWheel={(e) => e.stopPropagation()}
                  className="max-h-60 overflow-y-auto"
                >
                  {banks.map((bank) => (
                    <CommandItem
                      key={bank.slug}
                      onSelect={() => onBankSelect(bank.slug)}
                    >
                      <Check
                        className={cn(
                          "mr-2 h-4 w-4",
                          selectedBank === bank.slug
                            ? "opacity-100"
                            : "opacity-0"
                        )}
                      />
                      {bank.name}
                    </CommandItem>
                  ))}
                </CommandGroup>
              </Command>
            </PopoverContent>
          </Popover>
        </div>
      )}

      {/* Branch Selection */}
      {branches.length > 0 && (
        <div className="mb-4">
          <label className="block text-sm font-medium text-gray-700">
            <RequiredLabelText text="Select Branch" className="m-0" />
          </label>
          <Popover open={branchOpen} onOpenChange={setBranchOpen}>
            <PopoverTrigger asChild>
              <Button
                variant="outline"
                role="combobox"
                aria-expanded={branchOpen}
                className="mt-1 w-full justify-between"
              >
                {selectedBranch
                  ? branches.find(
                      (branch) => branch.branch_slug === selectedBranch
                    )?.branch_name
                  : "Choose a branch..."}
                <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
              </Button>
            </PopoverTrigger>
            <PopoverContent className="w-full p-0">
              <Command>
                <CommandInput placeholder="Search branches..." />
                <CommandEmpty>No branch found.</CommandEmpty>
                <CommandGroup
                  onWheel={(e) => e.stopPropagation()}
                  className="max-h-60 overflow-y-auto"
                >
                  {branches.map((branch) => (
                    <CommandItem
                      key={branch.branch_slug}
                      onSelect={() => onBranchSelect(branch.branch_slug)}
                    >
                      <Check
                        className={cn(
                          "mr-2 h-4 w-4",
                          selectedBranch === branch.branch_slug
                            ? "opacity-100"
                            : "opacity-0"
                        )}
                      />
                      <div className="flex justify-between w-full">
                        <span>{branch.branch_name}</span>
                        <span className="text-gray-500 text-sm ml-2">
                          {branch.branch_code}
                        </span>
                      </div>
                    </CommandItem>
                  ))}
                </CommandGroup>
              </Command>
            </PopoverContent>
          </Popover>
        </div>
      )}
    </>
  );
};
