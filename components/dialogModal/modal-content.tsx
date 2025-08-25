// @ts-nocheck

import { cn } from "@/lib/utils";
import { DialogContent, DialogHeader, DialogTitle } from "../ui/dialog";

const ModalContent = ({ title, description, children, className }) => {
  return (
    <form>
      <DialogContent
        className={cn("p-6 bg-white rounded-lg shadow-lg max-w-md", className)}
      >
        {title && (
          <DialogHeader>
            <DialogTitle className="text-lg font-semibold text-center">
              {title}
            </DialogTitle>
          </DialogHeader>
        )}
        {description && (
          <DialogDescription className="text-center mb-2">
            {description}
          </DialogDescription>
        )}
        {children}
      </DialogContent>
    </form>
  );
};

export default ModalContent;
