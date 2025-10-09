"use client";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import EventCard from "@/components/EventCard";
import { clientApi } from "@/lib/utils/openai/client";
import { Event } from "@prisma/client";
import { Loader } from "lucide-react";

interface LoadMoreEventsProps {
  totalEvents: number;
}

const LoadMoreEvents: React.FC<LoadMoreEventsProps> = ({ totalEvents }) => {
  const [currentPage, setCurrentPage] = useState(1);
  const [events, setEvents] = useState<Event[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [hasMore, setHasMore] = useState(totalEvents > 8);

  const loadMoreEvents = async () => {
    if (isLoading || !hasMore) return;
    setIsLoading(true);

    try {
      const nextPage = currentPage + 1;
      const response = await clientApi.getEventsQuery({
        query: {
          page: nextPage,
          limit: 8,
          status: "UPCOMING",
        },
      });

      if (response.status === 200 && response.body?.events) {
        const { events: newEvents, pagination } = response.body;

        if (newEvents.length === 0) {
          setHasMore(false);
          return;
        }

        setEvents((prevEvents) => [...prevEvents, ...newEvents]);
        setCurrentPage(nextPage);
        setHasMore(pagination.hasNextPage);
      } else {
        setHasMore(false);
      }
    } catch (error) {
      console.error("Error loading more events:", error);
      setHasMore(false);
    } finally {
      setIsLoading(false);
    }
  };

  // Don't show button if there are 8 or fewer events
  if (totalEvents <= 8) return null;

  return (
    <>
      {/* Additional events grid */}
      {events.length > 0 && (
        <div className="grid grid-cols-1 gap-6 md:gap-y-[50px] gap-y-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 mt-6 md:mt-[50px]">
          {events.map((event) => (
            <EventCard event={event} key={event.id} />
          ))}
        </div>
      )}

      {/* Load more button */}
      {hasMore && (
        <div className="flex items-center justify-center mt-12">
          <Button
            onClick={loadMoreEvents}
            disabled={isLoading}
            variant="outline"
            className="text-gray-700 border-gray-300 transition-all duration-300 py-4 h-12 md:flex bg-transparent"
            data-testid="load-more-button"
          >
            {isLoading ? (
              <>
                <Loader className="w-5 h-5 animate-spin" />
              </>
            ) : (
              "আরো দেখুন"
            )}
          </Button>
        </div>
      )}
    </>
  );
};

export default LoadMoreEvents;