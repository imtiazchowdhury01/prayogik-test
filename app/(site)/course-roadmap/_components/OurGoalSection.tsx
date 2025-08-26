import {
  Award,
  BookOpen,
  Briefcase,
  CheckCircle,
  Globe,
  Target,
  Users,
  Zap,
} from "lucide-react";

const OurGoalSection = () => {
  return (
    <section className="py-20">
      <div className="max-w-7xl px-6 md:px-1 mx-auto">
        <div className="text-center mb-16">
          <div className="inline-flex items-center gap-2 px-4 py-2 bg-blue-50 text-blue-700 rounded-full text-sm font-medium mb-6">
            <Target className="w-4 h-4" />
            আমাদের ভিশন
          </div>
          <h2 className="text-4xl font-bold text-gray-900 mb-8">
            আমাদের লক্ষ্য: প্রায়োগিক - একটি পূর্ণাঙ্গ লার্নিং ইকোসিস্টেম
          </h2>
        </div>

        <div className="prose prose-xl mx-auto text-gray-700 mb-16 text-center">
          <p className="text-xl leading-relaxed mb-8">
            প্রায়োগিক শুধুমাত্র একটি কোর্স প্ল্যাটফর্ম নয়; এটি একটি{" "}
            <strong className="text-teal-600">
              পূর্ণাঙ্গ লার্নিং ও ক্যারিয়ার গ্রোথ ইকোসিস্টেম
            </strong>{" "}
            গড়ে তোলার এক সুদূরপ্রসারী যাত্রা।
          </p>

          <p className="text-lg leading-relaxed mb-8">
            আমরা ভবিষ্যতের ইন-ডিমান্ড স্কিলগুলো তৈরিতে প্রতিশ্রুতিবদ্ধ এবং উন্নত
            বিশ্বের সাথে আমাদের জ্ঞান ও দক্ষতার ব্যবধান কমিয়ে আনাটাই আমাদের মূল
            উদ্দেশ্য।
          </p>
        </div>

        {/* Platform Features */}
        <div className="mb-16">
          <h3 className="text-2xl font-bold text-gray-900 mb-8 text-center">
            বহুমুখী প্ল্যাটফর্ম
          </h3>
          <p className="text-lg text-gray-600 text-center mb-12 max-w-3xl mx-auto">
            এই লক্ষ্য অর্জনে প্রায়োগিক হবে একটি বহুমুখী প্ল্যাটফর্ম যেখানে
            থাকবে কোর্স, সেমিনার, কর্মশালা, কমিউনিটি, সম্মেলন এবং বুটক্যাম্প সহ
            নানাবিধ উদ্যোগ।
          </p>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            <div className="text-center p-6 bg-gradient-to-br from-rose-50 to-pink-50 rounded-2xl border border-rose-100">
              <div className="w-16 h-16 bg-rose-100 rounded-2xl flex items-center justify-center mx-auto mb-4">
                <BookOpen className="w-8 h-8 text-rose-600" />
              </div>
              <h4 className="text-lg font-semibold text-gray-900 mb-2">
                কোর্স
              </h4>
              <p className="text-gray-600 text-sm">
                ইনহাউজ ও এক্সপার্ট-লেড কোর্স
              </p>
            </div>

            <div className="text-center p-6 bg-gradient-to-br from-blue-50 to-indigo-50 rounded-2xl border border-blue-100">
              <div className="w-16 h-16 bg-blue-100 rounded-2xl flex items-center justify-center mx-auto mb-4">
                <Award className="w-8 h-8 text-blue-600" />
              </div>
              <h4 className="text-lg font-semibold text-gray-900 mb-2">
                সেমিনার
              </h4>
              <p className="text-gray-600 text-sm">
                ইন্ডাস্ট্রি এক্সপার্টদের সাথে
              </p>
            </div>

            <div className="text-center p-6 bg-gradient-to-br from-amber-50 to-orange-50 rounded-2xl border border-amber-100">
              <div className="w-16 h-16 bg-amber-100 rounded-2xl flex items-center justify-center mx-auto mb-4">
                <Users className="w-8 h-8 text-amber-600" />
              </div>
              <h4 className="text-lg font-semibold text-gray-900 mb-2">
                কর্মশালা
              </h4>
              <p className="text-gray-600 text-sm">
                হ্যান্ডস-অন প্র্যাক্টিক্যাল ট্রেনিং
              </p>
            </div>

            <div className="text-center p-6 bg-gradient-to-br from-emerald-50 to-teal-50 rounded-2xl border border-emerald-100">
              <div className="w-16 h-16 bg-emerald-100 rounded-2xl flex items-center justify-center mx-auto mb-4">
                <Globe className="w-8 h-8 text-emerald-600" />
              </div>
              <h4 className="text-lg font-semibold text-gray-900 mb-2">
                কমিউনিটি
              </h4>
              <p className="text-gray-600 text-sm">
                শিক্ষার্থীদের নেটওয়ার্কিং
              </p>
            </div>

            <div className="text-center p-6 bg-gradient-to-br from-purple-50 to-violet-50 rounded-2xl border border-purple-100">
              <div className="w-16 h-16 bg-purple-100 rounded-2xl flex items-center justify-center mx-auto mb-4">
                <Briefcase className="w-8 h-8 text-purple-600" />
              </div>
              <h4 className="text-lg font-semibold text-gray-900 mb-2">
                সম্মেলন
              </h4>
              <p className="text-gray-600 text-sm">
                বার্ষিক ইভেন্ট ও নেটওয়ার্কিং
              </p>
            </div>

            <div className="text-center p-6 bg-gradient-to-br from-teal-50 to-cyan-50 rounded-2xl border border-teal-100">
              <div className="w-16 h-16 bg-teal-100 rounded-2xl flex items-center justify-center mx-auto mb-4">
                <Zap className="w-8 h-8 text-teal-600" />
              </div>
              <h4 className="text-lg font-semibold text-gray-900 mb-2">
                বুটক্যাম্প
              </h4>
              <p className="text-gray-600 text-sm">
                ইনটেনসিভ স্কিল ডেভেলপমেন্ট
              </p>
            </div>
          </div>
        </div>

        {/* Approach */}
        <div className="mb-12">
          <div className="bg-gradient-to-r from-teal-50 via-blue-50 to-indigo-50 p-8 rounded-3xl border border-teal-100">
            <div className="text-center mb-8">
              <div className="w-20 h-20 bg-white rounded-2xl flex items-center justify-center mx-auto mb-6 shadow-lg">
                <Target className="w-10 h-10 text-teal-600" />
              </div>
              <h3 className="text-2xl font-bold text-gray-900 mb-4">
                আমাদের অ্যাপ্রোচ
              </h3>
            </div>

            <div className="grid md:grid-cols-2 gap-8 items-center">
              <div className="space-y-6">
                <div className="flex items-start gap-4">
                  <div className="w-8 h-8 bg-teal-100 rounded-full flex items-center justify-center flex-shrink-0 mt-1">
                    <CheckCircle className="w-5 h-5 text-teal-600" />
                  </div>
                  <div>
                    <h4 className="font-semibold text-gray-900 mb-2">
                      ইনহাউজ কোর্স ডেভেলপমেন্ট
                    </h4>
                    <p className="text-gray-600">
                      আমাদের নিজস্ব এক্সপার্ট টিমের মাধ্যমে কোর্স তৈরি
                    </p>
                  </div>
                </div>

                <div className="flex items-start gap-4">
                  <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center flex-shrink-0 mt-1">
                    <CheckCircle className="w-5 h-5 text-blue-600" />
                  </div>
                  <div>
                    <h4 className="font-semibold text-gray-900 mb-2">
                      দেশি-বিদেশি এক্সপার্ট কোলাবরেশন
                    </h4>
                    <p className="text-gray-600">
                      আন্তর্জাতিক মানের কোর্স ও ওয়ার্কশপ
                    </p>
                  </div>
                </div>
              </div>

              <div className="relative">
                <div className="bg-white p-6 rounded-2xl shadow-lg">
                  <div className="flex items-center gap-3 mb-4">
                    <Globe className="w-6 h-6 text-teal-600" />
                    <span className="font-semibold text-gray-900">
                      গ্লোবাল স্ট্যান্ডার্ড
                    </span>
                  </div>
                  <p className="text-gray-600 mb-4">
                    উন্নত বিশ্বের সাথে জ্ঞান ও দক্ষতার ব্যবধান কমানো
                  </p>
                  <div className="w-full bg-gray-100 rounded-full h-2">
                    <div className="bg-gradient-to-r from-teal-500 to-blue-500 h-2 rounded-full w-3/4"></div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default OurGoalSection;
