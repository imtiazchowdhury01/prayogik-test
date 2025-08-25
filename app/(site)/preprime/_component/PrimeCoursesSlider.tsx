// //@ts-nocheck
// "use client";
// import {
//   motion,
//   useAnimationFrame,
//   useMotionValue,
//   useScroll,
//   useSpring,
//   useTransform,
//   useVelocity,
//   wrap,
// } from "framer-motion";
// import { ArrowLeft, ArrowRight } from "lucide-react";
// import React, { useRef, useState, useMemo, useCallback } from "react";
// import PrimeGridLayoutImageCard from "./PrimeGridLayoutImageCard";
// import PrimeSliderGridLayout from "./PrimeSliderGridLayout";

// // ScrollVelocity Component
// const ScrollVelocity = React.forwardRef(
//   (
//     {
//       children,
//       velocity = 5,
//       movable = true,
//       clamp = false,
//       className,
//       initialOffset = 0,
//       ...props
//     },
//     ref
//   ) => {
//     const baseX = useMotionValue(initialOffset);
//     const { scrollY } = useScroll();
//     const scrollVelocity = useVelocity(scrollY);

//     // Reduced spring damping and stiffness for mobile performance
//     const smoothVelocity = useSpring(scrollVelocity, {
//       damping: 50, // Reduced from 100
//       stiffness: 10, // Reduced from 20
//     });

//     const velocityFactor = useTransform(smoothVelocity, [0, 10000], [0, 0.4], {
//       // Reduced max velocity factor
//       clamp,
//     });

//     const x = useTransform(baseX, (v) => `${wrap(-20, -50, v)}%`);

//     const directionFactor = useRef(1);
//     const scrollThreshold = useRef(5);
//     const lastTime = useRef(0);

//     // Throttle animation frame for mobile performance
//     const throttledMove = useCallback(
//       (delta) => {
//         let moveBy = directionFactor.current * velocity * (delta / 1000);

//         if (velocityFactor.get() < 0) {
//           directionFactor.current = -1;
//         } else if (velocityFactor.get() > 0) {
//           directionFactor.current = 1;
//         }

//         // Reduce velocity impact for smoother mobile performance
//         const velocityImpact = Math.min(Math.abs(velocityFactor.get()), 0.3);
//         moveBy += directionFactor.current * moveBy * velocityImpact;
//         baseX.set(baseX.get() + moveBy);
//       },
//       [velocity, velocityFactor, baseX]
//     );

//     useAnimationFrame((t, delta) => {
//       // Throttle animation updates for mobile (limit to ~30fps instead of 60fps)
//       if (t - lastTime.current < 33) return; // ~30fps
//       lastTime.current = t;

//       if (movable) {
//         throttledMove(delta);
//       } else {
//         if (Math.abs(scrollVelocity.get()) >= scrollThreshold.current) {
//           throttledMove(delta);
//         }
//       }
//     });

//     return (
//       <div
//         ref={ref}
//         className={`relative m-0 flex flex-nowrap overflow-hidden whitespace-nowrap leading-[0.8] ${className}`}
//         style={{
//           // Add hardware acceleration
//           transform: "translateZ(0)",
//           willChange: "transform",
//         }}
//         {...props}
//       >
//         <motion.div
//           className="flex flex-row flex-nowrap whitespace-nowrap"
//           style={{
//             x,
//             // Ensure hardware acceleration
//             transform: "translateZ(0)",
//             willChange: "transform",
//           }}
//         >
//           {children}
//         </motion.div>
//       </div>
//     );
//   }
// );

// ScrollVelocity.displayName = "ScrollVelocity";

// // Main Component
// const PrimeCoursesSlider = ({ displayCourses }) => {
//   const [showGrid, setShowGrid] = useState(false);

//   // Reduced velocity for smoother mobile experience
//   const velocity = [0.15, -0.15]; // Reduced from [0.2, -0.2]

//   // Create unique randomized arrangements for each row to avoid duplicates
//   const courseArrangements = useMemo(() => {
//     const totalCourses = displayCourses.length;

//     if (totalCourses <= 4) {
//       // For very few courses, show all in first row, empty second row
//       return [displayCourses, []];
//     }

//     // Shuffle the courses first
//     const shuffledCourses = [...displayCourses].sort(() => Math.random() - 0.3);

//     // Split shuffled courses between two rows
//     const midPoint = Math.ceil(totalCourses / 2);

//     // First row: first half of shuffled courses
//     const firstRow = shuffledCourses.slice(0, midPoint);

//     // Second row: remaining shuffled courses
//     const secondRow = shuffledCourses.slice(midPoint);

//     return [firstRow, secondRow];
//   }, [displayCourses]);

//   if (showGrid) {
//     return (
//       <div className="w-full p-6 py-0">
//         <PrimeSliderGridLayout
//           displayCourses={displayCourses}
//           onClose={() => setShowGrid(false)}
//         />
//       </div>
//     );
//   }

//   return (
//     <div
//       className="w-full overflow-hidden"
//       style={{
//         // Optimize container for mobile scrolling
//         transform: "translateZ(0)",
//         backfaceVisibility: "hidden",
//         perspective: "1000px",
//       }}
//     >
//       <div className="flex flex-col space-y-8 pb-10">
//         {velocity.map((v, index) => {
//           // Skip rendering if this row has no courses
//           if (courseArrangements[index].length === 0) return null;

//           return (
//             <ScrollVelocity
//               key={index}
//               velocity={v}
//               initialOffset={index % 2 === 0 ? -10 : -10}
//             >
//               {/* First Loop */}
//               {courseArrangements[index].map((course, ind) => (
//                 <PrimeGridLayoutImageCard
//                   key={`${index}-${course.id || ind}`}
//                   course={course}
//                 />
//               ))}

//               {/* Second loop for infinite scroll */}
//               {courseArrangements[index].map((course, ind) => (
//                 <PrimeGridLayoutImageCard
//                   key={`${index}-dup-${course.id || ind}`}
//                   course={course}
//                 />
//               ))}

//               {/* Third loop for smoother infinite scroll with fewer items */}
//               {courseArrangements[index].map((course, ind) => (
//                 <PrimeGridLayoutImageCard
//                   key={`${index}-trip-${course.id || ind}`}
//                   course={course}
//                 />
//               ))}
//             </ScrollVelocity>
//           );
//         })}
//       </div>

//       {/* Show More Button */}
//       <div className="flex items-center justify-center max-w-7xl mx-auto md:px-0 px-4">
//         <motion.button
//           onClick={() => setShowGrid(true)}
//           className="flex items-center gap-2 text-white bg-[#F9851A] hover:opacity-90 px-3 py-3 sm:px-6 sm:py-3 text-sm md:text-base font-semibold text-center rounded-md"
//           whileTap={{ scale: 0.95 }}
//           // Add hardware acceleration for button
//           style={{ transform: "translateZ(0)" }}
//         >
//           <span className="font-semibold">সব প্রাইম কোর্স দেখুন </span>
//           <ArrowRight className="w-5 h-5" />
//         </motion.button>
//       </div>
//     </div>
//   );
// };

// export default PrimeCoursesSlider;

//@ts-nocheck
"use client";
import {
  motion,
  useAnimationFrame,
  useMotionValue,
  useScroll,
  useSpring,
  useTransform,
  useVelocity,
  wrap,
} from "framer-motion";
import { ArrowLeft, ArrowRight } from "lucide-react";
import React, { useRef, useState, useMemo, useCallback } from "react";
import PrimeGridLayoutImageCard from "./PrimeGridLayoutImageCard";
import PrimeSliderGridLayout from "./PrimeSliderGridLayout";

// ScrollVelocity Component
const ScrollVelocity = React.forwardRef(
  (
    {
      children,
      velocity = 5,
      movable = true,
      clamp = false,
      className,
      initialOffset = 0,
      ...props
    },
    ref
  ) => {
    const baseX = useMotionValue(initialOffset);
    const { scrollY } = useScroll();
    const scrollVelocity = useVelocity(scrollY);

    // Reduced spring damping and stiffness for mobile performance
    const smoothVelocity = useSpring(scrollVelocity, {
      damping: 50, // Reduced from 100
      stiffness: 10, // Reduced from 20
    });

    const velocityFactor = useTransform(smoothVelocity, [0, 10000], [0, 0.4], {
      // Reduced max velocity factor
      clamp,
    });

    const x = useTransform(baseX, (v) => `${wrap(-20, -50, v)}%`);

    const directionFactor = useRef(1);
    const scrollThreshold = useRef(5);
    const lastTime = useRef(0);

    // Throttle animation frame for mobile performance
    const throttledMove = useCallback(
      (delta) => {
        let moveBy = directionFactor.current * velocity * (delta / 1000);

        if (velocityFactor.get() < 0) {
          directionFactor.current = -1;
        } else if (velocityFactor.get() > 0) {
          directionFactor.current = 1;
        }

        // Reduce velocity impact for smoother mobile performance
        const velocityImpact = Math.min(Math.abs(velocityFactor.get()), 0.3);
        moveBy += directionFactor.current * moveBy * velocityImpact;
        baseX.set(baseX.get() + moveBy);
      },
      [velocity, velocityFactor, baseX]
    );

    useAnimationFrame((t, delta) => {
      // Throttle animation updates for mobile (limit to ~30fps instead of 60fps)
      if (t - lastTime.current < 33) return; // ~30fps
      lastTime.current = t;

      if (movable) {
        throttledMove(delta);
      } else {
        if (Math.abs(scrollVelocity.get()) >= scrollThreshold.current) {
          throttledMove(delta);
        }
      }
    });

    return (
      <div
        ref={ref}
        className={`relative m-0 flex flex-nowrap overflow-hidden whitespace-nowrap leading-[0.8] ${className}`}
        style={{
          // Add hardware acceleration
          transform: "translateZ(0)",
          willChange: "transform",
        }}
        {...props}
      >
        <motion.div
          className="flex flex-row flex-nowrap whitespace-nowrap"
          style={{
            x,
            // Ensure hardware acceleration
            transform: "translateZ(0)",
            willChange: "transform",
          }}
        >
          {children}
        </motion.div>
      </div>
    );
  }
);

ScrollVelocity.displayName = "ScrollVelocity";

// Main Component
const PrimeCoursesSlider = ({ displayCourses }) => {
  const [showGrid, setShowGrid] = useState(false);

  // Reduced velocity for smoother mobile experience
  const velocity = [0.15, -0.15]; // Reduced from [0.2, -0.2]

  // Create unique randomized arrangements ensuring no visual duplicates
  const courseArrangements = useMemo(() => {
    const totalCourses = displayCourses.length;

    if (totalCourses <= 4) {
      // For very few courses, show all in first row, empty second row
      return [displayCourses, []];
    }

    // Create multiple shuffled versions to ensure variety
    const createShuffledArray = (arr, seed = 0) => {
      const shuffled = [...arr];
      // Use a more deterministic shuffle with different seeds
      for (let i = shuffled.length - 1; i > 0; i--) {
        const j =
          Math.floor(((Math.sin(seed + i) + 1) * shuffled.length) / 2) %
          (i + 1);
        [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
      }
      return shuffled;
    };

    // Create two different shuffled versions
    const shuffle1 = createShuffledArray(displayCourses, 1);
    const shuffle2 = createShuffledArray(displayCourses, 2);

    // Split each shuffled version differently
    const midPoint1 = Math.ceil(totalCourses / 2);
    const midPoint2 = Math.floor(totalCourses / 2);

    // First row: mix from both shuffles to ensure uniqueness
    const firstRow = shuffle1.slice(0, midPoint1);

    // Second row: remaining courses from second shuffle, avoiding first row courses
    const remainingCourses = shuffle2.filter(
      (course) =>
        !firstRow.some((firstRowCourse) => firstRowCourse.id === course.id)
    );

    // If we need more courses for second row, add from remaining
    const secondRow = remainingCourses.slice(0, totalCourses - midPoint1);

    // If second row is still short, fill with remaining unique courses
    if (secondRow.length < totalCourses - midPoint1) {
      const usedIds = new Set([
        ...firstRow.map((c) => c.id),
        ...secondRow.map((c) => c.id),
      ]);

      const additionalCourses = displayCourses.filter(
        (course) => !usedIds.has(course.id)
      );

      secondRow.push(...additionalCourses);
    }

    return [firstRow, secondRow];
  }, [displayCourses]);

  if (showGrid) {
    return (
      <div className="w-full p-6 py-0">
        <PrimeSliderGridLayout
          displayCourses={displayCourses}
          onClose={() => setShowGrid(false)}
        />
      </div>
    );
  }

  return (
    <div
      className="w-full overflow-hidden"
      style={{
        // Optimize container for mobile scrolling
        transform: "translateZ(0)",
        backfaceVisibility: "hidden",
        perspective: "1000px",
      }}
    >
      <div className="flex flex-col space-y-8 pb-10">
        {velocity.map((v, index) => {
          // Skip rendering if this row has no courses
          if (courseArrangements[index].length === 0) return null;

          return (
            <ScrollVelocity
              key={index}
              velocity={v}
              initialOffset={index % 2 === 0 ? -10 : -30} // Different initial offsets for visual separation
            >
              {/* Create enough repetitions to ensure smooth infinite scroll without visible duplicates */}
              {Array.from({ length: 4 }, (_, loopIndex) =>
                courseArrangements[index].map((course, ind) => (
                  <PrimeGridLayoutImageCard
                    key={`${index}-loop${loopIndex}-${course.id || ind}`}
                    course={course}
                  />
                ))
              ).flat()}
            </ScrollVelocity>
          );
        })}
      </div>

      {/* Show More Button */}
      <div className="flex items-center justify-center max-w-7xl mx-auto md:px-0 px-4">
        <motion.button
          onClick={() => setShowGrid(true)}
          className="flex items-center gap-2 text-white bg-[#F9851A] hover:opacity-90 px-3 py-3 sm:px-6 sm:py-3 text-sm md:text-base font-semibold text-center rounded-md"
          whileTap={{ scale: 0.95 }}
          // Add hardware acceleration for button
          style={{ transform: "translateZ(0)" }}
        >
          <span className="font-semibold">সব প্রাইম কোর্স দেখুন </span>
          <ArrowRight className="w-5 h-5" />
        </motion.button>
      </div>
    </div>
  );
};

export default PrimeCoursesSlider;
