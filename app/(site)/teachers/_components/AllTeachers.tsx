// @ts-nocheck
"use client";

import ExpertCard from "@/components/ExpertCard";
import { Loader } from "lucide-react";
import React, { useState, useEffect, useCallback } from "react";
import debounce from "lodash/debounce";

const AllTeachers = ({ initialTeachers }) => {
  const [teachers, setTeachers] = useState(initialTeachers?.slice(0, 12) || []);
  const [isLoading, setIsLoading] = useState(false);
  const [hasMore, setHasMore] = useState(initialTeachers?.length > 12) || [];
  const [searchTerm, setSearchTerm] = useState("");

  // Modified search function to only find teachers with createdCourses
  const debouncedSearch = useCallback(
    debounce(async (term) => {
      if (!term.trim()) {
        setTeachers(initialTeachers.slice(0, 12));
        setHasMore(initialTeachers.length > 12);
        return;
      }

      setIsLoading(true);
      try {
        const response = await fetch(
          `/api/teacher/experts/search?search=${encodeURIComponent(
            term
          )}&hasCourses=true`
        );
        const searchResults = await response.json();
        setTeachers(searchResults);
        setHasMore(false);
      } catch (err) {
        console.error("Search failed:", err);
      } finally {
        setIsLoading(false);
      }
    }, 500),
    [initialTeachers]
  );

  useEffect(() => {
    debouncedSearch(searchTerm);
    return () => debouncedSearch.cancel();
  }, [searchTerm, debouncedSearch]);

  const fetchMoreTeachers = async () => {
    if (isLoading || searchTerm) return;

    setIsLoading(true);
    try {
      // Fetch next 12 teachers
      const response = await fetch(
        `/api/teacher/experts/all-experts?skip=${teachers.length}&limit=12&hasCourses=true`
      );
      const newTeachers = await response.json();
      setTeachers((prev) => [...prev, ...newTeachers]);
      setHasMore(newTeachers.length === 12); // Expecting 12 more if there are more
    } catch (err) {
      console.error("Failed to load more:", err);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <section className="w-full py-16 md:py-[100px]">
      <div className="app-container">
        <div className="flex flex-col items-center justify-between w-full mb-6 space-y-3 sm:space-y-0 sm:flex-row">
          <div>
            <h4 className="font-bold md:text-left text-center text-3xl sm:text-4xl md:text-[40px]">
              ফিল্ড এক্সপার্ট প্রশিক্ষক
            </h4>
            <p className="my-2 md:my-4 text-base text-fontcolor-subtitle text-center md:text-left">
              কোর্স করুন নিজ নিজ ক্ষেত্রে অভিজ্ঞ ও দক্ষ প্রশিক্ষকদের কাছ থেকে।
            </p>
          </div>

          <div className="md:flex flex-row items-center self-center gap-4 w-full sm:w-auto">
            <div className="h-10 pl-3 pr-2.5 py-2.5 bg-white border rounded-full flex items-center gap-2 overflow-hidden">
              <div data-svg-wrapper>
                <img src="/icon/search.png" alt="Search Icon" />
              </div>
              <input
                type="text"
                placeholder="প্রশিক্ষক খুঁজুন ..."
                className="flex-grow bg-transparent text-slate-500 text-sm font-normal font-['Noto Serif Bengali'] leading-[18px] border-none outline-none focus:border-none focus:ring-0"
                aria-label="Search"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
              {isLoading && <Loader className="w-4 h-4 mr-2 animate-spin" />}
            </div>
          </div>
        </div>

        {/* Experts Card */}
        {teachers.length > 0 ? (
          <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
            {teachers.map((teacher) => (
              <ExpertCard key={teacher.id} teacher={teacher} />
            ))}
          </div>
        ) : (
          <div className="mt-8 text-center border-2 border-gray-400 border-dashed rounded-lg p-14">
            <p className="text-xl text-center text-slate-500">
              কোন শিক্ষক পাওয়া যায়নি
            </p>
          </div>
        )}

        {/* Show "আরো দেখুন" button only if there are more teachers to load and no search is active */}
        {!searchTerm && hasMore && (
          <div className="flex items-center justify-center mt-5">
            <button
              onClick={fetchMoreTeachers}
              disabled={isLoading}
              className="items-center px-4 py-3 space-x-2 text-base font-semibold text-center text-white transition-all duration-300 rounded-lg cursor-pointer md:flex hover:opacity-70 bg-primary-brand"
            >
              <span>
                {isLoading ? (
                  <div className="flex space-x-1 p-2">
                    <div
                      className="w-1 h-1 rounded-full bg-white animate-bounce"
                      style={{ animationDelay: "0ms" }}
                    ></div>
                    <div
                      className="w-1 h-1 rounded-full bg-white animate-bounce"
                      style={{ animationDelay: "150ms" }}
                    ></div>
                    <div
                      className="w-1 h-1 rounded-full bg-white animate-bounce"
                      style={{ animationDelay: "300ms" }}
                    ></div>
                  </div>
                ) : (
                  "আরো দেখুন"
                )}
              </span>
            </button>
          </div>
        )}
      </div>
    </section>
  );
};

export default AllTeachers;
