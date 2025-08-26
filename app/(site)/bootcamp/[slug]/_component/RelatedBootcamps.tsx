import { BootcampCard } from "../../_component/BootcampCard";

const bootcamps = [
  {
    id: 1,
    title: "গ্রাফিক্স ডিজাইন বুটক্যাম্প",
    image: "/images/teacher/teacher3.webp",
    altText: "Graphics Design Bootcamp",
    type: "ফুল-টাইম",
    location: "জিইসি, চট্টগ্রাম",
    paymentType: "পেইড বুটক্যাম্প",
    duration: "২১ জানুয়ারী থেকে ১১ এপ্রিল",
    schedule: "সোমবার থেকে শুক্রবার",
    weeks: "১২ সপ্তাহের বুটক্যাম্প",
    registration: "১২ জানুয়ারী থেকে ১৮ জানুয়ারী পর্যন্ত রেজিস্ট্রেশন তারিখ",
  },
  {
    id: 2,
    title: "ডিজিটাল মার্কেটিং বুটক্যাম্প",
    image: "/images/teacher/teacher3.webp",
    altText: "Digital Marketing Bootcamp",
    type: "ফুল-টাইম",
    location: "জিইসি, চট্টগ্রাম",
    paymentType: "পেইড বুটক্যাম্প",
    duration: "২১ জানুয়ারী থেকে ১১ এপ্রিল",
    schedule: "সোমবার থেকে শুক্রবার",
    weeks: "১২ সপ্তাহের বুটক্যাম্প",
    registration: "১২ জানুয়ারী থেকে ১৮ জানুয়ারী পর্যন্ত রেজিস্ট্রেশন তারিখ",
  },
  {
    id: 3,
    title: "ডিজিটাল মার্কেটিং বুটক্যাম্প",
    image: "/images/teacher/teacher3.webp",
    altText: "Digital Marketing Bootcamp",
    type: "ফুল-টাইম",
    location: "জিইসি, চট্টগ্রাম",
    paymentType: "পেইড বুটক্যাম্প",
    duration: "২১ জানুয়ারী থেকে ১১ এপ্রিল",
    schedule: "সোমবার থেকে শুক্রবার",
    weeks: "১২ সপ্তাহের বুটক্যাম্প",
    registration: "১২ জানুয়ারী থেকে ১৮ জানুয়ারী পর্যন্ত রেজিস্ট্রেশন তারিখ",
  },
 
];

export const RelatedBootcamps = () => {
  return (
    <section className="mt-14 max-md:mt-10">
      <div className="flex flex-wrap gap-4 items-center leading-none">
        <h2 className="flex-1 text-2xl font-bold text-slate-900">
          আরো বুটক্যাম্প
        </h2>
        <button className="flex gap-0.5 items-center p-2 text-xs font-semibold text-white bg-teal-600 hover:bg-teal-500  transition-all duration-300 rounded">
          <span>আরও দেখুন</span>
          <img src="/icon/arrow-right-white.png" alt="arrow" />
        </button>
      </div>

      <div className=" mt-5 grid gap-5 w-full grid-cols-[repeat(auto-fill,minmax(280px,1fr))] max-md:grid-cols-[repeat(auto-fill,minmax(240px,1fr))] max-sm:grid-cols-[1fr]">
        {bootcamps.map((bootcamp) => (
          <BootcampCard key={bootcamp.id} {...bootcamp} />
        ))}
      </div>
    </section>
  );
};
