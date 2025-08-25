import { db } from "@/lib/db";
import {
  ArrowDown,
  ArrowRight,
  ArrowUp,
  CheckCircle,
  Circle,
  CircleOff,
  HelpCircle,
  Timer,
} from "lucide-react";

export const labels = [
  {
    value: "bug",
    label: "Bug",
  },
  {
    value: "feature",
    label: "Feature",
  },
  {
    value: "documentation",
    label: "Documentation",
  },
];

export const statuses = [
  {
    value: "NONE",
    label: "None",
    icon: HelpCircle,
  },
  {
    value: "PENDING",
    label: "pending",
    icon: HelpCircle,
  },
  {
    value: "VERIFIED",
    label: "Verified",
    icon: HelpCircle,
  },
  {
    value: "REJECTED",
    label: "Rejected",
    icon: HelpCircle,
  },
];

export const priorities = [
  {
    label: "Three Star",
    value: "THREE_STAR",
    icon: ArrowDown,
  },
  {
    label: "five star",
    value: "FIVE_STAR",
    icon: ArrowRight,
  },
  {
    label: "seven star",
    value: "SEVEN_STAR",
    icon: ArrowUp,
  },
];
