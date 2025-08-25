import { Button } from "@/components/ui/button";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";

export function HoverTotip({ hoverNode, tooltipText }: any) {
  return (
    <TooltipProvider>
      <Tooltip>
        <TooltipTrigger className="ml-1">{hoverNode}</TooltipTrigger>
        <TooltipContent>
          <p>{tooltipText}</p>
        </TooltipContent>
      </Tooltip>
    </TooltipProvider>
  );
}
