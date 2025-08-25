import Image from "next/image";

const Team = () => {
  return (
    <section className="text-center space-y-6 lg:space-y-8">
      <h2 className="text-2xl sm:text-3xl lg:text-4xl font-bold text-gray-900">
        আমাদের টিম
      </h2>
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 lg:gap-6">
        <div className="relative">
          <Image
            src="/images/about/placeholder.svg"
            alt="Team member working on development"
            width={300}
            height={300}
            className="rounded-lg object-cover w-full h-[200px] sm:h-[250px] lg:h-[300px]"
            quality={75}
          />
        </div>
        <div className="relative">
          <Image
            src="/images/about/placeholder.svg"
            alt="Team member in training session"
            width={300}
            height={300}
            className="rounded-lg object-cover w-full h-[200px] sm:h-[250px] lg:h-[300px]"
            quality={75}
          />
        </div>
        <div className="relative">
          <Image
            src="/images/about/placeholder.svg"
            alt="Team member collaborating"
            width={300}
            height={300}
            className="rounded-lg object-cover w-full h-[200px] sm:h-[250px] lg:h-[300px]"
            quality={75}
          />
        </div>
        <div className="relative">
          <Image
            src="/images/about/placeholder.svg"
            alt="Team member mentoring students"
            width={300}
            height={300}
            className="rounded-lg object-cover w-full h-[200px] sm:h-[250px] lg:h-[300px]"
            quality={75}
          />
        </div>
      </div>
    </section>
  );
};

export default Team;
