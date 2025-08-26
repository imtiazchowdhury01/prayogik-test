//@ts-nocheck
export default function FeatureList({ features, FeatureTitle }) {
  return (
    <section className="max-w-4xl mx-6 mt-2 lg:mx-auto px-6 sm:px-6 lg:px-0 lg:pl-12 lg:pr-20 py-10 bg-[#F3F9F9] rounded-xl">
      {FeatureTitle && (
        <h3 className="text-2xl md:text-[32px] leading-10 font-semibold mb-10">
          {FeatureTitle}
        </h3>
      )}
      <div className="space-y-6">
        {features.map((feature, idx) => (
          <div key={idx} className="space-y-2">
            <h3 className="text-xl md:text-2xl font-semibold leading-8 text-gray-900">
              {feature.title}
            </h3>
            <ul className="leading-6 text-gray-700 max-w-4xl">
              {feature.points.map((point, i) => (
                <li
                  key={i}
                  className="text-base font-normal md:pr-20 relative pl-4 before:content-['•'] before:absolute before:left-0 before:top-0 before:text-[14px] before:text-gray-800 before:leading-6"
                >
                  {point}
                </li>
              ))}
            </ul>
          </div>
        ))}
      </div>
    </section>
  );
}
