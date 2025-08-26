import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ArrowRight, BookOpen, CheckCircle, Crown } from "lucide-react";
import Link from "next/link";

const HowToTakeCourse = () => {
  const membershipBenefits = [
    "সমস্ত ফ্রি ট্যাগযুক্ত কোর্স এক্সেস ফ্রি",
    "অন্যান্য কোর্সে ৬০-৭০% ডিসকাউন্ট",
    "নতুন কোর্সে আগেভাগে এক্সেস",
    "প্রাইভেট কমিউনিটি এক্সেস",
    "লাইভ সেশনে অংশগ্রহণের সুযোগ",
  ];

  return (
    <section className="py-16 ">
      <h2 className="text-3xl font-bold text-gray-900 mb-12 text-center">
        প্রায়োগিকের কোর্স কিভাবে করা যাবে
      </h2>

      <div className="grid md:grid-cols-2 gap-8">
        {/* Membership */}
        <Card className="border border-teal-200 bg-teal-50">
          <CardHeader>
            <CardTitle className="text-2xl text-gray-900 flex items-center gap-2">
              <Crown className="w-6 h-6 text-teal-600" />
              মেম্বারশিপ – ফ্রি এক্সেস সুবিধা
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-lg text-gray-700 mb-6">
              Prayogik মেম্বারশিপে আপনি পাবেন:
            </p>

            <div className="space-y-3 mb-8">
              {membershipBenefits.map((benefit, index) => (
                <div key={index} className="flex items-start gap-3">
                  <CheckCircle className="w-5 h-5 text-teal-600 mt-0.5 flex-shrink-0" />
                  <span className="text-gray-700">{benefit}</span>
                </div>
              ))}
            </div>
            <Link href="/prime">
              <Button className="w-full bg-teal-600 hover:bg-teal-700 text-white py-3">
                এখনই মেম্বারশিপ কিনুন
                <ArrowRight className="w-4 h-4 ml-2" />
              </Button>
            </Link>
          </CardContent>
        </Card>

        {/* Individual Courses */}
        <Card className="border border-gray-200">
          <CardHeader>
            <CardTitle className="text-2xl text-gray-900 flex items-center gap-2">
              <BookOpen className="w-6 h-6 text-gray-600" />
              যেকোনো কোর্স আলাদা করেও কিনতে পারবেন
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-lg text-gray-700 mb-8 leading-relaxed">
              আপনি যদি মেম্বার না হন, তবুও যেকোনো কোর্স আপনি আলাদা কিনতে পারবেন
              — আর আপনার কাছে সেই কোর্সের এক্সেস থাকবে আজীবনের জন্য।
            </p>
            <Link href="/courses">
              <Button className="w-full bg-gray-900 hover:bg-gray-800 text-white py-3">
                সব কোর্স দেখুন
                <ArrowRight className="w-4 h-4 ml-2" />
              </Button>
            </Link>
          </CardContent>
        </Card>
      </div>
    </section>
  );
};

export default HowToTakeCourse;
