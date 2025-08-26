import SectionTitle from "@/components/common/SectionTitle";
import React from "react";
import CourseRoadmap from "../../course-roadmap/_components/CourseRoadmap";

const CourseRoadmapOverView = () => {
  return (
    <div>
      {/* <SectionTitle
        title="কোর্স আপডেট"
        description="সম্পন্ন, চলমান ও পরিকল্পনায় থাকা কোর্সসমূহ একনজরে"
      /> */}
      {/* Course Roadmap Section */}
      <div className="container mx-auto px-6 sm:px-8 md:px-8 lg:px-8 xl:px-8 2xl:px-1 max-w-7xl">
        <CourseRoadmap showSectionHeader={true} />
      </div>
    </div>
  );
};

export default CourseRoadmapOverView;
