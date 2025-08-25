import React from "react";

const RelatedSkills = () => {
  const relatedSkills = [
    "কনটেন্ট মার্কেটিং",
    "ক্রিয়েটিভ ক্যারিয়ার",
    "কনটেন্ট মার্কেটিং",
  ];
  return (
    <section className="my-16" id="related-skills">
      <h4 className="mb-4 text-2xl font-bold text-fontcolor-title">
        রিলেটেড স্কিল
      </h4>
      <div className="flex items-center space-x-3">
        {relatedSkills.map((item) => {
          return (
            <div className="border-[1px] px-3 py-2 border-[#E2E8F0] rounded-md text-fontcolor-title font-medium text-sm">
              {item}
            </div>
          );
        })}
      </div>
    </section>
  );
};

export default RelatedSkills;
