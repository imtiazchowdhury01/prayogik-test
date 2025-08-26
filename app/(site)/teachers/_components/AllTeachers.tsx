// @ts-nocheck
"use client";

import ExpertCard from "@/components/ExpertCard";
import { Loader, Search } from "lucide-react";
import React, { useState, useEffect, useCallback } from "react";
import debounce from "lodash/debounce";
import { Button } from "@/components/ui/button";

const AllTeachers = ({ initialTeachers, blurDataMap }) => {
  const [teachers, setTeachers] = useState(initialTeachers || []);
  const [isLoading, setIsLoading] = useState(false);
  const [hasMore, setHasMore] = useState(initialTeachers?.length === 12);
  const [currentSkip, setCurrentSkip] = useState(12);
  const [searchTerm, setSearchTerm] = useState("");

  // Modified search function to only find teachers with createdCourses
  const debouncedSearch = useCallback(
    debounce(async (term) => {
      if (!term.trim()) {
        // Reset to initial state when search is cleared
        setTeachers(initialTeachers || []);
        setHasMore(initialTeachers?.length === 12);
        setCurrentSkip(12);
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

        // Assuming search API returns same structure as pagination API
        if (searchResults.data) {
          setTeachers(searchResults.data);
          setHasMore(searchResults.pagination?.hasMore || false);
        } else {
          // Fallback for old search API structure
          setTeachers(searchResults);
          setHasMore(false);
        }
      } catch (err) {
        console.error("Search failed:", err);
        setTeachers([]);
        setHasMore(false);
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
    if (isLoading || searchTerm || !hasMore) return;

    setIsLoading(true);
    try {
      const response = await fetch(
        `/api/teacher/experts/all-experts?skip=${currentSkip}&limit=12&hasCourses=true`
      );
      const result = await response.json();

      if (result.data && result.pagination) {
        setTeachers((prev) => [...prev, ...result.data]);
        setHasMore(result.pagination.hasMore);
        setCurrentSkip(currentSkip + result.pagination.limit);
      } else {
        // Fallback for unexpected response structure
        console.error("Unexpected API response structure:", result);
        setHasMore(false);
      }
    } catch (err) {
      console.error("Failed to load more:", err);
      setHasMore(false);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <section className="w-full py-16 md:py-[100px]">
      <div className="app-container">
        <div className="flex flex-col items-center justify-between w-full mb-6 space-y-3 sm:space-y-0 sm:flex-row">
          <div>
            <h2 className="font-bold md:text-left text-center text-3xl sm:text-4xl md:text-[40px]">
              ফিল্ড এক্সপার্ট প্রশিক্ষক
            </h2>
            <p className="my-2 md:my-4 text-base text-fontcolor-subtitle text-center md:text-left">
              কোর্স করুন নিজ নিজ ক্ষেত্রে অভিজ্ঞ ও দক্ষ প্রশিক্ষকদের কাছ থেকে।
            </p>
          </div>

          <div className="md:flex flex-row items-center self-center gap-4 w-full sm:w-auto">
            <div className="h-10 pl-3 pr-2.5 py-2.5 bg-white border rounded-full flex items-center gap-2 overflow-hidden">
              <div data-svg-wrapper>
                <Search className="w-4 h-4 text-gray-500" />
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
            {teachers.map((teacher) => {
              const blurDataURL = teacher?.avatarUrl
                ? blurDataMap[teacher.avatarUrl]
                : null;
              return (
                <ExpertCard
                  key={teacher.id}
                  teacher={teacher}
                  blurDataURL={blurDataURL}
                />
              );
            })}
          </div>
        ) : (
          <div className="mt-8 text-center border-2 border-gray-400 border-dashed rounded-lg p-14">
            <p className="text-xl text-center text-slate-500">
              {isLoading ? "লোড হচ্ছে..." : "কোন শিক্ষক পাওয়া যায়নি"}
            </p>
          </div>
        )}

        {/* Show "আরো দেখুন" button only if hasMore is true and no search is active */}
        {!searchTerm && hasMore && (
          <div className="flex items-center justify-center mt-5">
            <Button
              onClick={fetchMoreTeachers}
              disabled={isLoading}
              variant={"outline"}
              className="py-3 text-gray-500 min-w-[106px] relative"
            >
              {isLoading ? (
                <Loader className="animate-spin h-5 w-5" />
              ) : (
                "আরও দেখুন"
              )}
            </Button>
          </div>
        )}
      </div>
    </section>
  );
};

export default AllTeachers;
