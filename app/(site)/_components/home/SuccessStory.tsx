// import SuccessStoryClient from "./SuccessStoryClient";
import SuccessStoryGrid from "./SuccessStoryGrid";
const SuccessStory = () => {
  const bgColors = ["bg-[#F8F3E9]", "bg-[#E9F8F2]", "bg-[#EEF8E9]"];

  const testimonials = [
    {
      id: 1,
      title: "",
      name: "খান মিরাজ",
      avatar: "/reviews/khan-miraj.jpg",
      text: "শেখার জন্য দক্ষতা দরকার। ভিডিও বারবার দেখতে হয়েছে। মুখে তুলে খাওয়ানো নয়, প্র্যাকটিকালি করলে সত্যিকারের লিংক বিল্ডিং শেখা যায়।",
      bgColor: bgColors[0],
    },
    {
      id: 2,
      title: "",
      name: "রাসেল আহমেদ রাজু",
      avatar: "/reviews/rasel-ahmed-raju.jpg",
      text: "সত্যিকারের শেখা পেয়েছি। ভিডিও ছোট, কিন্তু খুব ভ্যালুয়েবল। ভ্যালুয়েবল কন্টেন্ট থাকলে সহজেই ভালো লিংক তৈরি করা সম্ভব।",
      bgColor: bgColors[1],
    },
    {
      id: 3,
      title: "",
      name: "কাজী নূর",
      avatar: "/reviews/kazi-noor.jpg",
      text: "ভিডিও বারবার দেখতে হবে। সহজভাবে বোঝানো হয়েছে। ক্যারিয়ার, সার্ভিস, মার্কেটপ্লেস শেখানো হয়েছে। এক্সপার্ট হতে চাইলে অবশ্যই করা উচিত।",
      bgColor: bgColors[2],
    },
    {
      id: 4,
      title: "",
      name: "মোঃ আল শাহরিয়ার",
      avatar: "/reviews/md-al-shahriyar.jpg",
      text: "নতুনদের জন্য দারুণ গাইড। লিংক বিল্ডিং নিয়ে ভয় দূর হয়েছে। স্পষ্ট, গুছানো শেখানো হয়েছে। ক্যারিয়ার সেটআপেও দিকনির্দেশনা দেয়।",
      bgColor: bgColors[2],
    },
    {
      id: 5,
      title: "",
      name: "দেবাশিস বৈদ্য",
      avatar: "/reviews/debashis-baidya.jpg",
      text: "সব কিছু নিখুঁতভাবে দেখানো হয়েছে। স্কাইস্ক্র্যাপার, আউটরিচ, কনটেন্ট তৈরি শেখানো হয়েছে। বাংলায় এমন অ্যাডভান্স কোর্স আগে দেখিনি। করতেই হবে।",
      bgColor: bgColors[0],
    },
    {
      id: 6,
      title: "",
      name: "এম এস এইচ চৌধুরী",
      avatar: "/reviews/msgchowdhury.jpg",
      text: "কাশেম ভাইয়ের শেখানো কিওয়ার্ড রিসার্চ দুর্দান্ত। এখন ইনকাম শুরু হয়েছে। তিনটি সার্ভিস বিক্রি করেছি, নতুন প্রজেক্টের প্ল্যানও বানাচ্ছি।",
      bgColor: bgColors[1],
    },
  ];

  return (
    <section className="bg-white">
      <div className="px-6 md:px-8 lg:px-8 xl:px-8 2xl:px-0 pb-24 max-w-7xl mx-auto ">
        {/* <SuccessStoryClient testimonials={testimonials} /> */}
        <SuccessStoryGrid testimonials={testimonials} />
      </div>
    </section>
  );
};

export default SuccessStory;
