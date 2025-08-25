import { Badge } from "@/components/ui/badge";
import { CourseRoadmapStatus, DifficultyLevel } from "@prisma/client";

export function getStatusBadge(status: string) {
  switch (status) {
    case CourseRoadmapStatus.PLANNED:
      return <Badge className="bg-slate-500 hover:bg-slate-600">Planned</Badge>;
    case CourseRoadmapStatus.IN_PROGRESS:
      return (
        <Badge className="bg-amber-500 hover:bg-amber-600">In Progress</Badge>
      );
    case CourseRoadmapStatus.COMPLETED:
      return (
        <Badge className="bg-green-500 hover:bg-green-600">Completed</Badge>
      );
    default:
      return <Badge>{status}</Badge>;
  }
}

export function getDifficultyBadge(difficulty: string) {
  switch (difficulty) {
    case DifficultyLevel.BEGINNER:
      return (
        <Badge
          variant="default"
          className="bg-gray-500 text-white text-sm font-light px-2.5 py-0 hover:bg-gray-500"
        >
          বিগিনার
        </Badge>
      );
    case DifficultyLevel.INTERMEDIATE:
      return (
        <Badge
          variant="default"
          className="bg-[#F59E0B] text-white text-sm font-light px-2.5 py-0 hover:bg-[#F59E0B]"
        >
          ইন্টারমিডিয়েট
        </Badge>
      );
    case DifficultyLevel.ADVANCED:
      return (
        <Badge
          variant="default"
          className="bg-red-500 text-white text-sm font-light px-2.5 py-0 hover:bg-red-500"
        >
          অ্যাডভান্স
        </Badge>
      );
    default:
      return <Badge variant="outline">{difficulty}</Badge>;
  }
}
