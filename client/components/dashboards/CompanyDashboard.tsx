import { Link } from "react-router-dom";
import { useState, useEffect } from "react";
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
  Building2,
  DollarSign,
  Calendar,
  Users,
  Plus,
  TrendingUp,
  Clock,
  Music,
  Coffee,
  UserCheck,
} from "lucide-react";
import { Loading } from "@/components/Loading";
import { DashboardResponse } from "@shared/api";

export function CompanyDashboard({ userName }: { userName: string }) {
  const [dashboardData, setDashboardData] = useState<DashboardResponse | null>(
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

    fetchDashboardData();
  }, []);

  if (loading) {
    return <Loading />;
  }

  if (error) {
    return (
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">
            Error Loading Dashboard
          </h2>
          <p className="text-gray-600 dark:text-gray-400 mb-4">{error}</p>
          <Button onClick={() => window.location.reload()}>Try Again</Button>
        </div>
      </div>
    );
  }

  const stats = [
    {
      title: "Total Revenue",
      value: `$${dashboardData?.stats.totalEarnings?.toFixed(2) || "0.00"}`,
      change: "+18%",
      icon: DollarSign,
      color: "text-green-600",
    },
    {
      title: "Active Events",
      value: dashboardData?.stats.activeEvents?.toString() || "0",
      change: "+3",
      icon: Calendar,
      color: "text-brand-purple",
    },
    {
      title: "Team Members",
      value: "0", // This would need a separate API call for team members
      change: "+2",
      icon: Users,
      color: "text-brand-blue",
    },
    {
      title: "Events This Month",
      value: dashboardData?.stats.totalEvents?.toString() || "0",
      change: "+12",
      icon: Building2,
      color: "text-orange-600",
    },
  ];

  const activeEvents = dashboardData?.upcomingEvents?.slice(0, 2) || [];
  const teamMembers = []; // Will be populated with real team data once team management API is implemented

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

  const getRoleIcon = (role: string) => {
    switch (role.toLowerCase()) {
      case "dj":
        return Music;
      case "barista":
        return Coffee;
      case "host":
        return UserCheck;
      default:
        return Users;
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      {/* Header */}
      <div className="mb-8">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
              Welcome back, {userName}! 🏢
            </h1>
            <p className="text-gray-600 dark:text-gray-400 mt-1">
              Manage your events and team performance
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
        {/* Active Events */}
        <Card>
          <CardHeader>
            <div className="flex items-center justify-between">
              <div>
                <CardTitle>Active Events</CardTitle>
                <CardDescription>
                  Events currently running or upcoming
                </CardDescription>
              </div>
              <Badge
                variant="secondary"
                className="bg-green-100 text-green-800"
              >
                <Clock className="w-3 h-3 mr-1" />
                Live Updates
              </Badge>
            </div>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {activeEvents.length > 0 ? (
                activeEvents.map((event) => (
                  <div
                    key={event.id}
                    className="p-4 rounded-lg border bg-gradient-to-r from-brand-purple/5 to-brand-blue/5 dark:from-brand-purple/10 dark:to-brand-blue/10 border-brand-purple/20 dark:border-brand-purple/30"
                  >
                    <div className="flex items-center justify-between mb-3">
                      <div>
                        <h3 className="font-medium text-gray-900 dark:text-white">
                          {event.name}
                        </h3>
                        <p className="text-sm text-gray-600 dark:text-gray-400">
                          {event.venue} •{" "}
                          {new Date(event.date).toLocaleDateString()} at{" "}
                          {new Date(event.startTime).toLocaleTimeString([], {
                            hour: "2-digit",
                            minute: "2-digit",
                          })}
                        </p>
                      </div>
                      <Badge className={getStatusColor(event.status)}>
                        {event.status.toLowerCase()}
                      </Badge>
                    </div>
                    <div className="flex items-center justify-between">
                      <div className="flex items-center space-x-4 text-sm text-gray-500 dark:text-gray-400">
                        <span className="flex items-center">
                          <Users className="w-4 h-4 mr-1" />
                          {event.attendeeCount} attendees
                        </span>
                      </div>
                      <span className="font-medium text-green-600">
                        ${event.totalEarnings.toFixed(2)}
                      </span>
                    </div>
                  </div>
                ))
              ) : (
                <div className="text-center py-8 text-gray-500 dark:text-gray-400">
                  <Calendar className="w-12 h-12 mx-auto mb-4 opacity-50" />
                  <p>No active events</p>
                  <p className="text-sm">Create events to see them here</p>
                </div>
              )}
            </div>
            <Button variant="outline" className="w-full mt-4">
              View All Events
            </Button>
          </CardContent>
        </Card>

        {/* Team Performance */}
        <Card>
          <CardHeader>
            <CardTitle>Team Performance</CardTitle>
            <CardDescription>Top performing team members</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {teamMembers.length > 0 ? (
                teamMembers.map((member) => {
                  const Icon = getRoleIcon(member.role);
                  return (
                    <div
                      key={member.id}
                      className="flex items-center justify-between p-4 rounded-lg border bg-gradient-to-r from-brand-blue/5 to-brand-purple/5 dark:from-brand-blue/10 dark:to-brand-purple/10 border-brand-blue/20 dark:border-brand-blue/30"
                    >
                      <div className="flex items-center space-x-3">
                        <div className="relative">
                          <Avatar className="h-12 w-12">
                            <AvatarImage src={`/api/placeholder/48/48`} />
                            <AvatarFallback>
                              {member.name.split(" ").map((n) => n[0])}
                            </AvatarFallback>
                          </Avatar>
                          <div className="absolute -bottom-1 -right-1 w-6 h-6 bg-white rounded-full flex items-center justify-center border-2">
                            <Icon className="w-3 h-3" />
                          </div>
                        </div>
                        <div>
                          <p className="font-medium text-gray-900 dark:text-white">
                            {member.name}
                          </p>
                          <p className="text-sm text-gray-600 dark:text-gray-400">
                            {member.events} events • {member.revenue}
                          </p>
                        </div>
                      </div>
                    </div>
                  );
                })
              ) : (
                <div className="text-center py-8 text-gray-500 dark:text-gray-400">
                  <Users className="w-12 h-12 mx-auto mb-4 opacity-50" />
                  <p>No team members yet</p>
                  <p className="text-sm">Invite team members to get started</p>
                  <Button className="mt-4" size="sm">
                    <Plus className="w-4 h-4 mr-2" />
                    Invite Team Member
                  </Button>
                </div>
              )}
            </div>
            <Button variant="outline" className="w-full mt-4">
              Manage Team
            </Button>
          </CardContent>
        </Card>
      </div>

      {/* Quick Actions */}
      <Card className="mt-8">
        <CardHeader>
          <CardTitle>Quick Actions</CardTitle>
          <CardDescription>
            Common tasks to manage your event business
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <Link to="/create-event">
              <Button variant="outline" className="p-6 h-auto flex-col w-full">
                <Plus className="w-6 h-6 mb-2" />
                <span className="font-medium">Create New Event</span>
                <span className="text-xs text-gray-500 dark:text-gray-400">
                  Set up a new event with your team
                </span>
              </Button>
            </Link>
            <Button variant="outline" className="p-6 h-auto flex-col w-full">
              <Users className="w-6 h-6 mb-2" />
              <span className="font-medium">Invite Team Member</span>
              <span className="text-xs text-gray-500 dark:text-gray-400">
                Add DJs, baristas, and hosts to your team
              </span>
            </Button>
            <Link to="/analytics">
              <Button variant="outline" className="p-6 h-auto flex-col w-full">
                <TrendingUp className="w-6 h-6 mb-2" />
                <span className="font-medium">View Analytics</span>
                <span className="text-xs text-gray-500 dark:text-gray-400">
                  Track team performance and revenue
                </span>
              </Button>
            </Link>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
