import React from "react";

import CourseRoadmap from "./CourseRoadmap";

const CourseRoadmapOverView = () => {
  return (
    <div className="container mx-auto px-6 sm:px-8 md:px-8 lg:px-8 xl:px-8 2xl:px-1 max-w-7xl">
      <CourseRoadmap showSectionHeader={true} />
    </div>
  );
};

export default CourseRoadmapOverView;
