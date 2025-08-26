import { useState } from "react";
import { Button } from "@/components/ui/button";
import toast from "react-hot-toast";
import * as React from "react";
import { Check, ChevronsUpDown } from "lucide-react";
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from "@/components/ui/command";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";

interface EducationsInputProps {
  initialEducations: string[]; // Array of education strings (degree - major)
  onUpdateEducations: (updatedEducations: string[]) => void; // Callback to update educations array
}

// Enhanced Degrees (including Bangladesh-specific degrees)
const degrees = [
  { value: "PSC", label: "PSC - Primary School Certificate" },
  {
    value: "JSC/JDC",
    label: "JSC/JDC - Junior School Certificate / Junior Dakhil Certificate",
  },
  { value: "SSC", label: "SSC - Secondary School Certificate" },
  { value: "HSC", label: "HSC - Higher Secondary Certificate" },
  {
    value: "BA/BSc/BCom (Pass)",
    label:
      "BA/BSc/BCom (Pass) - Bachelor of Science / Commerce / Arts (Pass Course)",
  },
  {
    value: "BA/BSc/BCom (Honours)",
    label:
      "BA/BSc/BCom (Honours) - Bachelor of Science / Commerce / Arts (Honours)",
  },
  { value: "BBA", label: "BBA - Bachelor of Business Administration" },
  { value: "BEd", label: "BEd - Bachelor of Education" },
  { value: "LLB", label: "LLB - Bachelor of Laws" },
  {
    value: "MBBS",
    label: "MBBS - Bachelor of Medicine and Bachelor of Surgery",
  },
  { value: "BDS", label: "BDS - Bachelor of Dental Surgery" },
  {
    value: "Diploma in Engineering",
    label: "Diploma in Engineering - Diploma in Engineering",
  },
  {
    value: "MA/MSc/MCom",
    label: "MA/MSc/MCom - Master of Science / Commerce / Arts",
  },
  { value: "MBA", label: "MBA - Master of Business Administration" },
  { value: "MEd", label: "MEd - Master of Education" },
  { value: "LLM", label: "LLM - Master of Laws" },
  { value: "MPhil", label: "MPhil - Master of Philosophy" },
  { value: "PhD", label: "PhD - Doctor of Philosophy" },
];

// Enhanced Majors (grouped by fields of study)
const majors = [
  {
    label: "Science",
    options: [
      { value: "Physics", label: "Physics" },
      { value: "Chemistry", label: "Chemistry" },
      { value: "Biology", label: "Biology" },
      { value: "Mathematics", label: "Mathematics" },
      { value: "Computer Science", label: "Computer Science" },
      { value: "Environmental Science", label: "Environmental Science" },
      { value: "Medical Science", label: "Medical Science (MBBS, BDS)" },
      {
        value: "Engineering",
        label: "Engineering (Civil, Electrical, Mechanical, Computer, etc.)",
      },
    ],
  },
  {
    label: "Commerce/Business Studies",
    options: [
      { value: "Accounting", label: "Accounting" },
      { value: "Finance", label: "Finance" },
      { value: "Marketing", label: "Marketing" },
      { value: "Management", label: "Management" },
      { value: "Economics", label: "Economics" },
      {
        value: "Business Administration",
        label: "Business Administration (BBA, MBA)",
      },
    ],
  },
  {
    label: "Arts/Humanities",
    options: [
      { value: "Bangla", label: "Bangla" },
      { value: "English", label: "English" },
      { value: "History", label: "History" },
      { value: "Geography", label: "Geography" },
      { value: "Sociology", label: "Sociology" },
      { value: "Political Science", label: "Political Science" },
      { value: "Philosophy", label: "Philosophy" },
      { value: "Islamic Studies", label: "Islamic Studies" },
      { value: "Fine Arts", label: "Fine Arts" },
    ],
  },
  {
    label: "Law",
    options: [
      { value: "General Law", label: "General Law (LLB, LLM)" },
      { value: "Corporate Law", label: "Corporate Law" },
      { value: "Criminal Law", label: "Criminal Law" },
      { value: "International Law", label: "International Law" },
    ],
  },
  {
    label: "Education",
    options: [
      { value: "BEd", label: "Bachelor of Education" },
      { value: "MEd", label: "Master of Education" },
    ],
  },
  {
    label: "Engineering and Technology",
    options: [
      { value: "Civil Engineering", label: "Civil Engineering" },
      { value: "Mechanical Engineering", label: "Mechanical Engineering" },
      {
        value: "Electrical and Electronic Engineering",
        label: "Electrical and Electronic Engineering (EEE)",
      },
      {
        value: "Computer Science and Engineering",
        label: "Computer Science and Engineering (CSE)",
      },
      { value: "ICT", label: "Information and Communication Technology (ICT)" },
    ],
  },
  {
    label: "Medical and Health Sciences",
    options: [
      { value: "Medicine", label: "Medicine (MBBS)" },
      { value: "Dental Surgery", label: "Dental Surgery (BDS)" },
      { value: "Pharmacy", label: "Pharmacy" },
      { value: "Public Health", label: "Public Health" },
      { value: "Nursing", label: "Nursing" },
    ],
  },
  {
    label: "Agriculture",
    options: [
      { value: "Agricultural Science", label: "Agricultural Science" },
      { value: "Fisheries", label: "Fisheries" },
      { value: "Veterinary Science", label: "Veterinary Science" },
    ],
  },
  {
    label: "Social Sciences",
    options: [
      { value: "Economics", label: "Economics" },
      { value: "Psychology", label: "Psychology" },
      { value: "Anthropology", label: "Anthropology" },
      { value: "Public Administration", label: "Public Administration" },
    ],
  },
  {
    label: "Fine Arts and Design",
    options: [
      { value: "Painting", label: "Painting" },
      { value: "Sculpture", label: "Sculpture" },
      { value: "Graphic Design", label: "Graphic Design" },
      { value: "Architecture", label: "Architecture" },
    ],
  },
  {
    label: "Religious Studies",
    options: [
      { value: "Islamic Studies", label: "Islamic Studies" },
      { value: "Comparative Religion", label: "Comparative Religion" },
    ],
  },
  {
    label: "Vocational and Technical Education",
    options: [
      { value: "Diploma in Engineering", label: "Diploma in Engineering" },
      { value: "Textile Technology", label: "Textile Technology" },
      { value: "Marine Engineering", label: "Marine Engineering" },
    ],
  },
];

const EducationsInput = ({
  initialEducations,
  onUpdateEducations,
}: EducationsInputProps) => {
  const [degree, setDegree] = useState<string>("");
  const [major, setMajor] = useState<string>("");
  const [educations, setEducations] = useState<string[]>(initialEducations);

  React.useEffect(() => {
    if (initialEducations.length > 0) {
      setEducations(initialEducations);
    }
  }, [initialEducations]);

  // Handle Add button
  const handleAddEducation = () => {
    if (degree) {
      // If no major is selected, use an empty string for major
      const newEducation = major ? `${degree} - ${major}` : `${degree}`; // Use "N/A" if no major is selected
      const updatedEducations = [...educations, newEducation];
      setEducations(updatedEducations);
      onUpdateEducations(updatedEducations); // Return updated list to the parent
      setDegree(""); // Reset degree input
      setMajor(""); // Reset major input
    } else {
      toast.error("Please select a degree");
    }
  };

  // Remove education by index
  const removeEducation = (index: number) => {
    const updatedEducations = educations.filter((_, i) => i !== index);
    setEducations(updatedEducations);
    onUpdateEducations(updatedEducations); // Return updated list to the parent
  };

  return (
    <div className="space-y-4">
      <div className="flex gap-4 flex-wrap">
        {/* Degree Combobox */}
        <div className="flex-grow">
          <Popover>
            <PopoverTrigger asChild>
              <Button variant="outline" className="w-full justify-between">
                {degree
                  ? degrees.find((d) => d.value === degree)?.label
                  : "Select Degree"}
                <ChevronsUpDown className="opacity-50" />
              </Button>
            </PopoverTrigger>
            <PopoverContent className="w-full">
              <Command>
                <CommandInput placeholder="Search degree..." className="h-9" />
                <CommandList>
                  <CommandEmpty>No degree found.</CommandEmpty>
                  <CommandGroup>
                    {degrees
                      .filter(
                        (d) => !educations.some((e) => e.startsWith(d.value))
                      )
                      .map((degreeOption) => (
                        <CommandItem
                          key={degreeOption.value}
                          value={degreeOption.value}
                          onSelect={(currentValue) => {
                            setDegree(
                              currentValue === degree ? "" : currentValue
                            );
                          }}
                        >
                          {degreeOption.label}
                          <Check
                            className={`ml-auto ${
                              degree === degreeOption.value
                                ? "opacity-100"
                                : "opacity-0"
                            }`}
                          />
                        </CommandItem>
                      ))}
                  </CommandGroup>
                </CommandList>
              </Command>
            </PopoverContent>
          </Popover>
        </div>

        {/* Major Combobox */}
        <div className="flex-grow">
          <Popover>
            <PopoverTrigger asChild>
              <Button variant="outline" className="w-full justify-between">
                {major
                  ? majors
                      .flatMap((group) => group.options)
                      .find((m) => m.value === major)?.label
                  : "Select Major"}
                <ChevronsUpDown className="opacity-50" />
              </Button>
            </PopoverTrigger>
            <PopoverContent className="w-full">
              <Command>
                <CommandInput placeholder="Search major..." className="h-9" />
                <CommandList>
                  <CommandEmpty>No major found.</CommandEmpty>
                  {majors.map((majorGroup) => (
                    <CommandGroup key={majorGroup.label}>
                      <div className="font-semibold">{majorGroup.label}</div>
                      {majorGroup.options.map((majorOption) => (
                        <CommandItem
                          key={majorOption.value}
                          value={majorOption.value}
                          onSelect={(currentValue) => {
                            setMajor(
                              currentValue === major ? "" : currentValue
                            );
                          }}
                        >
                          {majorOption.label}
                          <Check
                            className={`ml-auto ${
                              major === majorOption.value
                                ? "opacity-100"
                                : "opacity-0"
                            }`}
                          />
                        </CommandItem>
                      ))}
                    </CommandGroup>
                  ))}
                </CommandList>
              </Command>
            </PopoverContent>
          </Popover>
        </div>

        {/* Add Button */}
        <div className="flex items-center justify-center">
          <Button
            variant={!degree ? "outline" : "default"}
            disabled={!degree}
            type="button"
            onClick={handleAddEducation}
          >
            Add
          </Button>
        </div>
      </div>

      {/* Display added educations */}
      <div className="flex gap-2 flex-wrap items-start">
        {educations.map((education, index) => (
          <div
            key={index}
            className="flex items-center gap-2 bg-gray-200 px-2 py-1 rounded text-sm"
          >
            <span>{education}</span>
            <button
              type="button"
              onClick={() => removeEducation(index)}
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

export default EducationsInput;
