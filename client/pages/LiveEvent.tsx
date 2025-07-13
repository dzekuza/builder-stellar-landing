import { useParams } from "react-router-dom";
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
import {
  Eye,
  Users,
  DollarSign,
  Music,
  Coffee,
  Activity,
  RefreshCw,
  ArrowLeft,
} from "lucide-react";
import { Link } from "react-router-dom";

export default function LiveEvent() {
  const { eventId } = useParams();
  const { user } = useAuth();

  // Mock live event data
  const liveEvent = {
    id: eventId,
    name: "Saturday Night Vibes",
    venue: "Blue Moon Bar",
    status: "live",
    startTime: "21:00",
    currentAttendees: 120,
    totalEarnings: 450,
    djEarnings: 280,
    baristaEarnings: 170,
    recentRequests: [
      {
        id: 1,
        song: "Bohemian Rhapsody",
        requester: "Sarah M.",
        time: "2m ago",
        amount: "$5.00",
      },
      {
        id: 2,
        song: "Sweet Child O' Mine",
        requester: "Mike R.",
        time: "5m ago",
        amount: "$3.00",
      },
      {
        id: 3,
        song: "Hotel California",
        requester: "Jessica K.",
        time: "8m ago",
        amount: "$5.00",
      },
    ],
    recentOrders: [
      {
        id: 1,
        drink: "Caramel Macchiato",
        customer: "Emma K.",
        time: "1m ago",
        amount: "$6.50",
        status: "preparing",
      },
      {
        id: 2,
        drink: "Iced Americano",
        customer: "James R.",
        time: "4m ago",
        amount: "$4.00",
        status: "completed",
      },
      {
        id: 3,
        drink: "Vanilla Latte",
        customer: "Sophie M.",
        time: "7m ago",
        amount: "$5.50",
        status: "preparing",
      },
    ],
  };

  return (
    <Layout>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <div className="flex items-center space-x-4">
            <Link to="/events">
              <Button variant="outline" size="sm">
                <ArrowLeft className="w-4 h-4 mr-2" />
                Back to Events
              </Button>
            </Link>
            <div>
              <div className="flex items-center space-x-3 mb-2">
                <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
                  {liveEvent.name}
                </h1>
                <Badge className="bg-green-100 text-green-800 animate-pulse">
                  <div className="w-2 h-2 bg-green-500 rounded-full mr-1" />
                  LIVE
                </Badge>
              </div>
              <p className="text-gray-600 dark:text-gray-400">
                {liveEvent.venue}
              </p>
            </div>
          </div>
          <Button variant="outline">
            <RefreshCw className="w-4 h-4 mr-2" />
            Refresh Data
          </Button>
        </div>

        {/* Live Stats - Role Based */}
        {user?.role === "DJ" && (
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
            <Card>
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-gray-600 dark:text-gray-400">
                      Live Attendees
                    </p>
                    <p className="text-2xl font-bold text-green-600">
                      {liveEvent.currentAttendees}
                    </p>
                  </div>
                  <Users className="h-8 w-8 text-green-600" />
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-gray-600 dark:text-gray-400">
                      DJ Earnings
                    </p>
                    <p className="text-2xl font-bold text-gray-900 dark:text-white">
                      ${liveEvent.djEarnings}
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
                    <p className="text-sm font-medium text-gray-600 dark:text-gray-400">
                      Song Requests
                    </p>
                    <p className="text-2xl font-bold text-brand-purple">25</p>
                  </div>
                  <Music className="h-8 w-8 text-brand-purple" />
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-gray-600 dark:text-gray-400">
                      Event Status
                    </p>
                    <p className="text-sm font-bold text-green-600">ACTIVE</p>
                  </div>
                  <Activity className="h-8 w-8 text-green-600" />
                </div>
              </CardContent>
            </Card>
          </div>
        )}

        {user?.role === "BARISTA" && (
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
            <Card>
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-gray-600 dark:text-gray-400">
                      Live Customers
                    </p>
                    <p className="text-2xl font-bold text-green-600">
                      {liveEvent.currentAttendees}
                    </p>
                  </div>
                  <Users className="h-8 w-8 text-green-600" />
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-gray-600 dark:text-gray-400">
                      Barista Earnings
                    </p>
                    <p className="text-2xl font-bold text-gray-900 dark:text-white">
                      ${liveEvent.baristaEarnings}
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
                    <p className="text-sm font-medium text-gray-600 dark:text-gray-400">
                      Drink Orders
                    </p>
                    <p className="text-2xl font-bold text-brand-blue">18</p>
                  </div>
                  <Coffee className="h-8 w-8 text-brand-blue" />
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-gray-600 dark:text-gray-400">
                      Service Status
                    </p>
                    <p className="text-sm font-bold text-green-600">ACTIVE</p>
                  </div>
                  <Activity className="h-8 w-8 text-green-600" />
                </div>
              </CardContent>
            </Card>
          </div>
        )}

        {user?.role === "COMPANY" && (
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
            <Card>
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-gray-600 dark:text-gray-400">
                      Total Attendees
                    </p>
                    <p className="text-2xl font-bold text-green-600">
                      {liveEvent.currentAttendees}
                    </p>
                  </div>
                  <Users className="h-8 w-8 text-green-600" />
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
                      ${liveEvent.totalEarnings}
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
                    <p className="text-sm font-medium text-gray-600 dark:text-gray-400">
                      Song Requests
                    </p>
                    <p className="text-2xl font-bold text-brand-purple">25</p>
                  </div>
                  <Music className="h-8 w-8 text-brand-purple" />
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-gray-600 dark:text-gray-400">
                      Drink Orders
                    </p>
                    <p className="text-2xl font-bold text-brand-blue">18</p>
                  </div>
                  <Coffee className="h-8 w-8 text-brand-blue" />
                </div>
              </CardContent>
            </Card>
          </div>
        )}

        {/* Live Activity - Role Based */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* DJ Role - Show Song Requests */}
          {user?.role === "DJ" && (
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center space-x-2">
                  <Music className="w-5 h-5 text-brand-purple" />
                  <span>Recent Song Requests</span>
                </CardTitle>
                <CardDescription>Live requests from attendees</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {liveEvent.recentRequests.map((request) => (
                    <div
                      key={request.id}
                      className="flex items-center justify-between p-3 bg-gray-50 dark:bg-gray-800 rounded-lg"
                    >
                      <div className="flex-1">
                        <p className="font-medium">{request.song}</p>
                        <p className="text-sm text-gray-500 dark:text-gray-400">
                          Requested by {request.requester}
                        </p>
                      </div>
                      <div className="text-right">
                        <p className="font-medium text-green-600">
                          {request.amount}
                        </p>
                        <span className="text-xs text-gray-400">
                          {request.time}
                        </span>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          )}

          {/* Barista Role - Show Drink Orders */}
          {user?.role === "BARISTA" && (
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center space-x-2">
                  <Coffee className="w-5 h-5 text-brand-blue" />
                  <span>Recent Drink Orders</span>
                </CardTitle>
                <CardDescription>Live orders from customers</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {liveEvent.recentOrders.map((order) => (
                    <div
                      key={order.id}
                      className="flex items-center justify-between p-3 bg-gray-50 dark:bg-gray-800 rounded-lg"
                    >
                      <div className="flex-1">
                        <p className="font-medium">{order.drink}</p>
                        <p className="text-sm text-gray-500 dark:text-gray-400">
                          Ordered by {order.customer}
                        </p>
                      </div>
                      <div className="text-right">
                        <p className="font-medium text-green-600">
                          {order.amount}
                        </p>
                        <div className="flex items-center space-x-2">
                          <span
                            className={`text-xs px-2 py-1 rounded-full ${
                              order.status === "completed"
                                ? "bg-green-100 text-green-800"
                                : "bg-yellow-100 text-yellow-800"
                            }`}
                          >
                            {order.status}
                          </span>
                          <span className="text-xs text-gray-400">
                            {order.time}
                          </span>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          )}

          {/* Company Role - Show Both */}
          {user?.role === "COMPANY" && (
            <>
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center space-x-2">
                    <Music className="w-5 h-5 text-brand-purple" />
                    <span>DJ Song Requests</span>
                  </CardTitle>
                  <CardDescription>
                    Live requests from attendees
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {liveEvent.recentRequests.slice(0, 3).map((request) => (
                      <div
                        key={request.id}
                        className="flex items-center justify-between p-3 bg-gray-50 dark:bg-gray-800 rounded-lg"
                      >
                        <div className="flex-1">
                          <p className="font-medium">{request.song}</p>
                          <p className="text-sm text-gray-500 dark:text-gray-400">
                            Requested by {request.requester}
                          </p>
                        </div>
                        <div className="text-right">
                          <p className="font-medium text-green-600">
                            {request.amount}
                          </p>
                          <span className="text-xs text-gray-400">
                            {request.time}
                          </span>
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center space-x-2">
                    <Coffee className="w-5 h-5 text-brand-blue" />
                    <span>Barista Orders</span>
                  </CardTitle>
                  <CardDescription>Live drink orders</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {liveEvent.recentOrders.slice(0, 3).map((order) => (
                      <div
                        key={order.id}
                        className="flex items-center justify-between p-3 bg-gray-50 dark:bg-gray-800 rounded-lg"
                      >
                        <div className="flex-1">
                          <p className="font-medium">{order.drink}</p>
                          <p className="text-sm text-gray-500 dark:text-gray-400">
                            Ordered by {order.customer}
                          </p>
                        </div>
                        <div className="text-right">
                          <p className="font-medium text-green-600">
                            {order.amount}
                          </p>
                          <div className="flex items-center space-x-2">
                            <span
                              className={`text-xs px-2 py-1 rounded-full ${
                                order.status === "completed"
                                  ? "bg-green-100 text-green-800"
                                  : "bg-yellow-100 text-yellow-800"
                              }`}
                            >
                              {order.status}
                            </span>
                            <span className="text-xs text-gray-400">
                              {order.time}
                            </span>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </>
          )}

          {/* Event Controls - Role Based */}
          <Card>
            <CardHeader>
              <CardTitle>Event Controls</CardTitle>
              <CardDescription>Manage your live event</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <Button className="w-full bg-gradient-to-r from-brand-purple to-brand-blue">
                View QR Code
              </Button>

              {/* DJ Controls */}
              {user?.role === "DJ" && (
                <>
                  <Button variant="outline" className="w-full">
                    Manage Song Queue
                  </Button>
                  <Button variant="outline" className="w-full">
                    Accept Song Requests
                  </Button>
                </>
              )}

              {/* Barista Controls */}
              {user?.role === "BARISTA" && (
                <>
                  <Button variant="outline" className="w-full">
                    Update Order Status
                  </Button>
                  <Button variant="outline" className="w-full">
                    Manage Menu
                  </Button>
                </>
              )}

              {/* Company Controls */}
              {user?.role === "COMPANY" && (
                <>
                  <Button variant="outline" className="w-full">
                    Manage Song Queue
                  </Button>
                  <Button variant="outline" className="w-full">
                    View All Orders
                  </Button>
                  <Button variant="outline" className="w-full">
                    Team Performance
                  </Button>
                </>
              )}

              <Button variant="outline" className="w-full">
                View Analytics
              </Button>
              <Button variant="destructive" className="w-full">
                End Event
              </Button>
            </CardContent>
          </Card>
        </div>
      </div>
    </Layout>
  );
}
