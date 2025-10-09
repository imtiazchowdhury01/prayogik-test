import PrayogikIntro from "./signin/_components/prayogik-intro";

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="bg-signinLayoutBg min-h-screen">
      <div className="w-full px-0 mx-auto max-w-full xl:max-w-7xl flex items-center justify-center min-h-screen xl:px-10 2xl:px-0 ">
        <div
          id="flex-container"
          className="flex flex-row w-full sm:max-w-lg lg:max-w-full"
        >
          {/* left side  */}
          <PrayogikIntro />
          {/* signin, reset and forgot password sections  */}
          <div
            id="right-section"
            className="bg-signinBg min-h-screen sm:min-h-full rounded-none sm:rounded-lg lg:rounded-none xl:rounded-r-lg w-full xl:w-1/2 p-6 sm:p-10 xl:p-20 flex justify-center items-center"
          >
            {children}
          </div>
        </div>
      </div>
    </div>
  );
}
