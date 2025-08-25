import React from "react";

export default function FilterCourse() {
  return (
    <div>
      <label className="mr-2">Sort by:</label>
      <select className="border border-gray-300 rounded px-2 py-1" id="sort">
        <option>Popular</option>
      </select>
    </div>
  );
}
