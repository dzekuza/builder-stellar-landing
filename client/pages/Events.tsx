import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { toast } from "@/hooks/use-toast";
import { Layout } from "@/components/Layout";
import { useAuth } from "@/contexts/AuthContext";
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
} from "lucide-react";

interface Event {
  id: string;
  name: string;
  description: string;
  venue: string;
  date: string;
  time: string;
  status: "upcoming" | "live" | "completed" | "cancelled";
  type: "dj" | "barista" | "host" | "company";
  earnings: number;
  attendees: number;
  requests?: number;
  orders?: number;
  assignedStaff?: {
    dj?: string;
    barista?: string;
    host?: string;
  };
}

export default function Events() {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [filter, setFilter] = useState("all");
  const [timeFilter, setTimeFilter] = useState("all");

  // Mock events data
  const [events, setEvents] = useState<Event[]>([
    {
      id: "1",
      name: "Saturday Night Vibes",
      description: "High-energy DJ set for the weekend crowd",
      venue: "Blue Moon Bar",
      date: "2023-12-16",
      time: "21:00",
      status: "live",
      type: "dj",
      earnings: 450,
      attendees: 120,
      requests: 25,
    },
    {
      id: "2",
      name: "Wedding Reception",
      description: "Elegant wedding celebration",
      venue: "Grand Hotel Ballroom",
      date: "2023-12-18",
      time: "18:00",
      status: "upcoming",
      type: "dj",
      earnings: 0,
      attendees: 150,
      requests: 0,
    },
    {
      id: "3",
      name: "Corporate Coffee Service",
      description: "Morning coffee service for business meeting",
      venue: "Tech Hub Conference Center",
      date: "2023-12-14",
      time: "08:00",
      status: "completed",
      type: "barista",
      earnings: 280,
      attendees: 50,
      orders: 32,
    },
    {
      id: "4",
      name: "Holiday Party",
      description: "Company holiday celebration",
      venue: "Downtown Event Space",
      date: "2023-12-20",
      time: "19:00",
      status: "upcoming",
      type: "company",
      earnings: 0,
      attendees: 200,
      assignedStaff: {
        dj: "DJ Alex",
        barista: "Sarah Coffee",
        host: "Mike Host",
      },
    },
  ]);

  const getStatusColor = (status: string) => {
    switch (status) {
      case "live":
        return "bg-green-100 text-green-800";
      case "upcoming":
        return "bg-blue-100 text-blue-800";
      case "completed":
        return "bg-gray-100 text-gray-800";
      case "cancelled":
        return "bg-red-100 text-red-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  const getTypeIcon = (type: string) => {
    switch (type) {
      case "dj":
        return Music;
      case "barista":
        return Coffee;
      case "host":
        return UserCheck;
      case "company":
        return Users;
      default:
        return Calendar;
    }
  };

  const getTypeColor = (type: string) => {
    switch (type) {
      case "dj":
        return "bg-brand-purple/10 text-brand-purple";
      case "barista":
        return "bg-brand-blue/10 text-brand-blue";
      case "host":
        return "bg-green-100 text-green-800";
      case "company":
        return "bg-gradient-to-r from-brand-purple to-brand-blue text-white";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  const filteredEvents = events.filter((event) => {
    if (filter !== "all" && event.status !== filter) return false;
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

  const upcomingEvents = events.filter((e) => e.status === "upcoming").length;
  const liveEvents = events.filter((e) => e.status === "live").length;
  const completedEvents = events.filter((e) => e.status === "completed").length;
  const totalEarnings = events.reduce((acc, event) => acc + event.earnings, 0);

  const handleViewLive = (eventId: string) => {
    // Navigate to live event view
    navigate(`/events/${eventId}/live`);
  };

  const handleGenerateQR = (eventId: string) => {
    // Navigate to QR generator with pre-selected event
    navigate(`/qr-generator?event=${eventId}`);
  };

  const handleEditEvent = (eventId: string) => {
    // Navigate to edit event page
    navigate(`/events/${eventId}/edit`);
  };

  const handleDeleteEvent = (eventId: string) => {
    // Show confirmation and delete event
    const eventToDelete = events.find((e) => e.id === eventId);
    if (
      window.confirm(
        `Are you sure you want to delete "${eventToDelete?.name}"? This action cannot be undone.`,
      )
    ) {
      setEvents(events.filter((event) => event.id !== eventId));
      toast({
        title: "Event Deleted",
        description: `"${eventToDelete?.name}" has been successfully deleted.`,
      });
    }
  };

  return (
    <Layout>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Events</h1>
            <p className="text-gray-600 mt-1">
              Manage and track all your events
            </p>
          </div>
          <Link to="/create-event">
            <Button className="bg-gradient-to-r from-brand-purple to-brand-blue">
              <Plus className="w-4 h-4 mr-2" />
              Create Event
            </Button>
          </Link>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">
                    Total Events
                  </p>
                  <p className="text-2xl font-bold text-gray-900">
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
                  <p className="text-sm font-medium text-gray-600">Live Now</p>
                  <p className="text-2xl font-bold text-green-600">
                    {liveEvents}
                  </p>
                </div>
                <Badge className="bg-green-100 text-green-800">Live</Badge>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">Upcoming</p>
                  <p className="text-2xl font-bold text-blue-600">
                    {upcomingEvents}
                  </p>
                </div>
                <Badge className="bg-blue-100 text-blue-800">Upcoming</Badge>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">
                    Total Earnings
                  </p>
                  <p className="text-2xl font-bold text-gray-900">
                    ${totalEarnings}
                  </p>
                </div>
                <DollarSign className="h-8 w-8 text-green-600" />
              </div>
            </CardContent>
          </Card>
        </div>

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
            const TypeIcon = getTypeIcon(event.type);
            return (
              <Card
                key={event.id}
                className="hover:shadow-lg transition-all duration-300 border-0 bg-white/80 backdrop-blur-sm hover:-translate-y-1 group"
              >
                <CardContent className="p-0">
                  {/* Header Section */}
                  <div className="p-6 pb-4">
                    <div className="flex items-start justify-between mb-4">
                      <div className="flex items-center space-x-3">
                        <div
                          className={`w-12 h-12 rounded-xl flex items-center justify-center ${getTypeColor(
                            event.type,
                          )} shadow-sm`}
                        >
                          <TypeIcon className="w-6 h-6" />
                        </div>
                        <div className="flex-1">
                          <div className="flex items-center space-x-2 mb-1">
                            <h3 className="text-lg font-bold text-gray-900 group-hover:text-brand-purple transition-colors">
                              {event.name}
                            </h3>
                            <Badge
                              className={`${getStatusColor(event.status)} text-xs`}
                            >
                              {event.status === "live" && (
                                <div className="w-2 h-2 bg-green-500 rounded-full mr-1 animate-pulse" />
                              )}
                              {event.status.toUpperCase()}
                            </Badge>
                          </div>
                          <p className="text-sm text-gray-600 leading-relaxed">
                            {event.description}
                          </p>
                        </div>
                      </div>
                    </div>

                    {/* Event Details */}
                    <div className="grid grid-cols-1 gap-2 mb-4">
                      <div className="flex items-center space-x-2 text-sm text-gray-600">
                        <MapPin className="w-4 h-4 text-gray-400" />
                        <span className="font-medium">{event.venue}</span>
                      </div>
                      <div className="flex items-center space-x-4 text-sm text-gray-600">
                        <div className="flex items-center space-x-2">
                          <Calendar className="w-4 h-4 text-gray-400" />
                          <span>
                            {new Date(event.date).toLocaleDateString()}
                          </span>
                        </div>
                        <div className="flex items-center space-x-2">
                          <Clock className="w-4 h-4 text-gray-400" />
                          <span>{event.time}</span>
                        </div>
                      </div>
                    </div>

                    {/* Event Stats */}
                    <div className="grid grid-cols-2 gap-4 mb-4">
                      <div className="flex items-center space-x-2">
                        <div className="w-8 h-8 bg-gray-100 rounded-lg flex items-center justify-center">
                          <Users className="w-4 h-4 text-gray-600" />
                        </div>
                        <div>
                          <p className="text-lg font-bold text-gray-900">
                            {event.attendees}
                          </p>
                          <p className="text-xs text-gray-500">Attendees</p>
                        </div>
                      </div>
                      <div className="flex items-center space-x-2">
                        <div className="w-8 h-8 bg-green-100 rounded-lg flex items-center justify-center">
                          <DollarSign className="w-4 h-4 text-green-600" />
                        </div>
                        <div>
                          <p className="text-lg font-bold text-green-600">
                            ${event.earnings}
                          </p>
                          <p className="text-xs text-gray-500">Earnings</p>
                        </div>
                      </div>
                    </div>

                    {/* Additional Stats Row */}
                    {(event.requests !== undefined ||
                      event.orders !== undefined) && (
                      <div className="grid grid-cols-2 gap-4 mb-4">
                        {event.requests !== undefined && (
                          <div className="flex items-center space-x-2">
                            <div className="w-8 h-8 bg-brand-purple/10 rounded-lg flex items-center justify-center">
                              <Music className="w-4 h-4 text-brand-purple" />
                            </div>
                            <div>
                              <p className="text-lg font-bold text-gray-900">
                                {event.requests}
                              </p>
                              <p className="text-xs text-gray-500">Requests</p>
                            </div>
                          </div>
                        )}
                        {event.orders !== undefined && (
                          <div className="flex items-center space-x-2">
                            <div className="w-8 h-8 bg-brand-blue/10 rounded-lg flex items-center justify-center">
                              <Coffee className="w-4 h-4 text-brand-blue" />
                            </div>
                            <div>
                              <p className="text-lg font-bold text-gray-900">
                                {event.orders}
                              </p>
                              <p className="text-xs text-gray-500">Orders</p>
                            </div>
                          </div>
                        )}
                      </div>
                    )}

                    {/* Assigned Staff (for company events) */}
                    {event.assignedStaff && (
                      <div className="mb-4">
                        <p className="text-xs font-medium text-gray-600 mb-2">
                          Assigned Staff:
                        </p>
                        <div className="flex flex-wrap gap-1">
                          {event.assignedStaff.dj && (
                            <Badge
                              variant="outline"
                              className="text-xs bg-brand-purple/5 border-brand-purple/20"
                            >
                              DJ: {event.assignedStaff.dj}
                            </Badge>
                          )}
                          {event.assignedStaff.barista && (
                            <Badge
                              variant="outline"
                              className="text-xs bg-brand-blue/5 border-brand-blue/20"
                            >
                              Barista: {event.assignedStaff.barista}
                            </Badge>
                          )}
                          {event.assignedStaff.host && (
                            <Badge
                              variant="outline"
                              className="text-xs bg-green-50 border-green-200"
                            >
                              Host: {event.assignedStaff.host}
                            </Badge>
                          )}
                        </div>
                      </div>
                    )}
                  </div>

                  {/* Action Buttons Footer */}
                  <div className="px-6 py-4 bg-gray-50/50 border-t border-gray-100">
                    <div className="grid grid-cols-2 gap-2">
                      {event.status === "live" ? (
                        <Button
                          size="sm"
                          className="bg-green-600 hover:bg-green-700 text-white"
                          onClick={() => handleViewLive(event.id)}
                        >
                          <Eye className="w-4 h-4 mr-2" />
                          View Live
                        </Button>
                      ) : (
                        <Button
                          size="sm"
                          variant="outline"
                          className="hover:bg-brand-purple/5 hover:border-brand-purple/20"
                          onClick={() => handleGenerateQR(event.id)}
                        >
                          <QrCode className="w-4 h-4 mr-2" />
                          QR Code
                        </Button>
                      )}
                      <Button
                        size="sm"
                        variant="outline"
                        className="hover:bg-blue-50 hover:border-blue-200"
                        onClick={() => handleEditEvent(event.id)}
                      >
                        <Edit className="w-4 h-4 mr-2" />
                        Edit
                      </Button>
                      {event.status === "live" && (
                        <Button
                          size="sm"
                          variant="outline"
                          className="hover:bg-brand-purple/5 hover:border-brand-purple/20 col-span-1"
                          onClick={() => handleGenerateQR(event.id)}
                        >
                          <QrCode className="w-4 h-4 mr-2" />
                          QR Code
                        </Button>
                      )}
                      <Button
                        size="sm"
                        variant="outline"
                        className="text-red-600 hover:text-red-700 hover:bg-red-50 hover:border-red-200"
                        onClick={() => handleDeleteEvent(event.id)}
                      >
                        <Trash2 className="w-4 h-4 mr-2" />
                        Delete
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            );
          })}
        </div>

        {filteredEvents.length === 0 && (
          <div className="col-span-full">
            <Card className="bg-gradient-to-br from-gray-50 to-white">
              <CardContent className="p-12 text-center">
                <div className="w-24 h-24 bg-gradient-to-br from-brand-purple/10 to-brand-blue/10 rounded-2xl mx-auto mb-6 flex items-center justify-center">
                  <Calendar className="w-12 h-12 text-brand-purple" />
                </div>
                <h3 className="text-xl font-bold text-gray-900 mb-2">
                  No events found
                </h3>
                <p className="text-gray-500 mb-6 max-w-md mx-auto">
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
      </div>
    </Layout>
  );
}
