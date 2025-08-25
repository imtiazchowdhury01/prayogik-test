import {
  ArrowDown,
  ArrowRight,
  ArrowUp,
  CheckCircle,
  Circle,
  CircleOff,
  HelpCircle,
  Timer,
} from "lucide-react"

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
]

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


export const fetchRanks = async () => {
  try {
    const response = await fetch("/api/teacher/ranks");
    if (!response.ok) {
      throw new Error("Failed to fetch ranks");
    }
    const data = await response.json();
    return data; // Assuming the API returns an array of ranks
  } catch (error) {
    console.error("Error fetching ranks:", error);
    return []; // Return an empty array if there's an error
  }
};


