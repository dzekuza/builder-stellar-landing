import { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { toast } from "@/hooks/use-toast";
import { Layout } from "@/components/Layout";
import { useAuth } from "@/contexts/AuthContext";
import { Loading } from "@/components/Loading";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Calendar,
  Clock,
  MapPin,
  Users,
  DollarSign,
  Plus,
  QrCode,
  Edit,
  Trash2,
  MoreHorizontal,
  Music,
  Coffee,
  UserCheck,
  Eye,
  Play,
  Pause,
  List,
  CalendarDays,
} from "lucide-react";
import { EventsCalendar } from "@/components/EventsCalendar";

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

export default function Events() {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [filter, setFilter] = useState("all");
  const [timeFilter, setTimeFilter] = useState("all");
  const [events, setEvents] = useState<Event[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [viewMode, setViewMode] = useState("list");

  useEffect(() => {
    const fetchEvents = async () => {
      try {
        const token = localStorage.getItem("eventflow_token");
        if (!token) {
          throw new Error("No authentication token found");
        }

        const response = await fetch("/api/events", {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }

        const data = await response.json();
        setEvents(data.events || []);
      } catch (err) {
        console.error("Failed to fetch events:", err);
        setError(err instanceof Error ? err.message : "Failed to load events");
      } finally {
        setLoading(false);
      }
    };

    if (user) {
      fetchEvents();
    }
  }, [user]);

  if (loading) {
    return (
      <Layout>
        <Loading />
      </Layout>
    );
  }

  if (error) {
    return (
      <Layout>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="text-center">
            <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">
              Error Loading Events
            </h2>
            <p className="text-gray-600 dark:text-gray-400 mb-4">{error}</p>
            <Button onClick={() => window.location.reload()}>Try Again</Button>
          </div>
        </div>
      </Layout>
    );
  }

  const filteredEvents = events.filter((event) => {
    if (filter !== "all" && event.status.toLowerCase() !== filter.toLowerCase())
      return false;
    if (timeFilter !== "all") {
      const eventDate = new Date(event.date);
      const now = new Date();
      const weekFromNow = new Date();
      weekFromNow.setDate(now.getDate() + 7);
      const monthFromNow = new Date();
      monthFromNow.setMonth(now.getMonth() + 1);

      switch (timeFilter) {
        case "today":
          return eventDate.toDateString() === now.toDateString();
        case "week":
          return eventDate >= now && eventDate <= weekFromNow;
        case "month":
          return eventDate >= now && eventDate <= monthFromNow;
        default:
          break;
      }
    }
    return true;
  });

  const upcomingEvents = events.filter((e) => e.status === "UPCOMING").length;
  const liveEvents = events.filter((e) => e.status === "LIVE").length;
  const completedEvents = events.filter((e) => e.status === "COMPLETED").length;
  const totalEarnings = events.reduce(
    (acc, event) => acc + event.totalEarnings,
    0,
  );

  const handleViewLive = (eventId: string) => {
    navigate(`/events/${eventId}/live`);
  };

  const handleGenerateQR = (eventId: string) => {
    navigate(`/qr-generator?event=${eventId}`);
  };

  const handleEditEvent = (eventId: string) => {
    navigate(`/events/${eventId}/edit`);
  };

  const handleDeleteEvent = async (eventId: string) => {
    const eventToDelete = events.find((e) => e.id === eventId);
    if (
      window.confirm(
        `Are you sure you want to delete "${eventToDelete?.name}"? This action cannot be undone.`,
      )
    ) {
      try {
        const token = localStorage.getItem("eventflow_token");
        const response = await fetch(`/api/events/${eventId}`, {
          method: "DELETE",
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        if (response.ok) {
          setEvents(events.filter((event) => event.id !== eventId));
          toast({
            title: "Event Deleted",
            description: `"${eventToDelete?.name}" has been successfully deleted.`,
          });
        } else {
          throw new Error("Failed to delete event");
        }
      } catch (err) {
        console.error("Error deleting event:", err);
        toast({
          title: "Error",
          description: "Failed to delete event. Please try again.",
          variant: "destructive",
        });
      }
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

  const getTypeIcon = (role: string) => {
    switch (role.toLowerCase()) {
      case "dj":
        return Music;
      case "barista":
        return Coffee;
      case "host":
        return UserCheck;
      case "company":
        return Users;
      default:
        return Music;
    }
  };

  const getTypeColor = (role: string) => {
    switch (role.toLowerCase()) {
      case "dj":
        return "bg-brand-purple/10 text-brand-purple dark:bg-brand-purple/20";
      case "barista":
        return "bg-brand-blue/10 text-brand-blue dark:bg-brand-blue/20";
      case "host":
        return "bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400";
      case "company":
        return "bg-gradient-to-r from-brand-purple to-brand-blue text-white";
      default:
        return "bg-gray-100 text-gray-800 dark:bg-gray-800 dark:text-gray-200";
    }
  };

  return (
    <Layout>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
              Events
            </h1>
            <p className="text-gray-600 dark:text-gray-400 mt-1">
              Manage and track all your events
            </p>
          </div>
          <div className="flex items-center gap-4">
            <div className="flex bg-gray-100 dark:bg-gray-800 rounded-lg p-1">
              <Button
                variant={viewMode === "list" ? "default" : "ghost"}
                size="sm"
                onClick={() => setViewMode("list")}
                className={
                  viewMode === "list"
                    ? "bg-white dark:bg-gray-700 shadow-sm"
                    : ""
                }
              >
                <List className="w-4 h-4 mr-2" />
                List
              </Button>
              <Button
                variant={viewMode === "calendar" ? "default" : "ghost"}
                size="sm"
                onClick={() => setViewMode("calendar")}
                className={
                  viewMode === "calendar"
                    ? "bg-white dark:bg-gray-700 shadow-sm"
                    : ""
                }
              >
                <CalendarDays className="w-4 h-4 mr-2" />
                Calendar
              </Button>
            </div>
            <Link to="/create-event">
              <Button className="bg-gradient-to-r from-brand-purple to-brand-blue">
                <Plus className="w-4 h-4 mr-2" />
                Create Event
              </Button>
            </Link>
          </div>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600 dark:text-gray-400">
                    Total Events
                  </p>
                  <p className="text-2xl font-bold text-gray-900 dark:text-white">
                    {events.length}
                  </p>
                </div>
                <Calendar className="h-8 w-8 text-brand-purple" />
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600 dark:text-gray-400">
                    Upcoming
                  </p>
                  <p className="text-2xl font-bold text-gray-900 dark:text-white">
                    {upcomingEvents}
                  </p>
                </div>
                <Clock className="h-8 w-8 text-brand-blue" />
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600 dark:text-gray-400">
                    Live Events
                  </p>
                  <p className="text-2xl font-bold text-gray-900 dark:text-white">
                    {liveEvents}
                  </p>
                </div>
                <Play className="h-8 w-8 text-green-600" />
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600 dark:text-gray-400">
                    Total Earnings
                  </p>
                  <p className="text-2xl font-bold text-gray-900 dark:text-white">
                    ${totalEarnings.toFixed(2)}
                  </p>
                </div>
                <DollarSign className="h-8 w-8 text-green-600" />
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Conditional Content Based on View Mode */}
        {viewMode === "calendar" ? (
          <EventsCalendar
            events={events}
            onViewLive={handleViewLive}
            onEditEvent={handleEditEvent}
            onGenerateQR={handleGenerateQR}
          />
        ) : (
          <>
            {/* Filters */}
            <div className="flex items-center space-x-4 mb-6">
              <Select value={filter} onValueChange={setFilter}>
                <SelectTrigger className="w-[180px]">
                  <SelectValue placeholder="Filter by status" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Events</SelectItem>
                  <SelectItem value="live">Live</SelectItem>
                  <SelectItem value="upcoming">Upcoming</SelectItem>
                  <SelectItem value="completed">Completed</SelectItem>
                  <SelectItem value="cancelled">Cancelled</SelectItem>
                </SelectContent>
              </Select>

              <Select value={timeFilter} onValueChange={setTimeFilter}>
                <SelectTrigger className="w-[180px]">
                  <SelectValue placeholder="Filter by time" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Time</SelectItem>
                  <SelectItem value="today">Today</SelectItem>
                  <SelectItem value="week">This Week</SelectItem>
                  <SelectItem value="month">This Month</SelectItem>
                </SelectContent>
              </Select>
            </div>

            {/* Events Grid - 2 Column Layout */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {filteredEvents.map((event) => {
                const TypeIcon = getTypeIcon(event.owner.role);
                return (
                  <Card
                    key={event.id}
                    className="hover:shadow-lg transition-all duration-300 border-0 bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm hover:-translate-y-1 group"
                  >
                    <CardContent className="p-0">
                      {/* Header Section */}
                      <div className="p-6 pb-4">
                        <div className="flex items-start justify-between mb-4">
                          <div className="flex items-center space-x-3">
                            <div
                              className={`w-12 h-12 rounded-xl flex items-center justify-center ${getTypeColor(
                                event.owner.role,
                              )} shadow-sm`}
                            >
                              <TypeIcon className="w-6 h-6" />
                            </div>
                            <div className="flex-1">
                              <div className="flex items-center space-x-2 mb-1">
                                <h3 className="text-lg font-bold text-gray-900 dark:text-white group-hover:text-brand-purple transition-colors">
                                  {event.name}
                                </h3>
                                <Badge className={getStatusColor(event.status)}>
                                  {event.status.toLowerCase()}
                                </Badge>
                              </div>
                              <p className="text-sm text-gray-600 dark:text-gray-400">
                                {event.venue}
                              </p>
                            </div>
                          </div>
                          {event.status === "LIVE" && (
                            <div className="flex items-center space-x-1 text-green-600">
                              <div className="w-2 h-2 bg-green-600 rounded-full animate-pulse"></div>
                              <span className="text-sm font-medium">Live</span>
                            </div>
                          )}
                        </div>

                        {/* Event Details */}
                        <div className="grid grid-cols-2 gap-4 mb-4">
                          <div className="flex items-center space-x-2 text-gray-600 dark:text-gray-400">
                            <Calendar className="w-4 h-4" />
                            <span className="text-sm">
                              {new Date(event.date).toLocaleDateString()}
                            </span>
                          </div>
                          <div className="flex items-center space-x-2 text-gray-600 dark:text-gray-400">
                            <Clock className="w-4 h-4" />
                            <span className="text-sm">
                              {new Date(event.startTime).toLocaleTimeString(
                                [],
                                {
                                  hour: "2-digit",
                                  minute: "2-digit",
                                },
                              )}
                            </span>
                          </div>
                          <div className="flex items-center space-x-2 text-gray-600 dark:text-gray-400">
                            <Users className="w-4 h-4" />
                            <span className="text-sm">
                              {event.attendeeCount} attendees
                            </span>
                          </div>
                          <div className="flex items-center space-x-2 text-gray-600 dark:text-gray-400">
                            <DollarSign className="w-4 h-4" />
                            <span className="text-sm">
                              ${event.totalEarnings.toFixed(2)} earned
                            </span>
                          </div>
                        </div>

                        {/* Activity Stats */}
                        <div className="flex space-x-4 text-sm">
                          <div className="flex items-center space-x-1">
                            <Music className="w-4 h-4 text-brand-purple" />
                            <span className="text-gray-600 dark:text-gray-400">
                              {event._count.songRequests} requests
                            </span>
                          </div>
                          <div className="flex items-center space-x-1">
                            <Coffee className="w-4 h-4 text-brand-blue" />
                            <span className="text-gray-600 dark:text-gray-400">
                              {event._count.drinkOrders} orders
                            </span>
                          </div>
                        </div>
                      </div>

                      {/* Action Buttons */}
                      <div className="px-6 py-4 border-t bg-gray-50/50 dark:bg-gray-800/50 flex justify-between items-center">
                        <div className="flex space-x-2">
                          {event.status === "LIVE" && (
                            <Button
                              size="sm"
                              onClick={() => handleViewLive(event.id)}
                              className="bg-green-600 hover:bg-green-700 text-white"
                            >
                              <Play className="w-4 h-4 mr-1" />
                              View Live
                            </Button>
                          )}

                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => handleEditEvent(event.id)}
                          >
                            <Edit className="w-4 h-4 mr-1" />
                            Edit
                          </Button>

                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => handleGenerateQR(event.id)}
                          >
                            <QrCode className="w-4 h-4 mr-1" />
                            QR
                          </Button>
                        </div>

                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => handleDeleteEvent(event.id)}
                          className="text-red-600 hover:text-red-700 hover:bg-red-50 dark:hover:bg-red-900/20"
                        >
                          <Trash2 className="w-4 h-4" />
                        </Button>
                      </div>
                    </CardContent>
                  </Card>
                );
              })}
            </div>

            {/* Empty State */}
            {filteredEvents.length === 0 && (
              <div className="text-center py-12">
                <Card className="max-w-md mx-auto">
                  <CardContent className="pt-6">
                    <Calendar className="mx-auto h-12 w-12 text-gray-400 mb-4" />
                    <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-2">
                      No events found
                    </h3>
                    <p className="text-gray-500 dark:text-gray-400 mb-6 max-w-md mx-auto">
                      No events match your current filters. Try adjusting your
                      filters or create a new event.
                    </p>
                    <Link to="/create-event">
                      <Button className="bg-gradient-to-r from-brand-purple to-brand-blue text-white px-6 py-3">
                        <Plus className="w-4 h-4 mr-2" />
                        Create Your First Event
                      </Button>
                    </Link>
                  </CardContent>
                </Card>
              </div>
            )}
          </>
        )}
      </div>
    </Layout>
  );
}
