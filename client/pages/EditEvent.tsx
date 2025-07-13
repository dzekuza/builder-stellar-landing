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
import { ArrowLeft, Save, Trash2 } from "lucide-react";
import { Link } from "react-router-dom";

export default function EditEvent() {
  const { eventId } = useParams();

  return (
    <Layout>
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
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
              <h1 className="text-3xl font-bold text-gray-900">Edit Event</h1>
              <p className="text-gray-600">Event ID: {eventId}</p>
            </div>
          </div>
          <div className="flex space-x-2">
            <Button variant="outline">
              <Trash2 className="w-4 h-4 mr-2" />
              Delete Event
            </Button>
            <Button className="bg-gradient-to-r from-brand-purple to-brand-blue">
              <Save className="w-4 h-4 mr-2" />
              Save Changes
            </Button>
          </div>
        </div>

        {/* Edit Form */}
        <Card>
          <CardHeader>
            <CardTitle>Event Details</CardTitle>
            <CardDescription>
              Update your event information and settings
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="p-8 text-center text-gray-500">
              <h3 className="text-lg font-medium mb-2">
                Edit Event Form Coming Soon
              </h3>
              <p>
                This page will contain the full event editing functionality. For
                now, you can navigate back to events or create a new event.
              </p>
              <div className="mt-6 space-x-4">
                <Link to="/events">
                  <Button variant="outline">Back to Events</Button>
                </Link>
                <Link to="/create-event">
                  <Button>Create New Event</Button>
                </Link>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </Layout>
  );
}
