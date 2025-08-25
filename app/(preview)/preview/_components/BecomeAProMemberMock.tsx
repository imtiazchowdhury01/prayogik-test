import { Button } from "@/components/ui/button";

const BecomeAProMemberMock = () => {
  return (
    <div className="relative bg-primary-900 p-8 mt-10 rounded-lg overflow-hidden">
      <p className="text-greyscale-50 font-bold text-xl">
        প্রায়োগিকের প্লাস মেম্বার হয়ে
      </p>
      <p className="mt-1 text-3xl font-bold">
        <span className="text-lime-200">২৫% কম খরচে </span> <br />
        <span className="text-xl font-bold text-white">
          সব কোর্সের এক্সেস নিন
        </span>
      </p>
      <Button
        disabled
        className="bg-secondary-brand relative text-center block mt-10 z-10 hover:bg-secondary-700 transition-all duration-300 text-white w-full rounded-lg cursor-pointer font-semibold"
      >
        সকল কোর্সের মেম্বার হন{" "}
      </Button>
      {/* curve shape-- */}
      <div className="absolute bottom-0 right-0 pointer-events-none">
        <svg
          width="168"
          height="202"
          viewBox="0 0 168 202"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
        >
          <path
            fillRule="evenodd"
            clipRule="evenodd"
            d="M97.89 1.2588C112.161 -1.13227 124.316 13.7561 138.523 16.6883C162.298 21.5955 193.286 1.72598 209.322 24.2582C223.955 44.8179 211.442 80.4357 201.275 104.859C192.559 125.796 171.084 124.761 155.736 138.465C146.191 146.986 120.661 142.037 112.928 153.069C99.7655 171.844 115.397 221.563 97.89 233.537C80.647 245.33 55.713 245.245 40.0113 230.454C24.0417 215.41 27.754 184.132 20.6217 160.749C14.7559 141.519 -2.69323 124.696 1.70195 104.859C6.38325 83.7312 29.481 79.7744 41.9674 64.4094C50.452 53.9688 54.2486 39.3038 63.0824 29.3282C73.5094 17.5536 83.9764 3.59001 97.89 1.2588Z"
            stroke="white"
            strokeOpacity="0.2"
            strokeWidth="2"
          />
          <path
            fillRule="evenodd"
            clipRule="evenodd"
            d="M113.272 38.2255C125.684 36.142 136.256 49.1153 148.613 51.6703C169.292 55.9463 196.244 38.6326 210.192 58.2664C222.919 76.1816 212.036 107.218 203.192 128.5C195.612 146.743 177.506 146.545 164.156 158.486C155.855 165.911 136.016 167.588 129.289 177.201C117.841 193.561 128.499 230.192 113.272 240.626C98.2744 250.902 76.5875 250.828 62.9308 237.939C49.0409 224.831 52.2698 197.576 46.0663 177.201C40.9645 160.444 25.7878 145.785 29.6105 128.5C33.6822 110.089 53.7719 106.642 64.6321 93.253C72.0117 84.1554 75.3139 71.3768 82.9973 62.6843C92.0663 52.4243 101.17 40.2569 113.272 38.2255Z"
            stroke="white"
            strokeOpacity="0.2"
            strokeWidth="2"
          />
          <path
            fillRule="evenodd"
            clipRule="evenodd"
            d="M143.04 76.5518C154.901 74.521 165.003 87.1664 176.81 89.6568C196.57 93.8248 222.323 76.9486 235.651 96.0863C247.812 113.549 237.413 143.8 228.963 164.545C221.719 182.327 205.542 189.678 192.786 201.317C184.854 208.555 174.515 210.72 168.088 220.09C157.149 236.036 157.59 263.667 143.04 273.836C128.71 283.853 107.987 283.781 94.9377 271.218C81.6655 258.441 84.7507 231.874 78.8231 212.014C73.9481 195.681 59.4462 181.393 63.099 164.545C66.9896 146.599 86.1861 143.239 96.5634 130.189C103.615 121.321 106.77 108.865 114.112 100.392C122.778 90.3918 131.477 78.5318 143.04 76.5518Z"
            stroke="white"
            strokeOpacity="0.2"
            strokeWidth="2"
          />
        </svg>
      </div>
    </div>
  );
};

export default BecomeAProMemberMock;
