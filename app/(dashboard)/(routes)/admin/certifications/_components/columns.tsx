// app/certifications/columns.tsx
"use client";

import { ColumnDef } from "@tanstack/react-table";
import { Badge } from "@/components/ui/badge";
import { Checkbox } from "@/components/ui/checkbox";
import { DifficultyLevel } from "@prisma/client";
import { DataTableColumnHeader } from "./data-table-column-header";
import { DataTableRowActions } from "./data-table-row-action";
import Link from "next/link";

export type Certification = {
  id: string;
  title: string;
  slug: string;
  excerpt?: string;
  imageUrl?: string;
  level: DifficultyLevel;
  skills: { id: string; name: string }[];
  courses: { id: string; title: string }[];
  teacherProfile: { id: string; name: string };
  coTeachers: { id: string; name: string }[];
  isPublished: boolean;
  createdAt: Date;
  updatedAt: Date;
  _count?: {
    enrolledStudents: number;
    purchases: number;
  };
};

export const columns: ColumnDef<Certification>[] = [
  {
    accessorKey: "title",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Title" />
    ),
    cell: ({ row }) => {
      return (
        <div className="flex space-x-2">
          <Link
            href={`/admin/certifications/${row?.original?.id}`}
            className="max-w-[500px] truncate font-medium hover:text-brand"
          >
            {row.getValue("title")}
          </Link>
        </div>
      );
    },
  },
  {
    accessorKey: "level",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Level" />
    ),
    cell: ({ row }) => {
      const level = row.getValue("level") as DifficultyLevel;

      const badgeColor =
        level === "BEGINNER"
          ? "bg-gray-200 text-black"
          : level === "INTERMEDIATE"
          ? "bg-secondary-button"
          : "bg-brand";
      return <Badge className={`${badgeColor} font-normal`}>{level}</Badge>;
    },
    filterFn: (row, id, value) => {
      return value.includes(row.getValue(id));
    },
  },
  {
    accessorKey: "skills",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Skills" />
    ),
    cell: ({ row }) => {
      const skills = row.getValue("skills") as { id: string; name: string }[];
      return (
        <div className="flex flex-wrap gap-1">
  {skills.slice(0, 2).map((skill) => (
    <Badge
      key={skill.id}
      variant="outline"
      className="text-xs max-w-[100px] sm:max-w-[150px] truncate"
    >
      <span className="truncate line-clamp-1">{skill.name}</span>
    </Badge>
  ))}
  {skills.length > 2 && (
    <Badge variant="outline" className="text-xs">
      +{skills.length - 2}
    </Badge>
  )}
</div>
      );
    },
    filterFn: (row, id, value) => {
      const skills = row.getValue(id) as { id: string; name: string }[];
      return skills.some((skill) => value.includes(skill.name));
    },
  },
  {
    accessorKey: "courses",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Courses" />
    ),
    cell: ({ row }) => {
      const courses = row.getValue("courses") as {
        id: string;
        title: string;
      }[];
      return <span>{courses.length} courses</span>;
    },
  },
  {
    accessorKey: "enrolledStudents",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Students" />
    ),
    cell: ({ row }) => {
      const count = row.original._count?.enrolledStudents || 0;
      return <span>{count}</span>;
    },
  },
  {
    accessorKey: "isPublished",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Status" />
    ),
    cell: ({ row }) => {
      const isPublished = row.getValue("isPublished") as boolean;
      return (
        <Badge variant={isPublished ? "default" : "secondary"}>
          {isPublished ? "Published" : "Draft"}
        </Badge>
      );
    },
    filterFn: (row, id, value) => {
      return value.includes(row.getValue(id));
    },
  },
  {
    id: "actions",
    cell: ({ row }) => <DataTableRowActions row={row} />,
  },
];
