"use client";

import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import { Button } from "@/components/ui/button";
import { Users } from "lucide-react";
import { formatDateForDisplay } from "@/lib/utils/formatDateForDisplay";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

interface AttendeesSheetProps {
  event: any;
  eventLeads: any[];
}

const AttendeesSheet = ({ event, eventLeads }: AttendeesSheetProps) => {
  const eventAttendees =
    eventLeads?.filter((lead) => lead.event.slug === event.slug) || [];

  return (
    <Sheet>
      <SheetTrigger asChild>
        <Button
          variant="ghost"
          size="sm"
          className="h-8 px-2 hover:bg-transparent"
        >
          <Users className="h-4 w-4 mr-1" />
          <span className="text-xs">{eventAttendees.length}</span>
        </Button>
      </SheetTrigger>
      <SheetContent
        side="right"
        className="w-full sm:w-[90vw] md:w-[80vw] lg:w-[70vw] xl:w-[60vw] max-w-none"
        style={{
          width: "min(90vw, 800px)",
          maxWidth: "none",
        }}
      >
        <SheetHeader>
          <SheetTitle>Event Attendees</SheetTitle>
          <SheetDescription>
            {event.title} - {eventAttendees.length} registered attendees
          </SheetDescription>
        </SheetHeader>
        <div className="mt-6 max-h-[calc(100vh-200px)] overflow-y-auto">
          {eventAttendees.length === 0 ? (
            <p className="text-sm text-muted-foreground">
              No attendees registered yet.
            </p>
          ) : (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead className="w-[50px]">#</TableHead>
                  <TableHead>Name</TableHead>
                  <TableHead>Contact</TableHead>
                  <TableHead className="text-right">Registered</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {eventAttendees.map((attendee, index) => (
                  <TableRow key={attendee.id || index}>
                    <TableCell className="font-medium">{index + 1}</TableCell>
                    <TableCell>
                      <div className="space-y-1">
                        <p className="text-sm font-medium">
                          {attendee.user?.name || "Anonymous"}
                        </p>
                      </div>
                    </TableCell>
                    <TableCell>
                      <div className="space-y-1">
                        {attendee.user?.email && (
                          <p className="text-xs text-muted-foreground">
                            {attendee.user.email}
                          </p>
                        )}
                        {attendee.user?.phoneNumber && (
                          <p className="text-xs text-muted-foreground">
                            {attendee.user.phoneNumber}
                          </p>
                        )}
                      </div>
                    </TableCell>
                    <TableCell className="text-right">
                      {attendee.registeredAt && (
                        <p className="text-xs text-muted-foreground">
                          {formatDateForDisplay(attendee.registeredAt)}
                        </p>
                      )}
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          )}
        </div>
      </SheetContent>
    </Sheet>
  );
};

export default AttendeesSheet;
