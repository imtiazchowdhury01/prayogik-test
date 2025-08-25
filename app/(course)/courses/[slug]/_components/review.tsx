import { Button } from "@/components/ui/button";
import Image from "next/image";

const reviews = [
  {
    id: 1,
    name: "Madyson H.",
    rating: 5,
    time: "a week ago",
    text: "Very entertaining and easy to follow course with lots of projects and great step by step guides. I felt like I actually learned a lot. Easily the best course to take for beginners",
    helpful: true,
    notHelpful: false,
    avatar: "https://placehold.co/40x40?text=MH&font=roboto",
  },
  {
    id: 2,
    name: "Eike H.",
    rating: 5,
    time: "3 weeks ago",
    text: "This is a good course for someone how does not know how to code, but is interested.Each lection has projects, this is an enormous help to internalize the code. Additionally, for some projects, you need to use Google to get som…",
    helpful: true,
    notHelpful: false,
    avatar: "https://placehold.co/40x40?text=E&font=roboto",
  },
  {
    id: 3,
    name: "Eike H.",
    rating: 5,
    time: "3 weeks ago",
    text: "This is a good course for someone how does not know how to code, but is interested.Each lection has projects, this is an enormous help to internalize the code. Additionally, for some projects, you need to use Google to get som…",
    helpful: true,
    notHelpful: false,
    avatar: "https://placehold.co/40x40?text=E&font=roboto",
  },
  {
    id: 4,
    name: "Eike H.",
    rating: 5,
    time: "3 weeks ago",
    text: "This is a good course for someone how does not know how to code, but is interested.Each lection has projects, this is an enormous help to internalize the code. Additionally, for some projects, you need to use Google to get som…",
    helpful: true,
    notHelpful: false,
    avatar: "https://placehold.co/40x40?text=E&font=roboto",
  },
];

export default function Review() {
  return (
    <div className="">
      <h1 className="text-2xl font-bold my-4">Reviews</h1>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {reviews.map((review, index) => (
          <div key={index} className="p-4">
            <div className="flex items-center">
              <Image
                width={40}
                height={40}
                src="/images/testimonials/rasel.jpg"
                alt={`${review.name} avatar`}
                className=" object-cover rounded-full mr-4"
                quality={75}
              />
              <div>
                <div className="font-bold">{review.name}</div>
                <div className="flex items-center">
                  {[...Array(review.rating)].map((_, i) => (
                    <i key={i} className="fas fa-star text-yellow-500"></i>
                  ))}
                  <span className="text-gray-500 ml-2">{review.time}</span>
                </div>
              </div>
              <div className="ml-auto">
                <i className="fas fa-ellipsis-v text-gray-500"></i>
              </div>
            </div>
            <p className="mt-3">{review.text}</p>
          </div>
        ))}
      </div>
      <Button className="rounded-none my-3">Show all reviews</Button>
    </div>
  );
}
