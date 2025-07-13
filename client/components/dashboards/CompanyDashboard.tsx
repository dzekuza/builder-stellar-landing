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

  const activeEvents = [
    {
      id: 1,
      name: "Corporate Holiday Party",
      venue: "Grand Ballroom",
      date: "Dec 16, 2023",
      time: "7:00 PM",
      staff: [
        { name: "DJ Alex", role: "dj" },
        { name: "Sarah B.", role: "barista" },
        { name: "Mike H.", role: "host" },
      ],
      revenue: "$2,450",
      status: "live",
    },
    {
      id: 2,
      name: "Wedding Reception",
      venue: "Rose Garden",
      date: "Dec 17, 2023",
      time: "6:00 PM",
      staff: [
        { name: "Emma DJ", role: "dj" },
        { name: "Tom C.", role: "barista" },
      ],
      revenue: "$1,800",
      status: "upcoming",
    },
  ];

  const teamMembers = [
    {
      id: 1,
      name: "DJ Alex",
      role: "dj",
      events: 5,
      revenue: "$3,250",
      rating: 4.9,
      status: "active",
    },
    {
      id: 2,
      name: "Sarah Barista",
      role: "barista",
      events: 8,
      revenue: "$2,100",
      rating: 4.8,
      status: "active",
    },
    {
      id: 3,
      name: "Mike Host",
      role: "host",
      events: 6,
      revenue: "$1,800",
      rating: 4.7,
      status: "active",
    },
  ];

  const getRoleIcon = (role: string) => {
    switch (role) {
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

  const getRoleColor = (role: string) => {
    switch (role) {
      case "dj":
        return "bg-brand-purple/10 text-brand-purple";
      case "barista":
        return "bg-brand-blue/10 text-brand-blue";
      case "host":
        return "bg-green-100 text-green-800";
      default:
        return "bg-gray-100 text-gray-800";
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
              Manage your team and events from your company dashboard
            </p>
          </div>
          <div className="flex space-x-3">
            <Link to="/team">
              <Button variant="outline">
                <Users className="w-4 h-4 mr-2" />
                Invite Team
              </Button>
            </Link>
            <Link to="/create-event">
              <Button className="bg-gradient-to-r from-brand-purple to-brand-blue">
                <Plus className="w-4 h-4 mr-2" />
                Create Event
              </Button>
            </Link>
          </div>
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
              {activeEvents.map((event) => (
                <div
                  key={event.id}
                  className="p-4 rounded-lg border bg-gray-50/50 dark:bg-gray-800/50 dark:border-gray-700"
                >
                  <div className="flex items-center justify-between mb-3">
                    <div>
                      <h3 className="font-medium text-gray-900 dark:text-white">
                        {event.name}
                      </h3>
                      <p className="text-sm text-gray-600 dark:text-gray-400">
                        {event.venue} • {event.date} at {event.time}
                      </p>
                    </div>
                    <Badge
                      className={
                        event.status === "live"
                          ? "bg-green-100 text-green-800"
                          : "bg-blue-100 text-blue-800"
                      }
                    >
                      {event.status}
                    </Badge>
                  </div>
                  <div className="flex items-center justify-between">
                    <div className="flex -space-x-2">
                      {event.staff.map((member, index) => {
                        const Icon = getRoleIcon(member.role);
                        return (
                          <div
                            key={index}
                            className="relative group"
                            title={`${member.name} - ${member.role}`}
                          >
                            <Avatar className="h-8 w-8 border-2 border-white">
                              <AvatarImage src={`/api/placeholder/32/32`} />
                              <AvatarFallback className="text-xs">
                                {member.name.split(" ").map((n) => n[0])}
                              </AvatarFallback>
                            </Avatar>
                            <div className="absolute -bottom-1 -right-1 w-4 h-4 bg-white rounded-full flex items-center justify-center border">
                              <Icon className="w-2 h-2" />
                            </div>
                          </div>
                        );
                      })}
                    </div>
                    <span className="font-medium text-green-600">
                      {event.revenue}
                    </span>
                  </div>
                </div>
              ))}
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
              {teamMembers.map((member) => {
                const Icon = getRoleIcon(member.role);
                return (
                  <div
                    key={member.id}
                    className="flex items-center justify-between p-4 rounded-lg border bg-gray-50/50"
                  >
                    <div className="flex items-center space-x-3">
                      <Avatar className="h-10 w-10">
                        <AvatarImage src={`/api/placeholder/40/40`} />
                        <AvatarFallback>
                          {member.name
                            .split(" ")
                            .map((n) => n[0])
                            .join("")}
                        </AvatarFallback>
                      </Avatar>
                      <div>
                        <p className="font-medium text-gray-900 dark:text-white">
                          {member.name}
                        </p>
                        <div className="flex items-center space-x-2">
                          <Badge
                            variant="secondary"
                            className={getRoleColor(member.role)}
                          >
                            <Icon className="w-3 h-3 mr-1" />
                            {member.role.charAt(0).toUpperCase() +
                              member.role.slice(1)}
                          </Badge>
                          <span className="text-xs text-gray-500 dark:text-gray-400">
                            {member.events} events
                          </span>
                        </div>
                      </div>
                    </div>
                    <div className="text-right">
                      <p className="font-medium text-green-600">
                        {member.revenue}
                      </p>
                      <p className="text-xs text-gray-500 dark:text-gray-400">
                        ⭐ {member.rating}
                      </p>
                    </div>
                  </div>
                );
              })}
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
          <CardTitle>Company Management</CardTitle>
          <CardDescription>
            Essential tools for managing your event company
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <Link to="/create-event">
              <Button variant="outline" className="p-6 h-auto flex-col w-full">
                <Plus className="w-6 h-6 mb-2" />
                <span className="font-medium">New Event</span>
                <span className="text-xs text-gray-500 dark:text-gray-400">
                  Create and assign
                </span>
              </Button>
            </Link>
            <Link to="/team">
              <Button variant="outline" className="p-6 h-auto flex-col w-full">
                <Users className="w-6 h-6 mb-2" />
                <span className="font-medium">Invite Team</span>
                <span className="text-xs text-gray-500 dark:text-gray-400">
                  Add new members
                </span>
              </Button>
            </Link>
            <Link to="/analytics">
              <Button variant="outline" className="p-6 h-auto flex-col w-full">
                <TrendingUp className="w-6 h-6 mb-2" />
                <span className="font-medium">Analytics</span>
                <span className="text-xs text-gray-500 dark:text-gray-400">
                  Company insights
                </span>
              </Button>
            </Link>
            <Link to="/events">
              <Button variant="outline" className="p-6 h-auto flex-col w-full">
                <Calendar className="w-6 h-6 mb-2" />
                <span className="font-medium">Schedule</span>
                <span className="text-xs text-gray-500 dark:text-gray-400">
                  Team calendar
                </span>
              </Button>
            </Link>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
