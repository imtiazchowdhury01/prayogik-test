import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import Image from "next/image";
import React from "react";

const courses = [
  {
    image: "https://placehold.co/150x150",
    title: "The Complete 2024 Web Development Bootcamp",
    instructor: "Dr. Angela Yu, Developer and Lead Instructor",
    rating: 4.7,
    reviews: 405736,
    hours: 61.5,
    lectures: 373,
    level: "All Levels",
    price: "$13.99",
    originalPrice: "$74.99",
  },
  {
    image: "https://placehold.co/150x150",
    title: "iOS & Swift - The Complete iOS App Development",
    instructor: "Dr. Angela Yu, Developer and Lead Instructor",
    rating: 4.7,
    reviews: 91949,
    hours: 60.5,
    lectures: 542,
    level: "All Levels",
    price: "$13.99",
    originalPrice: "$74.99",
  },
  {
    image: "https://placehold.co/150x150",
    title: "The Complete Flutter Development Bootcamp",
    instructor: "Dr. Angela Yu, Developer and Lead Instructor",
    rating: 4.5,
    reviews: 55038,
    hours: 29,
    lectures: 217,
    level: "All Levels",
    price: "$13.99",
    originalPrice: "$74.99",
  },
];

export default function MoreCourses() {
  return (
    <div className="my-12">
      <h1 className="text-2xl font-bold mb-6">
        More Courses by{" "}
        <span className="text-[#0D9488]">
          Dr. Angela Yu, Developer and Lead Instructor
        </span>
      </h1>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
        {courses.map((course, index) => (
          <Card key={index} className=" border-none shadow-none">
            <CardHeader className="p-0">
              <Image
                width={250}
                height={250}
                src="/images/courses/course.webp"
                alt={course.title}
                className="rounded"
              />
              {/* <Image
                fill
                className="w-full h-40 object-cover rounded-md mb-4 p-0"
                alt="title"
                src="/images/courses/course.png"
              /> */}
              <CardTitle className="text-lg font-bold p-0">
                {course.title}
              </CardTitle>
              <CardDescription className="text-sm text-gray-600">
                {course.instructor}
              </CardDescription>
            </CardHeader>
            <CardContent className="p-0">
              <div className="flex items-center mb-2">
                <span className="text-yellow-500">
                  <i className="fas fa-star"></i>
                </span>
                <span className="ml-1 font-bold">{course.rating}</span>
                <span className="ml-1 text-gray-600">
                  ({course.reviews.toLocaleString()})
                </span>
              </div>
              <p className="text-sm text-gray-600 mb-2">
                {course.hours} total hours • {course.lectures} lectures •{" "}
                {course.level}
              </p>
            </CardContent>
            <CardFooter className="flex items-center gap-2 p-0">
              <span className="text-lg font-bold">{course.price}</span>
              <span className="ml-2 line-through text-gray-500">
                {course.originalPrice}
              </span>
            </CardFooter>
          </Card>
        ))}
      </div>
    </div>
  );
}
