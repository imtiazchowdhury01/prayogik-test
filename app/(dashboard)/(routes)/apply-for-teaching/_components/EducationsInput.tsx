import React from "react";
import { useFieldArray, Control } from "react-hook-form";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Plus, X, BookOpen } from "lucide-react";
import RequiredFieldStar from "@/components/common/requiredFieldStar";

interface EducationFormData {
  education: {
    degree: string;
    major: string;
    passingYear: string;
  }[];
}

interface EducationFormProps {
  control: Control<EducationFormData>;
}

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

const EducationForm: React.FC<EducationFormProps> = ({ control }) => {
  const { fields, append, remove } = useFieldArray({
    control,
    name: "education",
  });

  // Add initial education row if none exists
  React.useEffect(() => {
    if (fields.length === 0) {
      append({
        degree: "",
        major: "",
        passingYear: "",
      });
    }
  }, []);

  const addEducation = () => {
    append({
      degree: "",
      major: "",
      passingYear: "",
    });
  };

  const currentYear = new Date().getFullYear();
  const years = Array.from({ length: 50 }, (_, i) => currentYear - i);

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <RequiredFieldStar
          labelText={"শিক্ষাগত যোগ্যতা"}
          className={"text-base font-medium"}
        />
        <Button
          type="button"
          variant="outline"
          size="sm"
          onClick={addEducation}
          className="flex items-center gap-2"
        >
          <Plus className="w-4 h-4" />
          ডিগ্রি যোগ করুন
        </Button>
      </div>

      <div className="space-y-4">
        {fields.map((field, index) => (
          <div
            key={field.id}
            className="p-4 border rounded-lg bg-gray-50/50 space-y-4"
          >
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <BookOpen className="w-4 h-4 text-blue-600" />
                <span className="font-medium text-sm">ডিগ্রি {index + 1}</span>
              </div>
              {fields.length > 1 && (
                <Button
                  type="button"
                  variant="ghost"
                  size="sm"
                  onClick={() => remove(index)}
                  className="text-red-500 hover:text-red-700 h-8 w-8 p-0"
                >
                  <X className="w-4 h-4" />
                </Button>
              )}
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {/* Degree Field */}
              <FormField
                control={control}
                name={`education.${index}.degree`}
                render={({ field }) => (
                  <FormItem>
                    <RequiredFieldStar
                      labelText={"ডিগ্রির ধরন"}
                      className={"text-base font-medium"}
                    />
                    <Select
                      onValueChange={field.onChange}
                      defaultValue={field.value}
                    >
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="ডিগ্রি নির্বাচন করুন" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        {degrees.map((degree) => (
                          <SelectItem key={degree.value} value={degree.value}>
                            {degree.label}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />

              {/* Major Field */}
              <FormField
                control={control}
                name={`education.${index}.major`}
                render={({ field }) => (
                  <FormItem>
                    <RequiredFieldStar
                      labelText={"বিষয়"}
                      className={"text-base font-medium"}
                    />
                    <Select
                      onValueChange={field.onChange}
                      defaultValue={field.value}
                    >
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="বিষয় নির্বাচন করুন" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent className="max-h-[300px]">
                        {majors.map((group) => (
                          <div key={group.label}>
                            <div className="px-2 py-1.5 text-sm font-semibold text-gray-600">
                              {group.label}
                            </div>
                            {group.options.map((major) => (
                              <SelectItem key={major.value} value={major.value}>
                                {major.label}
                              </SelectItem>
                            ))}
                          </div>
                        ))}
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />

              {/* Passing Year Field */}
              <FormField
                control={control}
                name={`education.${index}.passingYear`}
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>পাশের সাল</FormLabel>
                    <Select
                      onValueChange={field.onChange}
                      defaultValue={field.value}
                    >
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="সাল নির্বাচন করুন" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent className="max-h-[200px]">
                        {years.map((year) => (
                          <SelectItem key={year} value={year.toString()}>
                            {year}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default EducationForm;
