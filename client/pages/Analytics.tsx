import { Layout } from "@/components/Layout";
import { useAuth } from "@/contexts/AuthContext";
import { useState, useEffect } from "react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import {
  BarChart3,
  TrendingUp,
  TrendingDown,
  DollarSign,
  Users,
  Calendar,
  Music,
  Coffee,
  Star,
  Clock,
} from "lucide-react";
import { Loading } from "@/components/Loading";
import { Button } from "@/components/ui/button";

interface AnalyticsData {
  earningsData: Array<{
    date: string;
    earnings: number;
  }>;
  topItems: Array<{
    name: string;
    count: number;
    earnings: number;
  }>;
}

export default function Analytics() {
  const { user } = useAuth();
  const [analyticsData, setAnalyticsData] = useState<AnalyticsData | null>(
    null,
  );
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [timeframe, setTimeframe] = useState("month");

  useEffect(() => {
    const fetchAnalyticsData = async () => {
      try {
        const token = localStorage.getItem("eventflow_token");
        if (!token) {
          throw new Error("No authentication token found");
        }

        const response = await fetch(`/api/analytics?timeframe=${timeframe}`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }

        const data = await response.json();
        setAnalyticsData(data);
      } catch (err) {
        console.error("Failed to fetch analytics data:", err);
        setError(
          err instanceof Error ? err.message : "Failed to load analytics data",
        );
      } finally {
        setLoading(false);
      }
    };

    if (user) {
      fetchAnalyticsData();
    }
  }, [user, timeframe]);

  if (!user) {
    return null;
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
              Error Loading Analytics
            </h2>
            <p className="text-gray-600 dark:text-gray-400 mb-4">{error}</p>
            <Button onClick={() => window.location.reload()}>Try Again</Button>
          </div>
        </div>
      </Layout>
    );
  }

  // Calculate totals from analytics data
  const totalEarnings =
    analyticsData?.earningsData.reduce((sum, item) => sum + item.earnings, 0) ||
    0;
  const totalItems =
    analyticsData?.topItems.reduce((sum, item) => sum + item.count, 0) || 0;

  const djAnalytics = {
    overview: {
      totalEarnings: 3247,
      totalRequests: 156,
      eventsPlayed: 12,
      avgRating: 4.8,
    },
    monthlyData: [
      { month: "Jan", earnings: 450, requests: 23 },
      { month: "Feb", earnings: 680, requests: 31 },
      { month: "Mar", earnings: 520, requests: 28 },
      { month: "Apr", earnings: 720, requests: 35 },
      { month: "May", earnings: 877, requests: 39 },
    ],
    topSongs: [
      { song: "Bohemian Rhapsody", artist: "Queen", requests: 18 },
      { song: "Sweet Child O' Mine", artist: "Guns N' Roses", requests: 15 },
      { song: "Hotel California", artist: "Eagles", requests: 12 },
      { song: "Don't Stop Believin'", artist: "Journey", requests: 11 },
    ],
  };

  const baristaAnalytics = {
    overview: {
      totalEarnings: 2184,
      totalOrders: 89,
      eventsServed: 8,
      avgRating: 4.6,
    },
    monthlyData: [
      { month: "Jan", earnings: 320, orders: 15 },
      { month: "Feb", earnings: 445, orders: 18 },
      { month: "Mar", earnings: 380, orders: 16 },
      { month: "Apr", earnings: 520, orders: 21 },
      { month: "May", earnings: 519, orders: 19 },
    ],
    topDrinks: [
      { drink: "Caramel Macchiato", orders: 28 },
      { drink: "Iced Americano", orders: 24 },
      { drink: "Vanilla Latte", orders: 19 },
      { drink: "Cappuccino", orders: 18 },
    ],
  };

  const companyAnalytics = {
    overview: {
      totalRevenue: 12347,
      activeEvents: 8,
      teamMembers: 24,
      avgEventRating: 4.7,
    },
    monthlyData: [
      { month: "Jan", revenue: 1820, events: 5 },
      { month: "Feb", revenue: 2340, events: 7 },
      { month: "Mar", revenue: 2100, events: 6 },
      { month: "Apr", revenue: 2890, events: 9 },
      { month: "May", revenue: 3197, events: 8 },
    ],
    topPerformers: [
      { name: "DJ Alex", role: "DJ", revenue: 3250, rating: 4.9 },
      { name: "Sarah Barista", role: "Barista", revenue: 2100, rating: 4.8 },
      { name: "Mike Host", role: "Host", revenue: 1800, rating: 4.7 },
    ],
  };

  const getAnalyticsData = () => {
    switch (user?.role) {
      case "DJ":
        return djAnalytics;
      case "BARISTA":
        return baristaAnalytics;
      case "COMPANY":
        return companyAnalytics;
      default:
        return djAnalytics;
    }
  };

  const data = getAnalyticsData();

  const renderDJAnalytics = () => (
    <>
      {/* Overview Stats */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">
                  Total Earnings
                </p>
                <p className="text-2xl font-bold text-gray-900">
                  ${djAnalytics.overview.totalEarnings}
                </p>
                <p className="text-sm text-green-600 font-medium">
                  <TrendingUp className="w-3 h-3 inline mr-1" />
                  +18% vs last month
                </p>
              </div>
              <DollarSign className="h-8 w-8 text-green-600" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">
                  Song Requests
                </p>
                <p className="text-2xl font-bold text-gray-900">
                  {djAnalytics.overview.totalRequests}
                </p>
                <p className="text-sm text-green-600 font-medium">
                  <TrendingUp className="w-3 h-3 inline mr-1" />
                  +12% vs last month
                </p>
              </div>
              <Music className="h-8 w-8 text-brand-purple" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">
                  Events Played
                </p>
                <p className="text-2xl font-bold text-gray-900">
                  {djAnalytics.overview.eventsPlayed}
                </p>
                <p className="text-sm text-green-600 font-medium">
                  <TrendingUp className="w-3 h-3 inline mr-1" />
                  +2 vs last month
                </p>
              </div>
              <Calendar className="h-8 w-8 text-brand-blue" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Avg Rating</p>
                <p className="text-2xl font-bold text-gray-900">
                  {djAnalytics.overview.avgRating}⭐
                </p>
                <p className="text-sm text-green-600 font-medium">
                  <TrendingUp className="w-3 h-3 inline mr-1" />
                  +0.2 vs last month
                </p>
              </div>
              <Star className="h-8 w-8 text-yellow-500" />
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Charts and Details */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        <Card>
          <CardHeader>
            <CardTitle>Most Requested Songs</CardTitle>
            <CardDescription>Top tracks requested this month</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {djAnalytics.topSongs.map((song, index) => (
                <div key={index} className="flex items-center justify-between">
                  <div className="flex items-center space-x-3">
                    <div className="w-8 h-8 bg-brand-purple/10 rounded-full flex items-center justify-center">
                      <span className="text-sm font-medium text-brand-purple">
                        {index + 1}
                      </span>
                    </div>
                    <div>
                      <p className="font-medium">{song.song}</p>
                      <p className="text-sm text-gray-500">{song.artist}</p>
                    </div>
                  </div>
                  <Badge variant="secondary">{song.requests} requests</Badge>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Monthly Performance</CardTitle>
            <CardDescription>Earnings and requests over time</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {djAnalytics.monthlyData.map((month, index) => (
                <div key={index} className="flex items-center justify-between">
                  <span className="font-medium">{month.month}</span>
                  <div className="flex items-center space-x-4">
                    <span className="text-green-600 font-medium">
                      ${month.earnings}
                    </span>
                    <Badge variant="outline">{month.requests} requests</Badge>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    </>
  );

  const renderBaristaAnalytics = () => (
    <>
      {/* Overview Stats */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">
                  Total Earnings
                </p>
                <p className="text-2xl font-bold text-gray-900">
                  ${baristaAnalytics.overview.totalEarnings}
                </p>
                <p className="text-sm text-green-600 font-medium">
                  <TrendingUp className="w-3 h-3 inline mr-1" />
                  +15% vs last month
                </p>
              </div>
              <DollarSign className="h-8 w-8 text-green-600" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">
                  Total Orders
                </p>
                <p className="text-2xl font-bold text-gray-900">
                  {baristaAnalytics.overview.totalOrders}
                </p>
                <p className="text-sm text-green-600 font-medium">
                  <TrendingUp className="w-3 h-3 inline mr-1" />
                  +8% vs last month
                </p>
              </div>
              <Coffee className="h-8 w-8 text-brand-blue" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">
                  Events Served
                </p>
                <p className="text-2xl font-bold text-gray-900">
                  {baristaAnalytics.overview.eventsServed}
                </p>
                <p className="text-sm text-green-600 font-medium">
                  <TrendingUp className="w-3 h-3 inline mr-1" />
                  +1 vs last month
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
                <p className="text-sm font-medium text-gray-600">Avg Rating</p>
                <p className="text-2xl font-bold text-gray-900">
                  {baristaAnalytics.overview.avgRating}⭐
                </p>
                <p className="text-sm text-green-600 font-medium">
                  <TrendingUp className="w-3 h-3 inline mr-1" />
                  +0.1 vs last month
                </p>
              </div>
              <Star className="h-8 w-8 text-yellow-500" />
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Charts and Details */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        <Card>
          <CardHeader>
            <CardTitle>Popular Drinks</CardTitle>
            <CardDescription>Most ordered drinks this month</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {baristaAnalytics.topDrinks.map((drink, index) => (
                <div key={index} className="flex items-center justify-between">
                  <div className="flex items-center space-x-3">
                    <div className="w-8 h-8 bg-brand-blue/10 rounded-full flex items-center justify-center">
                      <span className="text-sm font-medium text-brand-blue">
                        {index + 1}
                      </span>
                    </div>
                    <p className="font-medium">{drink.drink}</p>
                  </div>
                  <Badge variant="secondary">{drink.orders} orders</Badge>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Monthly Performance</CardTitle>
            <CardDescription>Earnings and orders over time</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {baristaAnalytics.monthlyData.map((month, index) => (
                <div key={index} className="flex items-center justify-between">
                  <span className="font-medium">{month.month}</span>
                  <div className="flex items-center space-x-4">
                    <span className="text-green-600 font-medium">
                      ${month.earnings}
                    </span>
                    <Badge variant="outline">{month.orders} orders</Badge>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    </>
  );

  const renderCompanyAnalytics = () => (
    <>
      {/* Overview Stats */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">
                  Total Revenue
                </p>
                <p className="text-2xl font-bold text-gray-900">
                  ${companyAnalytics.overview.totalRevenue}
                </p>
                <p className="text-sm text-green-600 font-medium">
                  <TrendingUp className="w-3 h-3 inline mr-1" />
                  +22% vs last month
                </p>
              </div>
              <DollarSign className="h-8 w-8 text-green-600" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">
                  Active Events
                </p>
                <p className="text-2xl font-bold text-gray-900">
                  {companyAnalytics.overview.activeEvents}
                </p>
                <p className="text-sm text-green-600 font-medium">
                  <TrendingUp className="w-3 h-3 inline mr-1" />
                  +3 vs last month
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
                <p className="text-sm font-medium text-gray-600">
                  Team Members
                </p>
                <p className="text-2xl font-bold text-gray-900">
                  {companyAnalytics.overview.teamMembers}
                </p>
                <p className="text-sm text-green-600 font-medium">
                  <TrendingUp className="w-3 h-3 inline mr-1" />
                  +2 vs last month
                </p>
              </div>
              <Users className="h-8 w-8 text-brand-blue" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Avg Rating</p>
                <p className="text-2xl font-bold text-gray-900">
                  {companyAnalytics.overview.avgEventRating}⭐
                </p>
                <p className="text-sm text-green-600 font-medium">
                  <TrendingUp className="w-3 h-3 inline mr-1" />
                  +0.3 vs last month
                </p>
              </div>
              <Star className="h-8 w-8 text-yellow-500" />
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Charts and Details */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        <Card>
          <CardHeader>
            <CardTitle>Top Performers</CardTitle>
            <CardDescription>Highest performing team members</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {companyAnalytics.topPerformers.map((performer, index) => (
                <div key={index} className="flex items-center justify-between">
                  <div className="flex items-center space-x-3">
                    <div className="w-8 h-8 bg-gradient-to-br from-brand-purple to-brand-blue rounded-full flex items-center justify-center">
                      <span className="text-sm font-medium text-white">
                        {index + 1}
                      </span>
                    </div>
                    <div>
                      <p className="font-medium">{performer.name}</p>
                      <p className="text-sm text-gray-500">{performer.role}</p>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className="font-medium text-green-600">
                      ${performer.revenue}
                    </p>
                    <p className="text-sm text-gray-500">
                      ⭐ {performer.rating}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Monthly Revenue</CardTitle>
            <CardDescription>Company revenue over time</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {companyAnalytics.monthlyData.map((month, index) => (
                <div key={index} className="flex items-center justify-between">
                  <span className="font-medium">{month.month}</span>
                  <div className="flex items-center space-x-4">
                    <span className="text-green-600 font-medium">
                      ${month.revenue}
                    </span>
                    <Badge variant="outline">{month.events} events</Badge>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    </>
  );

  const renderAnalytics = () => {
    switch (user?.role) {
      case "DJ":
        return renderDJAnalytics();
      case "BARISTA":
        return renderBaristaAnalytics();
      case "COMPANY":
        return renderCompanyAnalytics();
      default:
        return renderDJAnalytics();
    }
  };

  return (
    <Layout>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Analytics</h1>
            <p className="text-gray-600 mt-1">
              Track your performance and insights
            </p>
          </div>
          <Select defaultValue="month">
            <SelectTrigger className="w-[180px]">
              <SelectValue placeholder="Select period" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="week">This Week</SelectItem>
              <SelectItem value="month">This Month</SelectItem>
              <SelectItem value="quarter">This Quarter</SelectItem>
              <SelectItem value="year">This Year</SelectItem>
            </SelectContent>
          </Select>
        </div>

        {renderAnalytics()}
      </div>
    </Layout>
  );
}
