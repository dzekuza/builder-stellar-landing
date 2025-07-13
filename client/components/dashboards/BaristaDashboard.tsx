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
  Coffee,
  DollarSign,
  Calendar,
  Users,
  Plus,
  QrCode,
  TrendingUp,
  Clock,
  CheckCircle,
  Package,
} from "lucide-react";
import { Loading } from "@/components/Loading";
import { DashboardResponse } from "@shared/api";

export function BaristaDashboard({ userName }: { userName: string }) {
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
      title: "Total Earnings",
      value: `$${dashboardData?.stats.totalEarnings?.toFixed(2) || "0.00"}`,
      change: "+8%",
      icon: DollarSign,
      color: "text-green-600",
    },
    {
      title: "Drink Orders",
      value: dashboardData?.recentActivity?.length?.toString() || "0",
      change: "+15%",
      icon: Coffee,
      color: "text-brand-blue",
    },
    {
      title: "Events This Month",
      value: dashboardData?.stats.totalEvents?.toString() || "0",
      change: "+1",
      icon: Calendar,
      color: "text-brand-purple",
    },
    {
      title: "Active Orders",
      value: dashboardData?.stats.activeEvents?.toString() || "0",
      change: "Pending",
      icon: Users,
      color: "text-orange-600",
    },
  ];

  const recentOrders = [
    {
      id: 1,
      drink: "Caramel Macchiato",
      customer: "Emma K.",
      amount: "$6.50",
      status: "pending",
      time: "3 min ago",
      notes: "Extra hot, oat milk",
    },
    {
      id: 2,
      drink: "Iced Americano",
      customer: "James R.",
      amount: "$4.00",
      status: "completed",
      time: "12 min ago",
      notes: "No sugar",
    },
    {
      id: 3,
      drink: "Vanilla Latte",
      customer: "Sophie M.",
      amount: "$5.50",
      status: "pending",
      time: "15 min ago",
      notes: "Decaf, extra foam",
    },
  ];

  const upcomingEvents = [
    {
      id: 1,
      name: "Morning Coffee Rush",
      venue: "Downtown Café",
      date: "Dec 16, 2023",
      time: "8:00 AM",
      status: "confirmed",
    },
    {
      id: 2,
      name: "Corporate Event",
      venue: "Tech Hub",
      date: "Dec 18, 2023",
      time: "2:00 PM",
      status: "confirmed",
    },
  ];

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      {/* Header */}
      <div className="mb-8">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
              Welcome back, {userName}! ☕
            </h1>
            <p className="text-gray-600 dark:text-gray-400 mt-1">
              Ready to brew some amazing drinks today
            </p>
          </div>
          <Link to="/create-event">
            <Button className="bg-gradient-to-r from-brand-blue to-brand-blue-dark">
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
        {/* Recent Drink Orders */}
        <Card>
          <CardHeader>
            <div className="flex items-center justify-between">
              <div>
                <CardTitle>Recent Drink Orders</CardTitle>
                <CardDescription>
                  Latest orders from your events
                </CardDescription>
              </div>
              <Badge
                variant="secondary"
                className="bg-brand-blue/10 text-brand-blue"
              >
                <Clock className="w-3 h-3 mr-1" />
                Live
              </Badge>
            </div>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {recentOrders.map((order) => (
                <div
                  key={order.id}
                  className="flex items-center justify-between p-4 rounded-lg border bg-gray-50/50 dark:bg-gray-800/50 dark:border-gray-700"
                >
                  <div className="flex items-center space-x-3">
                    <Avatar className="h-10 w-10">
                      <AvatarImage src={`/api/placeholder/40/40`} />
                      <AvatarFallback>
                        {order.customer.charAt(0)}
                      </AvatarFallback>
                    </Avatar>
                    <div>
                      <p className="font-medium text-gray-900 dark:text-white">
                        {order.drink}
                      </p>
                      <p className="text-sm text-gray-600 dark:text-gray-400">
                        {order.customer} • {order.notes}
                      </p>
                      <p className="text-xs text-gray-500 dark:text-gray-400">
                        {order.time}
                      </p>
                    </div>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Badge
                      variant={
                        order.status === "completed" ? "secondary" : "default"
                      }
                      className={
                        order.status === "completed"
                          ? "bg-green-100 text-green-800"
                          : "bg-brand-blue text-white"
                      }
                    >
                      {order.status === "completed" ? (
                        <>
                          <CheckCircle className="w-3 h-3 mr-1" />
                          Ready
                        </>
                      ) : (
                        "Brewing"
                      )}
                    </Badge>
                    <span className="font-medium text-green-600">
                      {order.amount}
                    </span>
                  </div>
                </div>
              ))}
            </div>
            <Button variant="outline" className="w-full mt-4">
              View All Orders
            </Button>
          </CardContent>
        </Card>

        {/* Upcoming Events */}
        <Card>
          <CardHeader>
            <CardTitle>Upcoming Events</CardTitle>
            <CardDescription>Your scheduled coffee services</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {upcomingEvents.map((event) => (
                <div
                  key={event.id}
                  className="p-4 rounded-lg border bg-gradient-to-r from-brand-blue/5 to-brand-purple/5 dark:from-brand-blue/10 dark:to-brand-purple/10 border-brand-blue/20 dark:border-brand-blue/30"
                >
                  <div className="flex items-center justify-between mb-2">
                    <h3 className="font-medium text-gray-900 dark:text-white">
                      {event.name}
                    </h3>
                    <Badge className="bg-brand-success/10 text-brand-success border-brand-success/20">
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
                      Menu QR
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
            Common tasks to manage your barista business
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <Link to="/create-event">
              <Button variant="outline" className="p-6 h-auto flex-col w-full">
                <Plus className="w-6 h-6 mb-2" />
                <span className="font-medium">Create New Event</span>
                <span className="text-xs text-gray-500 dark:text-gray-400">
                  Set up coffee service for an event
                </span>
              </Button>
            </Link>
            <Link to="/menu">
              <Button variant="outline" className="p-6 h-auto flex-col w-full">
                <Package className="w-6 h-6 mb-2" />
                <span className="font-medium">Manage Menu</span>
                <span className="text-xs text-gray-500 dark:text-gray-400">
                  Update drinks and pricing
                </span>
              </Button>
            </Link>
            <Link to="/analytics">
              <Button variant="outline" className="p-6 h-auto flex-col w-full">
                <TrendingUp className="w-6 h-6 mb-2" />
                <span className="font-medium">View Analytics</span>
                <span className="text-xs text-gray-500 dark:text-gray-400">
                  Track sales and popular drinks
                </span>
              </Button>
            </Link>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
