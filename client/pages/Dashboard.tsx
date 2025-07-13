import { Link } from "react-router-dom";
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
import { useState, useEffect } from "react";
import { Loading } from "@/components/Loading";

interface DashboardStats {
  totalEvents: number;
  totalEarnings: number;
  totalSongRequests: number;
  activeEvents: number;
}

interface RecentActivity {
  id: string;
  type: string;
  title: string;
  subtitle: string;
  amount: number;
  status: string;
  createdAt: string;
}

interface Event {
  id: string;
  name: string;
  venue: string;
  date: string;
  startTime: string;
  endTime?: string;
  status: string;
}

interface DashboardData {
  stats: DashboardStats;
  recentActivity: RecentActivity[];
  upcomingEvents: Event[];
}

export default function Dashboard() {
  const { user } = useAuth();
  const [dashboardData, setDashboardData] = useState<DashboardData | null>(
    null,
  );
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchDashboardData = async () => {
      try {
        const token = localStorage.getItem("eventflow_token");
        if (!token) {
          throw new Error("No authentication token found");
        }

        const response = await fetch("/api/dashboard/stats", {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }

        const data = await response.json();
        setDashboardData(data);
      } catch (err) {
        console.error("Failed to fetch dashboard data:", err);
        setError(
          err instanceof Error ? err.message : "Failed to load dashboard data",
        );
      } finally {
        setLoading(false);
      }
    };

    if (user && (user.role === "DJ" || user.role === "HOST")) {
      fetchDashboardData();
    } else {
      setLoading(false);
    }
  }, [user]);

  if (!user) {
    return null;
  }

  // Show role-specific dashboard
  if (user.role === "BARISTA") {
    return (
      <Layout>
        <BaristaDashboard userName={user.name} />
      </Layout>
    );
  }

  if (user.role === "COMPANY") {
    return (
      <Layout>
        <CompanyDashboard userName={user.name} />
      </Layout>
    );
  }

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
              Error Loading Dashboard
            </h2>
            <p className="text-gray-600 dark:text-gray-400 mb-4">{error}</p>
            <Button onClick={() => window.location.reload()}>Try Again</Button>
          </div>
        </div>
      </Layout>
    );
  }

  // Default DJ dashboard (and host for now)
  const stats = [
    {
      title: "Total Earnings",
      value: `$${dashboardData?.stats.totalEarnings?.toFixed(2) || "0.00"}`,
      change: "+12%",
      icon: DollarSign,
      color: "text-green-600",
    },
    {
      title: "Song Requests",
      value: dashboardData?.stats.totalSongRequests?.toString() || "0",
      change: "+5%",
      icon: Music,
      color: "text-brand-purple",
    },
    {
      title: "Events This Month",
      value: dashboardData?.stats.totalEvents?.toString() || "0",
      change: "+2",
      icon: Calendar,
      color: "text-brand-blue",
    },
    {
      title: "Active Events",
      value: dashboardData?.stats.activeEvents?.toString() || "0",
      change: "Live now",
      icon: Users,
      color: "text-orange-600",
    },
  ];

  const recentRequests =
    dashboardData?.recentActivity?.map((activity) => ({
      id: activity.id,
      song: activity.title.split(" by ")[0] || activity.title,
      artist: activity.title.split(" by ")[1] || "Unknown Artist",
      requester:
        activity.subtitle.split(" by ")[1]?.split(" for ")[0] || "Unknown",
      amount: `$${activity.amount.toFixed(2)}`,
      status: activity.status.toLowerCase(),
      time: new Date(activity.createdAt).toLocaleString(),
    })) || [];

  const upcomingEvents =
    dashboardData?.upcomingEvents?.map((event) => ({
      id: event.id,
      name: event.name,
      venue: event.venue,
      date: new Date(event.date).toLocaleDateString(),
      time: new Date(event.startTime).toLocaleTimeString([], {
        hour: "2-digit",
        minute: "2-digit",
      }),
      status: event.status.toLowerCase(),
    })) || [];

  return (
    <Layout>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
                Welcome back, {user.name}! {user.role === "DJ" ? "🎵" : "🎉"}
              </h1>
              <p className="text-gray-600 dark:text-gray-400 mt-1">
                Here's what's happening with your events today
              </p>
            </div>
            <Link to="/create-event">
              <Button className="bg-gradient-to-r from-brand-purple to-brand-blue">
                <Plus className="w-4 h-4 mr-2" />
                Create Event
              </Button>
            </Link>
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
                      <p className="text-sm font-medium text-gray-600 dark:text-gray-400">
                        {stat.title}
                      </p>
                      <p className="text-2xl font-bold text-gray-900 dark:text-white">
                        {stat.value}
                      </p>
                      <p className={`text-sm ${stat.color} font-medium`}>
                        {stat.change}
                      </p>
                    </div>
                    <div className="h-12 w-12 bg-gray-100 dark:bg-gray-700 rounded-lg flex items-center justify-center">
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
                    className="flex items-center justify-between p-4 rounded-lg border bg-gray-50/50 dark:bg-gray-800/50 dark:border-gray-700"
                  >
                    <div className="flex items-center space-x-3">
                      <Avatar className="h-10 w-10">
                        <AvatarImage src={`/api/placeholder/40/40`} />
                        <AvatarFallback>
                          {request.requester.charAt(0)}
                        </AvatarFallback>
                      </Avatar>
                      <div>
                        <p className="font-medium text-gray-900 dark:text-white">
                          {request.song}
                        </p>
                        <p className="text-sm text-gray-600 dark:text-gray-400">
                          {request.artist} • {request.requester}
                        </p>
                        <p className="text-xs text-gray-500 dark:text-gray-400">
                          {request.time}
                        </p>
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
                      <h3 className="font-medium text-gray-900 dark:text-white">
                        {event.name}
                      </h3>
                      <Badge className="bg-green-100 text-green-800">
                        {event.status}
                      </Badge>
                    </div>
                    <p className="text-sm text-gray-600 dark:text-gray-400">
                      {event.venue}
                    </p>
                    <div className="flex items-center justify-between mt-3">
                      <div className="flex items-center space-x-4 text-sm text-gray-500 dark:text-gray-400">
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
              <Link to="/create-event">
                <Button
                  variant="outline"
                  className="p-6 h-auto flex-col w-full"
                >
                  <Plus className="w-6 h-6 mb-2" />
                  <span className="font-medium">Create New Event</span>
                  <span className="text-xs text-gray-500 dark:text-gray-400">
                    Set up a new gig with song requests
                  </span>
                </Button>
              </Link>
              <Link to="/qr-generator">
                <Button
                  variant="outline"
                  className="p-6 h-auto flex-col w-full"
                >
                  <QrCode className="w-6 h-6 mb-2" />
                  <span className="font-medium">Generate QR Code</span>
                  <span className="text-xs text-gray-500 dark:text-gray-400">
                    Quick access for song requests
                  </span>
                </Button>
              </Link>
              <Link to="/analytics">
                <Button
                  variant="outline"
                  className="p-6 h-auto flex-col w-full"
                >
                  <TrendingUp className="w-6 h-6 mb-2" />
                  <span className="font-medium">View Analytics</span>
                  <span className="text-xs text-gray-500 dark:text-gray-400">
                    Track your performance and earnings
                  </span>
                </Button>
              </Link>
            </div>
          </CardContent>
        </Card>
      </div>
    </Layout>
  );
}
