import { Button } from "@/components/ui/button"; // Import the Button component from shadcn/ui
import { UserX } from "lucide-react";
import Link from "next/link";

const TeacherNotFound = () => (
  <div className="min-h-[70vh] flex flex-col items-center justify-center bg-white">
    <div className="text-center p-8 max-w-md">
      <UserX className="w-16 h-16 mx-auto mb-6 text-gray-400" />
      <h2 className="text-2xl font-bold text-gray-900 mb-3">
        শিক্ষক খুঁজে পাওয়া যায়নি
      </h2>
      <p className="text-gray-600 mb-8">
        আপনি যে শিক্ষককে খুঁজছেন তিনি এই প্ল্যাটফর্মে নেই অথবা URL টি ভুল হতে
        পারে।
      </p>
      <Link href="/">
        <Button variant="outline">হোম পেজে ফিরে যান</Button>
      </Link>
    </div>
  </div>
);

export default TeacherNotFound;
