//@ts-nocheck
import { LockClosedIcon, VideoIcon } from "@radix-ui/react-icons";
import { Link } from "lucide-react";

const LessonsList = async ({ course, hasCourseAccess }) => {
  if (!course || !course.chapters) {
    return null;
  }

  return (
    <ul>
      {course.chapters.map((chapter) => (
        <li key={chapter.id}>
          {hasCourseAccess ? (
            <Link href={`/courses/${course.slug}/${chapter.slug}`}>
              {chapter.title}
            </Link>
          ) : chapter.preview ? (
            <div className="flex justify-between items-center">
              <span>{chapter.title}</span>
              <VideoIcon className="text-gray-500" />
            </div>
          ) : (
            <div className="flex justify-between items-center">
              <span>{chapter.title}</span>
              <LockClosedIcon className="text-gray-500" />
            </div>
          )}
        </li>
      ))}
    </ul>
  );
};

export default LessonsList;
