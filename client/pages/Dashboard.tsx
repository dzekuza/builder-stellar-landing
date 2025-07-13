import { Layout } from "@/components/Layout";
import { useAuth } from "@/contexts/AuthContext";
import { BaristaDashboard } from "@/components/dashboards/BaristaDashboard";
import { CompanyDashboard } from "@/components/dashboards/CompanyDashboard";
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
import {
  Music,
  DollarSign,
  Calendar,
  Users,
  Play,
  Pause,
  Plus,
  QrCode,
  TrendingUp,
  Clock,
} from "lucide-react";

export default function Dashboard() {
  const { user } = useAuth();

  if (!user) {
    return null;
  }

  // Show role-specific dashboard
  if (user.role === "barista") {
    return (
      <Layout>
        <BaristaDashboard userName={user.name} />
      </Layout>
    );
  }

  if (user.role === "company") {
    return (
      <Layout>
        <CompanyDashboard userName={user.name} />
      </Layout>
    );
  }

  // Default DJ dashboard (and host for now)
  // Mock data - in real app this would come from API
  const stats = [
    {
      title: "Total Earnings",
      value: "$1,247",
      change: "+12%",
      icon: DollarSign,
      color: "text-green-600",
    },
    {
      title: "Song Requests",
      value: "156",
      change: "+5%",
      icon: Music,
      color: "text-brand-purple",
    },
    {
      title: "Events This Month",
      value: "8",
      change: "+2",
      icon: Calendar,
      color: "text-brand-blue",
    },
    {
      title: "Active Events",
      value: "2",
      change: "Live now",
      icon: Users,
      color: "text-orange-600",
    },
  ];

  const recentRequests = [
    {
      id: 1,
      song: "Bohemian Rhapsody",
      artist: "Queen",
      requester: "Sarah M.",
      amount: "$5.00",
      status: "pending",
      time: "2 min ago",
    },
    {
      id: 2,
      song: "Sweet Child O' Mine",
      artist: "Guns N' Roses",
      requester: "Mike R.",
      amount: "$3.00",
      status: "played",
      time: "15 min ago",
    },
    {
      id: 3,
      song: "Hotel California",
      artist: "Eagles",
      requester: "Jessica K.",
      amount: "$5.00",
      status: "pending",
      time: "18 min ago",
    },
  ];

  const upcomingEvents = [
    {
      id: 1,
      name: "Saturday Night Vibes",
      venue: "Blue Moon Bar",
      date: "Dec 16, 2023",
      time: "9:00 PM",
      status: "confirmed",
    },
    {
      id: 2,
      name: "Wedding Reception",
      venue: "Grand Hotel",
      date: "Dec 18, 2023",
      time: "7:00 PM",
      status: "confirmed",
    },
  ];

  return (
    <Layout>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold text-gray-900">
                Welcome back, {user.name}! {user.role === "dj" ? "🎵" : "🎉"}
              </h1>
              <p className="text-gray-600 mt-1">
                Here's what's happening with your events today
              </p>
            </div>
            <Button className="bg-gradient-to-r from-brand-purple to-brand-blue">
              <Plus className="w-4 h-4 mr-2" />
              Create Event
            </Button>
          </div>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          {stats.map((stat, index) => {
            const Icon = stat.icon;
            return (
              <Card key={index}>
                <CardContent className="p-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm font-medium text-gray-600">
                        {stat.title}
                      </p>
                      <p className="text-2xl font-bold text-gray-900">
                        {stat.value}
                      </p>
                      <p className={`text-sm ${stat.color} font-medium`}>
                        {stat.change}
                      </p>
                    </div>
                    <div className="h-12 w-12 bg-gray-100 rounded-lg flex items-center justify-center">
                      <Icon className={`h-6 w-6 ${stat.color}`} />
                    </div>
                  </div>
                </CardContent>
              </Card>
            );
          })}
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Recent Song Requests */}
          <Card>
            <CardHeader>
              <div className="flex items-center justify-between">
                <div>
                  <CardTitle>Recent Song Requests</CardTitle>
                  <CardDescription>
                    Latest requests from your live events
                  </CardDescription>
                </div>
                <Badge
                  variant="secondary"
                  className="bg-brand-purple/10 text-brand-purple"
                >
                  <Clock className="w-3 h-3 mr-1" />
                  Live
                </Badge>
              </div>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {recentRequests.map((request) => (
                  <div
                    key={request.id}
                    className="flex items-center justify-between p-4 rounded-lg border bg-gray-50/50"
                  >
                    <div className="flex items-center space-x-3">
                      <Avatar className="h-10 w-10">
                        <AvatarImage src={`/api/placeholder/40/40`} />
                        <AvatarFallback>
                          {request.requester.charAt(0)}
                        </AvatarFallback>
                      </Avatar>
                      <div>
                        <p className="font-medium text-gray-900">
                          {request.song}
                        </p>
                        <p className="text-sm text-gray-600">
                          {request.artist} • {request.requester}
                        </p>
                        <p className="text-xs text-gray-500">{request.time}</p>
                      </div>
                    </div>
                    <div className="flex items-center space-x-2">
                      <Badge
                        variant={
                          request.status === "played" ? "secondary" : "default"
                        }
                        className={
                          request.status === "played"
                            ? "bg-green-100 text-green-800"
                            : "bg-brand-purple text-white"
                        }
                      >
                        {request.status === "played" ? (
                          <>
                            <Play className="w-3 h-3 mr-1" />
                            Played
                          </>
                        ) : (
                          "Pending"
                        )}
                      </Badge>
                      <span className="font-medium text-green-600">
                        {request.amount}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
              <Button variant="outline" className="w-full mt-4">
                View All Requests
              </Button>
            </CardContent>
          </Card>

          {/* Upcoming Events */}
          <Card>
            <CardHeader>
              <CardTitle>Upcoming Events</CardTitle>
              <CardDescription>Your scheduled performances</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {upcomingEvents.map((event) => (
                  <div
                    key={event.id}
                    className="p-4 rounded-lg border bg-gray-50/50"
                  >
                    <div className="flex items-center justify-between mb-2">
                      <h3 className="font-medium text-gray-900">
                        {event.name}
                      </h3>
                      <Badge className="bg-green-100 text-green-800">
                        {event.status}
                      </Badge>
                    </div>
                    <p className="text-sm text-gray-600">{event.venue}</p>
                    <div className="flex items-center justify-between mt-3">
                      <div className="flex items-center space-x-4 text-sm text-gray-500">
                        <span className="flex items-center">
                          <Calendar className="w-4 h-4 mr-1" />
                          {event.date}
                        </span>
                        <span className="flex items-center">
                          <Clock className="w-4 h-4 mr-1" />
                          {event.time}
                        </span>
                      </div>
                      <Button variant="outline" size="sm">
                        <QrCode className="w-4 h-4 mr-1" />
                        QR Code
                      </Button>
                    </div>
                  </div>
                ))}
              </div>
              <Button variant="outline" className="w-full mt-4">
                View All Events
              </Button>
            </CardContent>
          </Card>
        </div>

        {/* Quick Actions */}
        <Card className="mt-8">
          <CardHeader>
            <CardTitle>Quick Actions</CardTitle>
            <CardDescription>
              Common tasks to manage your DJ business
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <Button variant="outline" className="p-6 h-auto flex-col">
                <Plus className="w-6 h-6 mb-2" />
                <span className="font-medium">Create New Event</span>
                <span className="text-xs text-gray-500">
                  Set up a new gig with song requests
                </span>
              </Button>
              <Button variant="outline" className="p-6 h-auto flex-col">
                <QrCode className="w-6 h-6 mb-2" />
                <span className="font-medium">Generate QR Code</span>
                <span className="text-xs text-gray-500">
                  Quick access for song requests
                </span>
              </Button>
              <Button variant="outline" className="p-6 h-auto flex-col">
                <TrendingUp className="w-6 h-6 mb-2" />
                <span className="font-medium">View Analytics</span>
                <span className="text-xs text-gray-500">
                  Track your performance and earnings
                </span>
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    </Layout>
  );
}
