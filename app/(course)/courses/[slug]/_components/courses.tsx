//@ts-nocheck
import Hero from "./hero";
import WhatYouLearn from "./what-you-learn";
import CourseLesson from "./course-lesson";
import CourseDetails from "./course-details";
import Requirements from "./requirements";
import Review from "./review";
import RelatedCourse from "./related-course";
import MoreCourses from "./more-course";
import AuthorBio from "./author-bio";

export default function Courses() {
  return (
    <div className="">
      {/* <Hero /> */}
      <WhatYouLearn />
      <CourseDetails />
      <CourseLesson />
      <Requirements />
      <RelatedCourse />
      <div className="">
        <AuthorBio />
      </div>
      <Review />
      <MoreCourses />
    </div>
  );
}
