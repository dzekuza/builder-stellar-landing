import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  ChevronLeft,
  ChevronRight,
  Calendar as CalendarIcon,
  MapPin,
  Clock,
  Users,
  Play,
  Edit,
  QrCode,
  DollarSign,
} from "lucide-react";

interface Event {
  id: string;
  name: string;
  description?: string;
  venue: string;
  date: string;
  startTime: string;
  endTime?: string;
  status: "UPCOMING" | "LIVE" | "COMPLETED" | "CANCELLED";
  totalEarnings: number;
  attendeeCount: number;
  isActive: boolean;
  owner: {
    id: string;
    name: string;
    email: string;
    role: string;
  };
  staff: Array<{
    id: string;
    role: string;
    user: {
      id: string;
      name: string;
      email: string;
      role: string;
    };
  }>;
  _count: {
    songRequests: number;
    drinkOrders: number;
  };
}

interface EventsCalendarProps {
  events: Event[];
  onViewLive: (eventId: string) => void;
  onEditEvent: (eventId: string) => void;
  onGenerateQR: (eventId: string) => void;
}

export function EventsCalendar({
  events,
  onViewLive,
  onEditEvent,
  onGenerateQR,
}: EventsCalendarProps) {
  const [currentDate, setCurrentDate] = useState(new Date());
  const [selectedEvent, setSelectedEvent] = useState<Event | null>(null);

  const today = new Date();
  const year = currentDate.getFullYear();
  const month = currentDate.getMonth();

  // Get first day of month and how many days in month
  const firstDayOfMonth = new Date(year, month, 1);
  const lastDayOfMonth = new Date(year, month + 1, 0);
  const firstDayWeekday = firstDayOfMonth.getDay(); // 0 = Sunday
  const daysInMonth = lastDayOfMonth.getDate();

  // Get previous month's last days to fill the grid
  const prevMonth = new Date(year, month - 1, 0);
  const daysInPrevMonth = prevMonth.getDate();

  const monthNames = [
    "January",
    "February",
    "March",
    "April",
    "May",
    "June",
    "July",
    "August",
    "September",
    "October",
    "November",
    "December",
  ];

  const dayNames = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];

  // Navigate months
  const goToPrevMonth = () => {
    setCurrentDate(new Date(year, month - 1, 1));
  };

  const goToNextMonth = () => {
    setCurrentDate(new Date(year, month + 1, 1));
  };

  const goToToday = () => {
    setCurrentDate(new Date());
  };

  // Get events for a specific date
  const getEventsForDate = (date: Date) => {
    return events.filter((event) => {
      const eventDate = new Date(event.date);
      return eventDate.toDateString() === date.toDateString();
    });
  };

  // Generate calendar grid
  const generateCalendarDays = () => {
    const days = [];

    // Previous month's days
    for (let i = firstDayWeekday - 1; i >= 0; i--) {
      const day = daysInPrevMonth - i;
      const date = new Date(year, month - 1, day);
      days.push({
        date,
        day,
        isCurrentMonth: false,
        isToday: false,
        events: getEventsForDate(date),
      });
    }

    // Current month's days
    for (let day = 1; day <= daysInMonth; day++) {
      const date = new Date(year, month, day);
      const isToday = date.toDateString() === today.toDateString();
      days.push({
        date,
        day,
        isCurrentMonth: true,
        isToday,
        events: getEventsForDate(date),
      });
    }

    // Next month's days to fill the grid (6 rows × 7 days = 42 total)
    const totalCells = 42;
    const remainingCells = totalCells - days.length;
    for (let day = 1; day <= remainingCells; day++) {
      const date = new Date(year, month + 1, day);
      days.push({
        date,
        day,
        isCurrentMonth: false,
        isToday: false,
        events: getEventsForDate(date),
      });
    }

    return days;
  };

  const calendarDays = generateCalendarDays();

  const getEventColor = (event: Event) => {
    switch (event.status) {
      case "LIVE":
        return "bg-green-500 text-white";
      case "UPCOMING":
        return "bg-brand-blue text-white";
      case "COMPLETED":
        return "bg-gray-500 text-white";
      case "CANCELLED":
        return "bg-red-500 text-white";
      default:
        return "bg-brand-purple text-white";
    }
  };

  const getStatusColor = (status: string) => {
    switch (status.toLowerCase()) {
      case "live":
        return "bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400";
      case "upcoming":
        return "bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-400";
      case "completed":
        return "bg-gray-100 text-gray-800 dark:bg-gray-800 dark:text-gray-200";
      case "cancelled":
        return "bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-400";
      default:
        return "bg-gray-100 text-gray-800 dark:bg-gray-800 dark:text-gray-200";
    }
  };

  return (
    <>
      <div className="bg-white dark:bg-gray-900 text-gray-900 dark:text-white border border-gray-200 dark:border-gray-700 rounded-lg overflow-hidden">
        {/* Header */}
        <div className="p-4 border-b border-gray-200 dark:border-gray-700">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <div className="flex items-center space-x-2">
                <Select
                  value={month.toString()}
                  onValueChange={(value) =>
                    setCurrentDate(new Date(year, parseInt(value), 1))
                  }
                >
                  <SelectTrigger className="w-[140px] bg-white dark:bg-gray-800 border-gray-300 dark:border-gray-600 text-gray-900 dark:text-white">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {monthNames.map((monthName, index) => (
                      <SelectItem key={index} value={index.toString()}>
                        {monthName}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                <Select
                  value={year.toString()}
                  onValueChange={(value) =>
                    setCurrentDate(new Date(parseInt(value), month, 1))
                  }
                >
                  <SelectTrigger className="w-[100px] bg-white dark:bg-gray-800 border-gray-300 dark:border-gray-600 text-gray-900 dark:text-white">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {Array.from({ length: 10 }, (_, i) => {
                      const yearOption = new Date().getFullYear() - 2 + i;
                      return (
                        <SelectItem
                          key={yearOption}
                          value={yearOption.toString()}
                        >
                          {yearOption}
                        </SelectItem>
                      );
                    })}
                  </SelectContent>
                </Select>
              </div>
              <Button
                variant="outline"
                size="sm"
                onClick={goToToday}
                className="bg-white dark:bg-gray-800 border-gray-300 dark:border-gray-600 text-gray-900 dark:text-white hover:bg-gray-50 dark:hover:bg-gray-700"
              >
                Today
              </Button>
            </div>
            <div className="flex items-center space-x-2">
              <Button
                variant="ghost"
                size="sm"
                onClick={goToPrevMonth}
                className="text-gray-900 dark:text-white hover:bg-gray-100 dark:hover:bg-gray-800"
              >
                <ChevronLeft className="w-4 h-4" />
              </Button>
              <Button
                variant="ghost"
                size="sm"
                onClick={goToNextMonth}
                className="text-gray-900 dark:text-white hover:bg-gray-100 dark:hover:bg-gray-800"
              >
                <ChevronRight className="w-4 h-4" />
              </Button>
            </div>
          </div>
        </div>

        {/* Day names header */}
        <div className="grid grid-cols-7 bg-gray-50 dark:bg-gray-800">
          {dayNames.map((day) => (
            <div
              key={day}
              className="p-3 text-center text-sm font-medium text-gray-600 dark:text-gray-300 border-r border-gray-200 dark:border-gray-700 last:border-r-0"
            >
              {day}
            </div>
          ))}
        </div>

        {/* Calendar grid */}
        <div className="grid grid-cols-7">
          {calendarDays.map((calendarDay, index) => (
            <div
              key={index}
              className={`min-h-[120px] p-2 border-r border-b border-gray-200 dark:border-gray-700 last:border-r-0 ${
                !calendarDay.isCurrentMonth
                  ? "bg-gray-50 dark:bg-gray-800/50 text-gray-400 dark:text-gray-500"
                  : calendarDay.isToday
                    ? "bg-gray-100 dark:bg-gray-800"
                    : "bg-white dark:bg-gray-900"
              }`}
            >
              <div className="flex justify-between items-start mb-2">
                <span
                  className={`text-sm font-medium ${
                    calendarDay.isToday
                      ? "text-gray-900 dark:text-white"
                      : calendarDay.isCurrentMonth
                        ? "text-gray-900 dark:text-gray-300"
                        : "text-gray-400 dark:text-gray-500"
                  }`}
                >
                  {calendarDay.day}
                </span>
                {calendarDay.isToday && (
                  <div className="w-2 h-2 bg-brand-purple rounded-full"></div>
                )}
              </div>

              {/* Events */}
              <div className="space-y-1">
                {calendarDay.events.slice(0, 3).map((event) => (
                  <button
                    key={event.id}
                    onClick={() => setSelectedEvent(event)}
                    className={`w-full text-left px-2 py-1 rounded text-xs font-medium truncate hover:opacity-80 transition-opacity ${getEventColor(event)}`}
                  >
                    {event.name}
                  </button>
                ))}
                {calendarDay.events.length > 3 && (
                  <button
                    className="w-full text-left px-2 py-1 text-xs text-gray-400 hover:text-white"
                    onClick={() => {
                      // Could open a day view modal with all events
                      console.log("Show more events for", calendarDay.date);
                    }}
                  >
                    +{calendarDay.events.length - 3} more
                  </button>
                )}
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Event Preview Modal */}
      <Dialog
        open={!!selectedEvent}
        onOpenChange={() => setSelectedEvent(null)}
      >
        <DialogContent className="max-w-2xl">
          {selectedEvent && (
            <>
              <DialogHeader>
                <DialogTitle className="flex items-center gap-3">
                  <CalendarIcon className="w-5 h-5" />
                  {selectedEvent.name}
                </DialogTitle>
                <DialogDescription>
                  Event details and quick actions
                </DialogDescription>
              </DialogHeader>

              <div className="space-y-6">
                {/* Status Badge */}
                <div className="flex justify-between items-start">
                  <Badge className={getStatusColor(selectedEvent.status)}>
                    {selectedEvent.status}
                  </Badge>
                  {selectedEvent.status === "LIVE" && (
                    <div className="flex items-center gap-1 text-green-600">
                      <div className="w-2 h-2 bg-green-600 rounded-full animate-pulse"></div>
                      <span className="text-sm font-medium">Live Now</span>
                    </div>
                  )}
                </div>

                {/* Event Details */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-3">
                    <div className="flex items-center gap-2 text-gray-600 dark:text-gray-400">
                      <MapPin className="w-4 h-4" />
                      <span>{selectedEvent.venue}</span>
                    </div>
                    <div className="flex items-center gap-2 text-gray-600 dark:text-gray-400">
                      <Clock className="w-4 h-4" />
                      <span>
                        {new Date(selectedEvent.date).toLocaleDateString()} at{" "}
                        {new Date(selectedEvent.startTime).toLocaleTimeString(
                          [],
                          {
                            hour: "2-digit",
                            minute: "2-digit",
                          },
                        )}
                      </span>
                    </div>
                    <div className="flex items-center gap-2 text-gray-600 dark:text-gray-400">
                      <Users className="w-4 h-4" />
                      <span>{selectedEvent.attendeeCount} attendees</span>
                    </div>
                  </div>
                  <div className="space-y-3">
                    <div className="flex items-center gap-2 text-gray-600 dark:text-gray-400">
                      <DollarSign className="w-4 h-4" />
                      <span>
                        ${selectedEvent.totalEarnings.toFixed(2)} earnings
                      </span>
                    </div>
                    <div className="text-gray-600 dark:text-gray-400">
                      <div className="text-sm">
                        {selectedEvent._count.songRequests} song requests
                      </div>
                      <div className="text-sm">
                        {selectedEvent._count.drinkOrders} drink orders
                      </div>
                    </div>
                  </div>
                </div>

                {selectedEvent.description && (
                  <div>
                    <h4 className="font-medium mb-2">Description</h4>
                    <p className="text-gray-600 dark:text-gray-400">
                      {selectedEvent.description}
                    </p>
                  </div>
                )}

                {/* Quick Actions */}
                <div className="flex flex-wrap gap-3 pt-4 border-t">
                  {selectedEvent.status === "LIVE" && (
                    <Button
                      onClick={() => {
                        onViewLive(selectedEvent.id);
                        setSelectedEvent(null);
                      }}
                      className="bg-green-600 hover:bg-green-700"
                    >
                      <Play className="w-4 h-4 mr-2" />
                      View Live
                    </Button>
                  )}

                  <Button
                    variant="outline"
                    onClick={() => {
                      onEditEvent(selectedEvent.id);
                      setSelectedEvent(null);
                    }}
                  >
                    <Edit className="w-4 h-4 mr-2" />
                    Edit Event
                  </Button>

                  <Button
                    variant="outline"
                    onClick={() => {
                      onGenerateQR(selectedEvent.id);
                      setSelectedEvent(null);
                    }}
                  >
                    <QrCode className="w-4 h-4 mr-2" />
                    QR Code
                  </Button>
                </div>
              </div>
            </>
          )}
        </DialogContent>
      </Dialog>
    </>
  );
}
