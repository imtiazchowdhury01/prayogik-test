// //@ts-nocheck
// import { Button } from "@/components/ui/button";
// import { ArrowRight, Crown, MapPin, Rocket, Target } from "lucide-react";
// import Link from "next/link";
// import { getCourseRoadmap } from "@/lib/getCourseRoadmap";

// const RoadMapHeroSection = async () => {
//   const { firstLiveCourse, firstPlannedCourse, firstWipCourse } =
//     await getCourseRoadmap("HERO");
//   return (
//     <section className="py-20">
//       <div className="grid lg:grid-cols-2 gap-16 items-center">
//         {/* Left Content - Remains exactly the same */}
//         <div>
//           <div className="inline-flex items-center gap-2 px-4 py-2 bg-teal-50 text-teal-700 rounded-full text-sm font-medium mb-8">
//             <MapPin className="w-4 h-4" />
//             আপনার ক্যারিয়ার রোডম্যাপ
//           </div>

//           <h1 className="text-5xl lg:text-6xl font-bold text-gray-900 mb-6 leading-tight">
//             প্রায়োগিক এর
//             <br />
//             <span className="text-teal-600">রোডম্যাপ</span>
//           </h1>

//           <p className="text-xl text-gray-600 mb-8 leading-relaxed">
//             আমরা কী তৈরি করেছি, কী তৈরি করছি, আর কী সামনে আসছে — আপনার
//             ক্যারিয়ার ও উন্নয়নের অংশীদার হিসেবে।
//           </p>

//           <div className="space-y-4 mb-10">
//             <div className="flex items-center gap-3">
//               <div className="w-2 h-2 bg-teal-500 rounded-full"></div>
//               <span className="text-gray-700">
//                 কোন কোর্সগুলো এখনই শেখা যাবে
//               </span>
//             </div>
//             <div className="flex items-center gap-3">
//               <div className="w-2 h-2 bg-amber-500 rounded-full"></div>
//               <span className="text-gray-700">
//                 কোন কোর্স বা প্রোগ্রাম তৈরি হচ্ছে
//               </span>
//             </div>
//             <div className="flex items-center gap-3">
//               <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
//               <span className="text-gray-700">ভবিষ্যতে কোন বিষয়গুলো আসছে</span>
//             </div>
//           </div>
//           <Link href="/prime">
//             <Button
//               size="lg"
//               className="bg-teal-600 hover:bg-teal-700 text-white px-8 py-4 text-lg font-medium rounded-lg"
//             >
//               <Crown className="w-5 h-5 mr-2" />
//               এখনই মেম্বারশিপ নিন
//               <ArrowRight className="w-5 h-5 ml-2" />
//             </Button>
//           </Link>
//         </div>

//         {/* Right Visual - Updated with dynamic courses */}
//         <div className="relative">
//           <div className="bg-gradient-to-br from-teal-50 to-blue-50 rounded-3xl p-8 relative overflow-hidden">
//             {/* Background Pattern */}
//             <div className="absolute inset-0 opacity-5">
//               <div className="absolute top-10 left-10 w-20 h-20 border-2 border-teal-300 rounded-full"></div>
//               <div className="absolute top-32 right-16 w-16 h-16 border-2 border-blue-300 rounded-lg rotate-45"></div>
//               <div className="absolute bottom-20 left-20 w-12 h-12 border-2 border-amber-300 rounded-full"></div>
//             </div>

//             {/* Content Cards - Now dynamic */}
//             <div className="relative space-y-6">
//               {/* Live Course Card - Shows first live course or placeholder */}
//               {firstLiveCourse && (
//                 <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100">
//                   <div className="flex items-center gap-3 mb-3">
//                     <div className="w-3 h-3 bg-green-500 rounded-full"></div>
//                     <span className="text-sm font-medium text-green-700">
//                       Completed
//                     </span>
//                   </div>
//                   <h3 className="font-semibold text-gray-900 mb-2">
//                     {firstLiveCourse.title}
//                   </h3>
//                   <div className="w-full bg-gray-100 rounded-full h-2">
//                     <div className="bg-green-500 h-2 rounded-full w-full"></div>
//                   </div>
//                 </div>
//               )}

//               {/* WIP Course Card - Shows first WIP course or placeholder */}
//               {firstWipCourse && (
//                 <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100 ml-8">
//                   <div className="flex items-center gap-3 mb-3">
//                     <div className="w-3 h-3 bg-amber-500 rounded-full"></div>
//                     <span className="text-sm font-medium text-amber-700">
//                       In Progress
//                     </span>
//                   </div>
//                   <h3 className="font-semibold text-gray-900 mb-2">
//                     {firstWipCourse.title}
//                   </h3>
//                   <div className="w-full bg-gray-100 rounded-full h-2">
//                     <div className="bg-amber-500 h-2 rounded-full w-3/4"></div>
//                   </div>
//                 </div>
//               )}

//               {/* Planned Course Card - Shows first planned course or placeholder */}
//               {firstPlannedCourse && (
//                 <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100">
//                   <div className="flex items-center gap-3 mb-3">
//                     <div className="w-3 h-3 bg-blue-500 rounded-full"></div>
//                     <span className="text-sm font-medium text-blue-700">
//                       Planned
//                     </span>
//                   </div>
//                   <h3 className="font-semibold text-gray-900 mb-2">
//                     {firstPlannedCourse.title}
//                   </h3>
//                   <div className="w-full bg-gray-100 rounded-full h-2">
//                     <div className="bg-blue-500 h-2 rounded-full w-1/4"></div>
//                   </div>
//                 </div>
//               )}
//             </div>

//             {/* Floating Elements - Remain the same */}
//             <div className="absolute -top-4 -right-4 bg-white rounded-full p-4 shadow-lg">
//               <Target className="w-6 h-6 text-teal-600" />
//             </div>
//             <div className="absolute -bottom-4 -left-4 bg-white rounded-full p-4 shadow-lg">
//               <Rocket className="w-6 h-6 text-blue-600" />
//             </div>
//           </div>
//         </div>
//       </div>
//     </section>
//   );
// };

// export default RoadMapHeroSection;
