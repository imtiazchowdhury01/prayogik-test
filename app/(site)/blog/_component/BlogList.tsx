"use client";

import React from "react";
import { BlogPostCard } from "./BlogPostCard";
import NewsletterCard  from "./NewsletterCard";
import { TopicSelector } from "../../bootcamp/_component/TopicSelector";
import SeeMoreBtn from "@/components/seeMore-btn";

export const BlogList = () => {
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
    {
      image: "/images/blog/blog-banner.svg",
      category: "পণ্য",
      title: "প্রধানমন্ত্রীর মানসিক মডেল",
      description:
        "মানসিক মডেলগুলি জটিল প্রক্রিয়া বা সম্পর্কের সহজ অভিব্যক্তি।",
      authorImage: "/images/teacher/user1.webp",
      authorName: "আজিজুল হক",
      date: "16 জানুয়ারী 2024",
    },
    {
      image: "/images/blog/blog-banner.svg",
      category: "ডিজাইন",
      title: "ওয়্যারফ্রেমিং কি?",
      description:
        "ওয়্যারফ্রেমিং এবং এর নীতিগুলির পরিচিতি। শিল্পের সেরা থেকে শিখুন।",
      authorImage: "/images/teacher/user1.webp",
      authorName: "জামিল আহমাদ",
      date: "15 জানুয়ারী 2024",
    },
    {
      image: "/images/blog/blog-banner.svg",
      category: "ডিজাইন",
      title: "কিভাবে সহযোগিতা আমাদের আরও ভালো ভালো ডিজাইনার করে",
      description:
        "সহযোগিতা আমাদের দলগুলিকে আরও শক্তিশালী করে তুলতে পারে এবং আমাদের স্বতন্ত্র নকশাগুলি আরও ভাল করে তুলতে পারে।",
      authorImage: "/images/teacher/user1.webp",
      authorName: "আহমেদ হাসান",
      date: "14 জানুয়ারী 2024",
    },
    {
      image: "/images/blog/blog-banner.svg",
      category: "গ্রাহক সাফল্য",
      title: "পডকাস্ট: একটি ভাল CX সম্প্রদায় তৈরি করা করা করা",
      description:
        "একটি সম্প্রদায় শুরু করার জন্য জটিল হওয়ার দরকার নেই, তবে আপনি কীভাবে শুরু করবেন?",
      authorImage: "/images/teacher/user1.webp",
      authorName: "রফিক হাসান",
      date: "12 জানুয়ারী 2024",
    },
  ];

  return (
    <main className="app-container py-16">
      <header className="flex justify-between items-center mb-6 w-full max-sm:flex-col max-sm:gap-4 max-sm:items-start">
        <h1 className="text-2xl font-bold leading-none text-slate-900">
          সাম্প্রতিক ব্লগ সমূহ
        </h1>
        <TopicSelector />
      </header>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {blogPosts.map((post, index) => (
          <React.Fragment key={index}>
            <BlogPostCard {...post} />
            {index === 2 && <NewsletterCard />}
          </React.Fragment>
        ))}
      </div>
      <div className="flex items-center justify-center mt-10">
        <SeeMoreBtn href="/blog" title="আরো দেখুন" className="flex " />
      </div>
    </main>
  );
};

export default BlogList;
