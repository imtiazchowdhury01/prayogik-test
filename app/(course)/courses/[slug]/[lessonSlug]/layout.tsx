export default function CourseLessonLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="w-full min-h-screen bg-white">
      {children}
    </div>
  );
}

