import { useParams } from "react-router-dom";
import { Layout } from "@/components/Layout";
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

  // Mock live event data
  const liveEvent = {
    id: eventId,
    name: "Saturday Night Vibes",
    venue: "Blue Moon Bar",
    status: "live",
    startTime: "21:00",
    currentAttendees: 120,
    totalEarnings: 450,
    recentRequests: [
      {
        id: 1,
        song: "Bohemian Rhapsody",
        requester: "Sarah M.",
        time: "2m ago",
      },
      {
        id: 2,
        song: "Sweet Child O' Mine",
        requester: "Mike R.",
        time: "5m ago",
      },
      {
        id: 3,
        song: "Hotel California",
        requester: "Jessica K.",
        time: "8m ago",
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
                <h1 className="text-3xl font-bold text-gray-900">
                  {liveEvent.name}
                </h1>
                <Badge className="bg-green-100 text-green-800 animate-pulse">
                  <div className="w-2 h-2 bg-green-500 rounded-full mr-1" />
                  LIVE
                </Badge>
              </div>
              <p className="text-gray-600">{liveEvent.venue}</p>
            </div>
          </div>
          <Button variant="outline">
            <RefreshCw className="w-4 h-4 mr-2" />
            Refresh Data
          </Button>
        </div>

        {/* Live Stats */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">Live Now</p>
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
                  <p className="text-sm font-medium text-gray-600">
                    Live Earnings
                  </p>
                  <p className="text-2xl font-bold text-gray-900">
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
                  <p className="text-sm font-medium text-gray-600">
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
                  <p className="text-sm font-medium text-gray-600">
                    Event Status
                  </p>
                  <p className="text-sm font-bold text-green-600">ACTIVE</p>
                </div>
                <Activity className="h-8 w-8 text-green-600" />
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Live Activity */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
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
                    className="flex items-center justify-between p-3 bg-gray-50 rounded-lg"
                  >
                    <div>
                      <p className="font-medium">{request.song}</p>
                      <p className="text-sm text-gray-500">
                        Requested by {request.requester}
                      </p>
                    </div>
                    <span className="text-xs text-gray-400">
                      {request.time}
                    </span>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Event Controls</CardTitle>
              <CardDescription>Manage your live event</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <Button className="w-full bg-gradient-to-r from-brand-purple to-brand-blue">
                View QR Code
              </Button>
              <Button variant="outline" className="w-full">
                Manage Song Queue
              </Button>
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
