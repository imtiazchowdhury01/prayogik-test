// components/search/NoResultsMessage.tsx
import Link from "next/link";

interface NoResultsMessageProps {
  query?: string;
}

export function NoResultsMessage({ query }: NoResultsMessageProps) {
  return (
    <div className="text-center py-16 border border-dashed mt-5">
      <div className="max-w-md mx-auto">
        <div className="mb-6">
          <svg
            className="mx-auto h-16 w-16 text-gray-300"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={1.5}
              d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.746 0 3.332.477 4.5 1.253v13C19.832 18.477 18.246 18 16.5 18c-1.746 0-3.332.477-4.5 1.253"
            />
          </svg>
        </div>
        <h3 className="text-xl font-semibold text-gray-800 mb-2">
          কোন কোর্স পাওয়া যায়নি
        </h3>
        {query ? (
          <>
            <p className="text-gray-500 mb-6">
              "{query}" এর জন্য কোন কোর্স খুঁজে পাওয়া যায়নি। শীঘ্রই নতুন কোর্স
              যুক্ত করা হবে।
            </p>
            <div className="space-y-2 text-sm text-gray-500 mb-6">
              <p>• বানান চেক করুন</p>
              <p>• আরও সাধারণ কীওয়ার্ড ব্যবহার করুন</p>
              <p>• কম শব্দ ব্যবহার করুন</p>
            </div>
          </>
        ) : (
          <p className="text-gray-500 mb-6">
            এই বিভাগে এখনো কোন কোর্স যুক্ত করা হয়নি। শীঘ্রই নতুন কোর্স যুক্ত
            করা হবে।
          </p>
        )}
        <Link
          href={"/courses"}
          className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-brand "
        >
          ← পূর্ববর্তী পাতায় ফিরে যান
        </Link>
      </div>
    </div>
  );
}
