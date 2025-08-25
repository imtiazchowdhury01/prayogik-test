import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { PlayCircle, Star, User, Users } from "lucide-react";
import Image from "next/image";
import React from "react";

export default function AuthorBio() {
  return (
    <Card className="p-0 my-12 border-none shadow-none">
      <CardHeader>
        <CardTitle className="text-2xl font-bold">Instructor</CardTitle>
        <CardDescription className="text-xl font-bold text-[#0D9488] mt-2">
          Dr. Angela Yu, Developer and Lead Instructor
        </CardDescription>
        <p className="text-gray-600">Developer and Lead Instructor</p>
      </CardHeader>
      <CardContent>
        <div className="flex md:flex-row flex-col  md:items-center gap-3 mt-2">
          <Image
            width={100}
            height={100}
            src="/images/testimonials/miraz.jpg"
            alt=""
            className="rounded-full"
            quality={75}
          />
          <div>
            <div className="flex items-center  mb-2">
              <Star className="text-gray-500 mr-2 h-4 w-4" />
              <span className="text-black">4.7 Instructor Rating</span>
            </div>
            <div className="flex items-center mb-2">
              <User className="text-gray-500 mr-2 h-4 w-4" />
              <span className="text-black">884,169 Reviews</span>
            </div>
            <div className="flex items-center mb-2">
              <Users className="text-gray-500 mr-2 h-4 w-4" />
              <span className="text-black">2,896,343 Students</span>
            </div>
            <div className="flex items-center">
              <PlayCircle className="text-gray-500 mr-2 h-4 w-4" />
              <span className="text-black">7 Courses</span>
            </div>
          </div>
        </div>
        <p className="mt-4 text-gray-800">
          I'm Angela, I'm a developer with a passion for teaching. I'm the{" "}
          <span className="font-bold">lead instructor</span> at the London App
          Brewery, London's leading{" "}
          <span className="font-bold">Programming Bootcamp</span>. I've helped
          hundreds of thousands of students learn to code and change their lives
          by becoming a developer. I've been invited by companies such as
          Twitter, Facebook, and Google to teach their employees.
        </p>
      </CardContent>
    </Card>
  );
}
