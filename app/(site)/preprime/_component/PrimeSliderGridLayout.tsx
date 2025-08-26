// // @ts-nocheck
// import { motion } from "framer-motion";
// import { ArrowLeft, ArrowRight } from "lucide-react";
// import { useState } from "react";
// import PrimeGridLayoutImageCard from "./PrimeGridLayoutImageCard";
// interface Course {
//   id: string;
//   teacherProfile?: Teacher;
//   [key: string]: any; // Other course properties
// }
// interface Teacher {
//   user: {
//     name: string;
//   };
// }

// const PrimeSliderGridLayout = ({
//   displayCourses = [],
//   purchasedCourseIds,
//   userSubscription,
//   onClose,
// }) => {
//   const [currentPage, setCurrentPage] = useState(0);
//   const imagesPerPage = 8;
//   const totalPages = Math.ceil(displayCourses.length / imagesPerPage);

//   const getCurrentImages = () => {
//     const start = currentPage * imagesPerPage;
//     const end = start + imagesPerPage;
//     return displayCourses.slice(start, end);
//   };

//   const goToNext = () => {
//     setCurrentPage((prev) => (prev + 1) % totalPages);
//   };

//   const goToPrevious = () => {
//     setCurrentPage((prev) => (prev - 1 + totalPages) % totalPages);
//   };

//   return (
//     <motion.div
//       className="w-full"
//       initial={{ opacity: 0, y: 20 }}
//       animate={{ opacity: 1, y: 0 }}
//       exit={{ opacity: 0, y: -20 }}
//       transition={{ duration: 0.5 }}
//     >
//       <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8 max-w-7xl mx-auto">
//         {getCurrentImages().map((course: Course, ind: number) => (
//           <PrimeGridLayoutImageCard
//             key={course?.id || ind}
//             course={course}
//             purchasedCourseIds={purchasedCourseIds}
//             userSubscription={userSubscription}
//             isGrid={true}
//           />
//         ))}
//       </div>

//       {/* Navigation Controls - Below the grid */}
//       <div className="flex justify-between items-center flex-wrap gap-4 mt-8 max-w-7xl mx-auto">
//         {/* Pagination buttons */}
//         <div className="flex items-center gap-4 flex-wrap">
//           <button
//             onClick={goToPrevious}
//             disabled={totalPages <= 1}
//             className="flex items-center gap-2 rounded text-gray-700 bg-gray-200 hover:bg-gray-300 px-3 py-3 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
//           >
//             <ArrowLeft className="w-5 h-5" />
//           </button>

//           <span className="text-sm font-medium text-gray-700">
//             Page {currentPage + 1} of {totalPages}
//           </span>

//           <button
//             onClick={goToNext}
//             disabled={totalPages <= 1}
//             className="flex items-center gap-2 rounded text-gray-700 bg-gray-200 hover:bg-gray-300 px-3 py-3 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
//           >
//             <ArrowRight className="w-5 h-5" />
//           </button>
//         </div>
//         <div>
//           <button
//             onClick={onClose}
//             className="flex items-center gap-2 text-white bg-[#F9851A] px-3 py-3 sm:px-6 sm:py-3 text-sm md:text-base font-semibold text-center  transition-all duration-300 rounded-md"
//           >
//             <ArrowLeft className="w-4 h-4" />
//             Show Less
//           </button>
//         </div>
//       </div>
//     </motion.div>
//   );
// };
// export default PrimeSliderGridLayout;

// @ts-nocheck
import { motion, AnimatePresence } from "framer-motion";
import { useState } from "react";
import PrimeGridLayoutImageCard from "./PrimeGridLayoutImageCard";

interface Course {
  id: string;
  teacherProfile?: Teacher;
  [key: string]: any;
}

interface Teacher {
  user: {
    name: string;
  };
}

const PrimeSliderGridLayout = ({
  displayCourses = [],
}) => {
  const [visibleCount, setVisibleCount] = useState(8);
  const [isLoadingMore, setIsLoadingMore] = useState(false);
  const canLoadMore = visibleCount < displayCourses.length;

  const loadMore = () => {
    setIsLoadingMore(true);
    setTimeout(() => {
      setVisibleCount((prev) => Math.min(prev + 8, displayCourses.length));
      setIsLoadingMore(false);
    }, 500); // Slightly longer duration for smoother transition
  };

  const containerVariants = {
    hidden: { opacity: 0 },
    show: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1, // Increased stagger for better visual separation
        when: "beforeChildren",
      },
    },
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 30, scale: 0.95 },
    show: {
      opacity: 1,
      y: 0,
      scale: 1,
      transition: {
        type: "spring",
        damping: 10,
        stiffness: 100,
        duration: 0.5,
      },
    },
  };

  return (
    <motion.div
      className="w-full"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.8 }}
    >
      <motion.div
        className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 mb-8 max-w-7xl mx-auto"
        variants={containerVariants}
        initial="hidden"
        animate="show"
      >
        <AnimatePresence>
          {displayCourses
            .slice(0, visibleCount)
            .map((course: Course, ind: number) => (
              <motion.div
                key={course?.id || ind}
                variants={itemVariants}
                layout // This enables smooth layout animations
              >
                <PrimeGridLayoutImageCard
                  course={course}
                  isGrid={true}
                />
              </motion.div>
            ))}
        </AnimatePresence>
      </motion.div>

      {/* Load More button - centered */}
      {canLoadMore && (
        <div className="flex justify-center mt-8">
          <motion.button
            onClick={loadMore}
            className="text-white bg-[#F9851A] hover:opacity-90 px-8 py-3 text-base font-semibold rounded-lg shadow-md"
            disabled={isLoadingMore}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
          >
            {isLoadingMore ? (
              <motion.span animate={{ opacity: [0.6, 1, 0.6] }}>
                আরো দেখুন...
              </motion.span>
            ) : (
              "আরো দেখুন"
            )}
          </motion.button>
        </div>
      )}
    </motion.div>
  );
};

export default PrimeSliderGridLayout;
