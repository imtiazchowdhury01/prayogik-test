import PrayogikIntro from "./signin/_components/prayogik-intro";

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="bg-[#ebeef5] min-h-screen ">
      <div className="flex items-center justify-center min-h-screen app-container">
        <div className="flex md:flex-row flex-col">
          <section className="md:w-1/2 w-full hidden md:block">
            <PrayogikIntro />
          </section>
          {children}
        </div>
      </div>
    </div>
  );
}
