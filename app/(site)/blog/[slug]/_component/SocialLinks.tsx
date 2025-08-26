import React from "react";

export function SocialLinks() {
  return (
    <div className="flex gap-3 items-start self-stretch my-auto min-w-60">
      <button
        // onClick={handleCopy}
        className="flex overflow-hidden gap-1 justify-center items-center px-4 py-3 text-sm font-semibold leading-none text-center text-black bg-white rounded border border-solid border-[#CBD5E1] min-h-10"
      >
        <img
          src="/images/blog/copy.svg"
          className="flex shrink-0 self-stretch my-auto h-[18px] w-[18px]"
        />
        <span className="gap-2 self-stretch px-1 my-auto">কপি লিংক</span>
      </button>

      <button className="flex overflow-hidden gap-2 justify-center items-center px-2.5 w-10 h-10 bg-white rounded-lg border border-solid shadow-sm border-[#D0D5DD]">
        <img
          loading="lazy"
          src="/images/blog/x.svg"
          className="object-contain self-stretch my-auto w-5 aspect-square"
          alt="Social media icon 1"
        />
      </button>

      <button className="flex overflow-hidden gap-2 justify-center items-center px-2.5 w-10 h-10 bg-white rounded-lg border border-solid shadow-sm border-[#D0D5DD]">
        <img
          loading="lazy"
          src="/images/blog/linkedin.svg"
          className="object-contain self-stretch my-auto w-5 aspect-square"
          alt="Social media icon 2"
        />
      </button>
      <button className="flex overflow-hidden gap-2 justify-center items-center px-2.5 w-10 h-10 bg-white rounded-lg border border-solid shadow-sm border-[#D0D5DD]">
        <img
          loading="lazy"
          src="/images/blog/fb.svg"
          className="object-contain self-stretch my-auto w-5 aspect-square"
          alt="Social media icon 2"
        />
      </button>

      
    </div>
  );
}
