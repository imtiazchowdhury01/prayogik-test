//@ts-nocheck
import { FileText } from "lucide-react";
import TeacherApplicationStatusCard from "./TeacherApplicationStatusCard";

const TeacherApplicationStatus = ({ status, applicationDetails }) => {
  return (
    <div className="max-w-4xl mx-auto">
      {/* render status */}
      <TeacherApplicationStatusCard
        status={status}
        applicationDetails={applicationDetails}
      />
    </div>
  );
};

export default TeacherApplicationStatus;
