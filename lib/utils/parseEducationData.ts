// Helper function to parse education data

export const parseEducationData = (educationData: any) => {
  if (!educationData || educationData.length === 0) {
    return [
      {
        degree: "",
        major: "",
        passingYear: "",
      },
    ];
  }

  return educationData.map((edu: any) => {
    if (typeof edu === "string") {
      // Handle string format "Degree - Major - Year"
      const parts = edu.split(" - ");
      return {
        degree: parts[0] || "",
        major: parts[1] || "",
        passingYear: parts[2] || "",
      };
    }
    // If it's already an object, return it as is
    return {
      degree: edu.degree || "",
      major: edu.major || "",
      passingYear: edu.passingYear || "",
    };
  });
};