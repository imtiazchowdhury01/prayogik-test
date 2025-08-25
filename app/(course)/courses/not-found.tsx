"use client";
import Link from "next/link";

export default function NotFound() {
  return (
    <div className="flex flex-col items-center justify-center min-h-screen text-gray-800 bg-gray-100">
      <h2 className="mb-4 text-4xl font-bold text-red-500">কোনো পেইজ পাওয়া যায়নি</h2>
      <p className="mb-6 text-gray-600 text-md">
        আপনি যে পেইজটি খুঁজছেন সেটি বিদ্যমান নেই বা অন্য কোথাও সরিয়ে ফেলা হয়েছে।
      </p>
      <Link
        href="/"
        className="px-6 py-3 text-white transition duration-200 bg-teal-600 rounded-lg hover:bg-teal-700"
      >
        হোম পেজে ফিরে যান
      </Link>
    </div>
  );
}
