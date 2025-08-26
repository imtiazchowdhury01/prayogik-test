//@ts-nocheck
import { Card, CardContent } from "@/components/ui/card";
import Image from "next/image";

export default function Testimonial({ item }) {
  return (
    <Card className="px-5 py-4 rounded-2xl mt-20 bg-gradient-to-t from-[#097568] to-[#01524D] text-white">
      <CardContent className="mt-5">{item.details}</CardContent>
      <div className="flex items-center gap-4 mt-3">
        <div className="w-12 h-12 min-h-12 min-w-12">
          <Image
            width={0}
            height={0}
            sizes="100vw"
            src={item.img}
            className="block object-cover w-full h-full rounded-full"
            alt="testimonial-image"
            quality={75}
          />
        </div>
        <div>
          <p className="font-bold">{item.name}</p>
          <p>{item.designation}</p>
        </div>
      </div>
    </Card>
  );
}
