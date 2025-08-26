// @ts-nocheck
import * as React from "react";
import { BlogPostCard } from "../../_component/BlogPostCard";
import MoreBtn from "@/components/more-btn";

export function RecentBlogs() {
  const blogPosts = [
    {
      image: "/images/blog/blog-banner.svg",
      category: "ডিজাইন",
      title: "Ux পর্যালোচনা উপস্থাপনা",
      description:
        "আপনি কীভাবে আকর্ষণীয় উপস্থাপনা তৈরি করবেন যা আপনার সহকর্মীদের বাহ এবং আপনার পরিচালকদের প্রভাবিত করে?",
      authorImage: "/images/teacher/user1.webp",
      authorName: "এমদাদ হোসাইন",
      date: "20 জানুয়ারী 2024",
    },
    {
      image: "/images/blog/blog-banner.svg",
      category: "পণ্য",
      title: "লিনিয়ার 101-এ স্থানান্তরিত হচ্ছে",
      description:
        "লিনিয়ার সফ্টওয়্যার প্রকল্পগুলি, স্প্রিন্টস, কার্যগুলি এবং বাগ ট্র্যাকিংকে স্ট্রিমলাইন করতে সহায়তা করে কীভাবে শুরু করবেন তা এখানে।",
      authorImage: "/images/teacher/user1.webp",
      authorName: "আহমেদ হাসান",
      date: "19 জানুয়ারী 2024",
    },
    {
      image: "/images/blog/blog-banner.svg",
      category: "সফটওয়্যার ইঞ্জিনিয়ারিং",
      title: "আপনার এপিআই স্ট্যাক তৈরি করা হচ্ছে",
      description:
        "রেস্টফুল এপিআইগুলির উত্থান তাদের তৈরি, পরীক্ষা এবং পরিচালনার জন্য সরঞ্জামগুলির উত্থানের মাধ্যমে পূরণ করা হয়েছে।",
      authorImage: "/images/teacher/user1.webp",
      authorName: "রফিক হাসান",
      date: "18 জানুয়ারী 2024",
    },
  ];

  return (
    <div className="">
      {/* recent blogs section-- */}
      <section className="py-20 bg-background-gray">
        <div className="app-container">
          <div className="flex items-center justify-between">
            <h4 className="mb-4 text-3xl font-bold text-fontcolor-title">
              সাম্প্রতিক ব্লগ
            </h4>
            <MoreBtn
              href="/blog"
              title="আরো দেখুন"
              className="hidden text-xs font-semibold md:flex"
            />
          </div>
          <div className="grid grid-cols-1 gap-6 mt-6 md:grid-cols-3 lg:grid-cols-3 xl:grid-cols-3">
            {blogPosts.map((post, index) => (
              <React.Fragment key={index}>
                <BlogPostCard {...post} />
              </React.Fragment>
            ))}
          </div>
          <div className="flex items-center justify-center mt-5">
            <MoreBtn
              href="/blog"
              title="আরো দেখুন"
              className="flex text-xs font-semibold md:hidden"
            />
          </div>
        </div>
      </section>
      ;
    </div>
  );
}
