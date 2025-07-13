import { useState } from "react";
import { Link } from "react-router-dom";
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

        {/* Events List */}
        <div className="space-y-4">
          {filteredEvents.map((event) => {
            const TypeIcon = getTypeIcon(event.type);
            return (
              <Card
                key={event.id}
                className="hover:shadow-md transition-shadow"
              >
                <CardContent className="p-6">
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <div className="flex items-center space-x-3 mb-3">
                        <div
                          className={`w-10 h-10 rounded-lg flex items-center justify-center ${getTypeColor(
                            event.type,
                          )}`}
                        >
                          <TypeIcon className="w-5 h-5" />
                        </div>
                        <div>
                          <h3 className="text-lg font-semibold text-gray-900">
                            {event.name}
                          </h3>
                          <p className="text-sm text-gray-600">
                            {event.description}
                          </p>
                        </div>
                        <Badge className={getStatusColor(event.status)}>
                          {event.status === "live" && (
                            <div className="w-2 h-2 bg-green-500 rounded-full mr-1 animate-pulse" />
                          )}
                          {event.status}
                        </Badge>
                      </div>

                      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
                        <div className="flex items-center space-x-2 text-sm text-gray-600">
                          <MapPin className="w-4 h-4" />
                          <span>{event.venue}</span>
                        </div>
                        <div className="flex items-center space-x-2 text-sm text-gray-600">
                          <Calendar className="w-4 h-4" />
                          <span>
                            {new Date(event.date).toLocaleDateString()}
                          </span>
                        </div>
                        <div className="flex items-center space-x-2 text-sm text-gray-600">
                          <Clock className="w-4 h-4" />
                          <span>{event.time}</span>
                        </div>
                      </div>

                      {/* Event Stats */}
                      <div className="flex items-center space-x-6 text-sm">
                        <div className="flex items-center space-x-1">
                          <Users className="w-4 h-4 text-gray-400" />
                          <span className="font-medium">{event.attendees}</span>
                          <span className="text-gray-500">attendees</span>
                        </div>
                        <div className="flex items-center space-x-1">
                          <DollarSign className="w-4 h-4 text-green-600" />
                          <span className="font-medium text-green-600">
                            ${event.earnings}
                          </span>
                        </div>
                        {event.requests !== undefined && (
                          <div className="flex items-center space-x-1">
                            <Music className="w-4 h-4 text-brand-purple" />
                            <span className="font-medium">
                              {event.requests}
                            </span>
                            <span className="text-gray-500">requests</span>
                          </div>
                        )}
                        {event.orders !== undefined && (
                          <div className="flex items-center space-x-1">
                            <Coffee className="w-4 h-4 text-brand-blue" />
                            <span className="font-medium">{event.orders}</span>
                            <span className="text-gray-500">orders</span>
                          </div>
                        )}
                      </div>

                      {/* Assigned Staff (for company events) */}
                      {event.assignedStaff && (
                        <div className="mt-3 pt-3 border-t">
                          <p className="text-xs font-medium text-gray-600 mb-2">
                            Assigned Staff:
                          </p>
                          <div className="flex space-x-2">
                            {event.assignedStaff.dj && (
                              <Badge variant="outline" className="text-xs">
                                DJ: {event.assignedStaff.dj}
                              </Badge>
                            )}
                            {event.assignedStaff.barista && (
                              <Badge variant="outline" className="text-xs">
                                Barista: {event.assignedStaff.barista}
                              </Badge>
                            )}
                            {event.assignedStaff.host && (
                              <Badge variant="outline" className="text-xs">
                                Host: {event.assignedStaff.host}
                              </Badge>
                            )}
                          </div>
                        </div>
                      )}
                    </div>

                    {/* Action Buttons */}
                    <div className="flex flex-col space-y-2 ml-4">
                      {event.status === "live" && (
                        <Button size="sm" variant="outline">
                          <Eye className="w-4 h-4 mr-1" />
                          View Live
                        </Button>
                      )}
                      <Button size="sm" variant="outline">
                        <QrCode className="w-4 h-4 mr-1" />
                        QR Code
                      </Button>
                      <Button size="sm" variant="outline">
                        <Edit className="w-4 h-4 mr-1" />
                        Edit
                      </Button>
                      <Button
                        size="sm"
                        variant="outline"
                        className="text-red-600 hover:text-red-700"
                      >
                        <Trash2 className="w-4 h-4 mr-1" />
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
          <Card>
            <CardContent className="p-8 text-center">
              <Calendar className="w-16 h-16 text-gray-300 mx-auto mb-4" />
              <h3 className="text-lg font-medium text-gray-900 mb-2">
                No events found
              </h3>
              <p className="text-gray-500 mb-4">
                No events match your current filters.
              </p>
              <Link to="/create-event">
                <Button>
                  <Plus className="w-4 h-4 mr-2" />
                  Create Your First Event
                </Button>
              </Link>
            </CardContent>
          </Card>
        )}
      </div>
    </Layout>
  );
}
