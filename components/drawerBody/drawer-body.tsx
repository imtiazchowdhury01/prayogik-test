// @ts-nocheck
import {
  DrawerClose,
  DrawerContent,
  DrawerDescription,
  DrawerFooter,
  DrawerHeader,
  DrawerTitle,
} from "@/components/ui/drawer";
import { Button } from "../ui/button";
import { cn } from "@/lib/utils";

export default function DrawerBody({
  title,
  description,
  className,
  children,
}) {
  return (
    <>
      <DrawerContent
        className={cn(
          "right-0 left-auto w-[650px] h-full drawer-content-right rounded-none",
          className
        )}
      >
        <DrawerHeader>
          <DrawerTitle>{title}</DrawerTitle>
          {description && <DrawerDescription>{description}</DrawerDescription>}
        </DrawerHeader>
        <div className="p-4">{children}</div>
        <DrawerFooter>
          <DrawerClose>
            <div className="border rounded-md w-full p-2">Close</div>
          </DrawerClose>
        </DrawerFooter>
      </DrawerContent>
    </>
  );
}
