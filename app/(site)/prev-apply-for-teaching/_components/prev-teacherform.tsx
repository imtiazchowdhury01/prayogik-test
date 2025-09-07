// @ts-nocheck
"use client";

import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Loader } from "lucide-react";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";

const TeacherForm = ({ fetchUserState }) => {
  const { data: session } = useSession();
  const userId = session?.user.id;
  const router = useRouter();

  const [dialogVisible, setDialogVisible] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [teacher, setTeacher] = useState(null); // Initialize as null instead of an empty array

  const [teacherDetails, setTeacherDetails] = useState({
    teacherId: userId || "",
    bio: "",
    subjectSpecializations: "",
    certifications: "",
    yearsOfExperience: "",
    education: "",
    dateOfBirth: "",
    gender: "",
    nationality: "",
    phoneNumber: "",
    city: "",
    state: "",
    country: "",
    zipCode: "",
  });

  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState({});

  useEffect(() => {
    if (teacher) {
      setTeacherDetails({
        teacherId: userId || "",
        bio: teacher.bio || "",
        subjectSpecializations:
          teacher.teacherProfile?.subjectSpecializations || "",
        certifications:
          teacher.teacherProfile?.certifications?.join(", ") || "",
        yearsOfExperience: teacher.teacherProfile?.yearsOfExperience || "",
        education: teacher.education || "",
        dateOfBirth: teacher.dateOfBirth || "",
        gender: teacher.gender || "",
        nationality: teacher.nationality || "",
        phoneNumber: teacher.phoneNumber || "",
        city: teacher.city || "",
        state: teacher.state || "",
        country: teacher.country || "",
        zipCode: teacher.zipCode || "",
      });
    }
  }, [teacher]);

  const fetchTeacherDetails = async () => {
    setIsLoading(true);
    try {
      const response = await fetch(`/api/teacher/${userId}`);
      if (!response.ok) throw new Error("Failed to fetch teacher details");
      const data = await response.json();

      setTeacher(data);
    } catch (err) {
      console.error("Error fetching teacher details:", err);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    if (userId) {
      fetchTeacherDetails();
    }
  }, [userId]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setTeacherDetails((prev) => ({ ...prev, [name]: value }));
    setErrors((prev) => ({ ...prev, [name]: "" })); // Clear error on change
  };

  const validate = () => {
    const newErrors = {};
    for (const key in teacherDetails) {
      if (!teacherDetails[key]) {
        newErrors[key] = `${key
          .replace(/([A-Z])/g, " $1")
          .trim()} is required.`;
      }
    }
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0; // Return true if no errors
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    const isValid = validate();
    if (!isValid) {
      setLoading(false);
      return; // Stop submission if validation fails
    }

    try {
      const response = await fetch("/api/teacher/apply", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(teacherDetails),
      });

      if (!response.ok) {
        throw new Error("Failed to submit");
      }

      await response.json();

      // Reset form after successful submission
      setTeacherDetails({
        teacherId: userId,
        bio: "",
        subjectSpecializations: "",
        certifications: "",
        yearsOfExperience: "",
        education: "",
        dateOfBirth: "",
        gender: "",
        nationality: "",
        phoneNumber: "",
        city: "",
        state: "",
        country: "",
        zipCode: "",
      });

      setDialogVisible(true);
    } catch (err) {
      console.error(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div>
        <Input
          name="name"
          placeholder="Name"
          disabled
          value={teacher?.name || ""}
        />
        {errors.name && <div className="text-red-500">{errors.name}</div>}
      </div>
      <div>
        <Input
          name="email"
          type="email"
          placeholder="Email"
          disabled
          value={teacher?.email || ""}
        />
        {errors.email && <div className="text-red-500">{errors.email}</div>}
      </div>
      <div>
        <Input
          name="bio"
          placeholder="Bio"
          onChange={handleChange}
          value={teacherDetails.bio}
        />
        {errors.bio && <div className="text-red-500">{errors.bio}</div>}
      </div>
      <div>
        <Input
          name="subjectSpecializations"
          placeholder="Subject Specializations (comma-separated)"
          onChange={handleChange}
          value={teacherDetails.subjectSpecializations}
        />
        {errors.subjectSpecializations && (
          <div className="text-red-500">{errors.subjectSpecializations}</div>
        )}
      </div>
      <div>
        <Input
          name="certifications"
          placeholder="Certifications (comma-separated)"
          onChange={handleChange}
          value={teacherDetails.certifications}
        />
        {errors.certifications && (
          <div className="text-red-500">{errors.certifications}</div>
        )}
      </div>
      <div>
        <Input
          name="yearsOfExperience"
          type="number"
          placeholder="Years of Experience"
          onChange={handleChange}
          value={teacherDetails.yearsOfExperience}
        />
        {errors.yearsOfExperience && (
          <div className="text-red-500">{errors.yearsOfExperience}</div>
        )}
      </div>
      <div>
        <Input
          name="education"
          placeholder="Education"
          onChange={handleChange}
          value={teacherDetails.education}
        />
        {errors.education && (
          <div className="text-red-500">{errors.education}</div>
        )}
      </div>
      <div>
        <Input
          name="dateOfBirth"
          type="date"
          onChange={handleChange}
          value={teacherDetails.dateOfBirth}
        />
        {errors.dateOfBirth && (
          <div className="text-red-500">{errors.dateOfBirth}</div>
        )}
      </div>
      <div>
        <select
          name="gender"
          className="w-full border border-gray-200 rounded-md p-2"
          onChange={handleChange}
          value={teacherDetails.gender}
        >
          <option value="">Select Gender</option>
          <option value="male">Male</option>
          <option value="female">Female</option>
          <option value="other">Other</option>
        </select>

        {errors.gender && <div className="text-red-500">{errors.gender}</div>}
      </div>
      <div>
        <Input
          name="nationality"
          placeholder="Nationality"
          onChange={handleChange}
          value={teacherDetails.nationality}
        />
        {errors.nationality && (
          <div className="text-red-500">{errors.nationality}</div>
        )}
      </div>
      <div>
        <Input
          name="phoneNumber"
          placeholder="Phone Number"
          onChange={handleChange}
          value={teacherDetails.phoneNumber}
        />
        {errors.phoneNumber && (
          <div className="text-red-500">{errors.phoneNumber}</div>
        )}
      </div>
      <div>
        <Input
          name="city"
          placeholder="City"
          onChange={handleChange}
          value={teacherDetails.city}
        />
        {errors.city && <div className="text-red-500">{errors.city}</div>}
      </div>
      <div>
        <Input
          name="state"
          placeholder="State"
          onChange={handleChange}
          value={teacherDetails.state}
        />
        {errors.state && <div className="text-red-500">{errors.state}</div>}
      </div>
      <div>
        <Input
          name="country"
          placeholder="Country"
          onChange={handleChange}
          value={teacherDetails.country}
        />
        {errors.country && <div className="text-red-500">{errors.country}</div>}
      </div>
      <div>
        <Input
          name="zipCode"
          placeholder="Zip Code"
          onChange={handleChange}
          value={teacherDetails.zipCode}
        />
        {errors.zipCode && <div className="text-red-500">{errors.zipCode}</div>}
      </div>
      <div className="flex justify-center items-center">
        <Button type="submit" disabled={loading} className="flex items-center ">
          {loading ? <Loader className="w-4 h-4 mr-2 animate-spin" /> : null}
          Submit
        </Button>
      </div>

      <Dialog
        open={dialogVisible}
        onOpenChange={(open) => {
          setDialogVisible(open);
        }}
      >
        <DialogContent>
          <DialogHeader></DialogHeader>
          <DialogDescription className="text-center my-4">
            <DialogTitle> Teacher details submitted successfully</DialogTitle>
          </DialogDescription>
          <Button
            onClick={() => {
              fetchUserState();
              setDialogVisible(false);
            }}
            className="mx-auto block"
          >
            Close
          </Button>
        </DialogContent>
      </Dialog>
    </form>
  );
};

export default TeacherForm;
