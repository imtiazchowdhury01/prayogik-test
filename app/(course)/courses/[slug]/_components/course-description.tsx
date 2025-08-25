//@ts-nocheck

import DescriptionToggle from "./description-toggole";

export default function CourseDescription({ course }) {
  const description = course?.description || "";

  return (
    <div className="pt-6">
      <h1 className="text-2xl font-bold mb-4">Description</h1>
      <DescriptionToggle description={description} limit={800} />
    </div>
  );
}
