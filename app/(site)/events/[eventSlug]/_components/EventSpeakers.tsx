import React from "react";
import SpeakerCard from "./SpeakerCard";

const EventSpeakers = ({ speakers }: any) => {
  return (
    <div className="pt-10 pb-20 border-t">
      <h4 className="text-2xl font-bold text-fontcolor-title mb-6">
        আমাদের সম্মানিত স্পিকার
      </h4>
      <div className="grid grid-cols-1 md:grid-cols-2  lg:grid-cols-3 gap-6">
        {speakers.map((speaker: any, index: number) => (
          <SpeakerCard key={index} speaker={speaker} />
        ))}
      </div>
    </div>
  );
};

export default EventSpeakers;
