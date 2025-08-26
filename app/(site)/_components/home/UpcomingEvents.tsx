import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
} from "@/components/ui/card";
import { formatDuration } from "@/lib/formatDuration";
import { Calendar, Clock, MapPin } from "lucide-react";
import Image from "next/image";
import eventImage1 from "@/public/images/event/event-1.webp"; // Static import
import eventImage2 from "@/public/images/event/event-2.webp"; // Static import
import eventImage3 from "@/public/images/event/event-3.webp"; // Static import
import eventImage4 from "@/public/images/event/event-4.webp"; // Static import

export default function UpcomingEvents() {
  const jobCards = [
    {
      id: 1,
      image: eventImage1,
      title: "ডিজিটাল মার্কেটিংয়ে SEO নিয়ে আসছে বড় আপডেট ইভেন্ট।",
      description:
        "নতুন সুযোগের জন্য অভিজ্ঞতা নিয়ে আমাদের আমাদের আপডেটের সাথে যুক্ত হন।",
      duration: 10200,
      date: "২৫ সেপ্টেম্বর ২০২৫",
      location: "ঢাকা, চট্টগ্রাম",
    },
    {
      id: 2,
      image: eventImage2,
      title: "আপনার ব্র্যান্ড বাড়াতে আগামি মার্কেটিং ইভেন্ট জরুরি।",
      description:
        "নতুন সুযোগের জন্য অভিজ্ঞতা নিয়ে আমাদের আমাদের আপডেটের সাথে যুক্ত হন।",
      duration: 10200,
      date: "২৫ সেপ্টেম্বর ২০২৫",
      location: "জিইসি, চট্টগ্রাম",
    },
    {
      id: 3,
      image: eventImage3,
      title: "আগামি মার্কেটিং ইভেন্টে স্মার্ট কৌশল শেখার সুযোগ পাবেন।",
      description:
        "নতুন সুযোগের জন্য অভিজ্ঞতা নিয়ে আমাদের আমাদের আপডেটের সাথে যুক্ত হন।",
      duration: 10200,
      date: "২৫ সেপ্টেম্বর ২০২৫",
      location: "জিইসি, চট্টগ্রাম",
    },
    {
      id: 4,
      image: eventImage4,
      title: "আপনার ব্যবসা উন্নয়নের সেরা প্ল্যাটফর্ম আগামি ইভেন্ট।",
      description:
        "নতুন সুযোগের জন্য অভিজ্ঞতা নিয়ে আমাদের আমাদের আপডেটের সাথে যুক্ত হন।",
      duration: 10200,
      date: "২৫ সেপ্টেম্বর ২০২৫",
      location: "জিইসি, চট্টগ্রাম",
    },
  ];

  return (
    <section className="px-6 md:px-8 lg:px-8 xl:px-8 2xl:px-0 py-24 max-w-7xl mx-auto ">
      <div className="mb-8">
        <h2 className="font-bold md:text-left text-center text-3xl sm:text-4xl md:text-[40px]">
          আপকামিং ইভেন্ট
        </h2>
        <p className="mt-2 md:mt-4 md:my-4 text-base text-fontcolor-subtitle text-center md:text-left">
          নতুন স্কিল শেখার ইভেন্ট শুরু হচ্ছে শিগগিরই
        </p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {jobCards.map((job) => (
          <Card key={job.id} className="bg-white rounded-lg shadow-sm">
            <CardHeader className="p-0">
              <div
                className="relative w-full overflow-hidden rounded-t-lg"
                style={{ aspectRatio: "16/9" }}
              >
                <Image
                  src={job?.image}
                  alt="Job image"
                  fill
                  className="object-cover"
                  sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 25vw"
                  loading="lazy"
                  placeholder="blur"
                  quality={75}
                />
              </div>
            </CardHeader>
            <CardContent className="p-4">
              <h3 className="text-base font-bold text-gray-900 mb-2 line-clamp-2 leading-tight">
                {job.title}
              </h3>
              <p className="text-sm text-gray-700 mb-4 line-clamp-2">
                {job.description}
              </p>
              <div className="space-y-2">
                <div className="flex items-center text-sm text-gray-600">
                  <Clock className="w-4 h-4 mr-1 text-gray-800" />
                  <span>{formatDuration(job.duration)}</span>
                </div>
                <div className="flex items-center text-base text-gray-600">
                  <Calendar className="w-4 h-4 mr-1 text-gray-800" />
                  <span>{job.date}</span>
                </div>
                <div className="flex items-center text-base text-gray-600">
                  <MapPin className="w-4 h-4 mr-1 text-gray-800" />
                  <span>{job.location}</span>
                </div>
              </div>
            </CardContent>
            <CardFooter className="p-4 pt-0">
              <Button className="w-full h-12 text-base" variant={"disabled"}>
                বুকিং করুন
              </Button>
            </CardFooter>
          </Card>
        ))}
      </div>
    </section>
  );
}
