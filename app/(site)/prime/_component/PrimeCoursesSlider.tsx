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
import React, { useRef, useState, useMemo } from "react";
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
      initialOffset = 0, // New prop for initial offset
      ...props
    },
    ref
  ) => {
    const baseX = useMotionValue(initialOffset); // Use initialOffset here
    const { scrollY } = useScroll();
    const scrollVelocity = useVelocity(scrollY);

    const smoothVelocity = useSpring(scrollVelocity, {
      damping: 100,
      stiffness: 20,
    });
    const velocityFactor = useTransform(smoothVelocity, [0, 10000], [0, 0.6], {
      clamp,
    });
    const x = useTransform(baseX, (v) => `${wrap(-20, -50, v)}%`); // Adjusted wrap values

    const directionFactor = useRef(1);
    const scrollThreshold = useRef(5);

    useAnimationFrame((t, delta) => {
      if (movable) {
        move(delta);
      } else {
        if (Math.abs(scrollVelocity.get()) >= scrollThreshold.current) {
          move(delta);
        }
      }
    });

    function move(delta) {
      let moveBy = directionFactor.current * velocity * (delta / 1000);
      if (velocityFactor.get() < 0) {
        directionFactor.current = -1;
      } else if (velocityFactor.get() > 0) {
        directionFactor.current = 1;
      }
      moveBy += directionFactor.current * moveBy * velocityFactor.get();
      baseX.set(baseX.get() + moveBy);
    }

    return (
      <div
        ref={ref}
        className={`relative m-0 flex flex-nowrap overflow-hidden whitespace-nowrap leading-[0.8] ${className}`}
        {...props}
      >
        <motion.div
          className="flex flex-row flex-nowrap whitespace-nowrap"
          style={{ x }}
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
  const velocity = [0.2, -0.2];

  // Create different arrangements for each row to avoid same cards appearing together
  const courseArrangements = useMemo(() => {
    const arrangements = [];

    // First row: original order
    arrangements.push(displayCourses);

    // Second row: reverse order with offset
    const secondRowCourses = [...displayCourses].reverse();
    // Add additional offset by moving first 3 items to the end
    const offset = Math.floor(displayCourses.length / 2);
    const reorderedSecondRow = [
      ...secondRowCourses.slice(offset),
      ...secondRowCourses.slice(0, offset),
    ];
    arrangements.push(reorderedSecondRow);

    return arrangements;
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
  // console.log("courseArrangements result:", courseArrangements);
  return (
    <div className="w-full overflow-hidden">
      <div className="flex flex-col space-y-10 pb-10">
        {velocity.map((v, index) => (
          <ScrollVelocity
            key={index}
            velocity={v}
            initialOffset={index % 2 === 0 ? -10 : -10} // Alternate initial offsets
          >
            {/* First Loop with different arrangement for each row */}
            {courseArrangements[index].map((course, ind: number) => (
              <PrimeGridLayoutImageCard
                key={`${index}-${course.id || ind}`}
                course={course}
              />
            ))}

            {/* Second loop: Duplicate images to create infinite scroll effect */}
            {courseArrangements[index].map((course, ind: number) => (
              <PrimeGridLayoutImageCard
                key={`${index}-dup-${course.id || ind}`}
                course={course}
              />
            ))}
          </ScrollVelocity>
        ))}
      </div>

      {/* Show More Button */}
      <div className="flex items-center justify-center max-w-7xl mx-auto md:px-0 px-4">
        <motion.button
          onClick={() => setShowGrid(true)}
          className="flex items-center gap-2 text-white bg-[#F9851A] hover:opacity-90 px-3 py-3 sm:px-6 sm:py-3 text-sm md:text-base font-semibold text-center  rounded-md"
          whileTap={{ scale: 0.95 }}
        >
          <span className="font-semibold">সব প্রাইম কোর্স দেখুন </span>
          <ArrowRight className="w-5 h-5" />
        </motion.button>
      </div>
    </div>
  );
};

export default PrimeCoursesSlider;
