import React from "react";

export default function NewHero1() {
  return (
    <div className="grid pt-5xl sm:pt-6xl lg:pt-7xl pb-5xl sm:pb-6xl lg:pb-7xl gap-4xl md:gap-5xl">
      <div className="w-full min-w-0 mx-auto px-3xl md:px-4xl max-w-7xl">
        <div className="relative flex items-center justify-center p-12 overflow-hidden text-center bg-blue-900 rounded-2xl sm:p-28">
          <svg
            className="absolute text-white opacity-10"
            xmlns="http://www.w3.org/2000/svg"
            width="1416"
            height="460"
            fill="none"
          >
            <path
              fill="currentColor"
              fillRule="evenodd"
              d="M386 341H210v10h-22v-10H0v-2h188v-10h10V0h2v329h10v10h176v-10h10V0h2v329h10v10h80v-10h10v-74h-10v-22h22v11h154v-11h10V87h-10V65h10V0h2v65h10v9h162v-9h22v22h-9v218h10v11h100v-10h10V149h-10v-22h22v9h195v-10h10V0h2v126h10v10h206v2h-206v10h-10v158h10v10h206v2h-206v10h-10v132h-2V328h-10v-10H993v10h-10v132h-2V328h-10v-10H871v9h-22v-22h10V87h-11V76H686v11h-10v146h10v22h-10v205h-2V255h-10v-9H510v9h-10v74h10v22h-10v109h-2V351h-10v-10h-80v10h-22v-10Zm802-203v10h10v158h-10v10H993v-10h-10V149h10v-11h195Z"
            />
          </svg>
          <div className="relative grid max-w-3xl gap-16 mx-auto text-white">
            <div>
              <h2 className="text-3xl font-bold font-heading text-balance md:text-4xl text-on-primary">
                Get started for free, or request a demo to discuss larger
                projects
              </h2>
            </div>
            <div className="flex flex-col justify-center gap-4 sm:flex-row">
              <a
                className="relative inline-flex items-center justify-center gap-2 px-8 py-2 overflow-hidden text-lg font-medium border rounded outline-none cursor-pointer select-none h-fit min-h-13 text-light border-light"
                role="button"
                href="/contact"
              >
                Contact sales
              </a>
              <a
                className="relative inline-flex items-center justify-center gap-2 px-8 py-2 overflow-hidden text-lg font-medium rounded outline-none cursor-pointer select-none h-fit min-h-13 bg-light text-on-light"
                role="button"
                href="https://app.hygraph.com/signup"
              >
                Get started
              </a>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
