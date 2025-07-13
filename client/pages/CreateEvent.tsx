import { useState } from "react";
import { Layout } from "@/components/Layout";
import { useAuth } from "@/contexts/AuthContext";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
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
import { Switch } from "@/components/ui/switch";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import {
  Calendar,
  Clock,
  MapPin,
  DollarSign,
  QrCode,
  Music,
  Coffee,
  Users,
  Building2,
  CheckCircle,
} from "lucide-react";

export default function CreateEvent() {
  const { user } = useAuth();
  const [eventData, setEventData] = useState({
    name: "",
    description: "",
    venue: "",
    date: "",
    time: "",
    // DJ specific
    songRequestPrice: 0,
    allowFreeRequests: true,
    // Barista specific
    selectedDrinks: [] as string[],
    // Company specific
    assignedStaff: {
      dj: "",
      barista: "",
      host: "",
    },
  });

  const [isCreating, setIsCreating] = useState(false);
  const [eventCreated, setEventCreated] = useState(false);

  // Mock data for company staff
  const companyStaff = {
    dj: [
      { id: "1", name: "DJ Alex" },
      { id: "2", name: "DJ Emma" },
      { id: "3", name: "DJ Mike" },
    ],
    barista: [
      { id: "1", name: "Sarah Coffee" },
      { id: "2", name: "Tom Beans" },
      { id: "3", name: "Lisa Brew" },
    ],
    host: [
      { id: "1", name: "Mike Host" },
      { id: "2", name: "Anna Events" },
      { id: "3", name: "Chris Coord" },
    ],
  };

  // Mock drinks for barista
  const availableDrinks = [
    "Caramel Macchiato",
    "Iced Americano",
    "Vanilla Latte",
    "Cappuccino",
    "Mocha",
    "Flat White",
    "Cold Brew",
    "Espresso",
  ];

  const handleInputChange = (
    field: string,
    value: string | number | boolean,
  ) => {
    setEventData((prev) => ({
      ...prev,
      [field]: value,
    }));
  };

  const handleStaffAssignment = (role: string, staffId: string) => {
    setEventData((prev) => ({
      ...prev,
      assignedStaff: {
        ...prev.assignedStaff,
        [role]: staffId,
      },
    }));
  };

  const handleDrinkSelection = (drink: string) => {
    setEventData((prev) => ({
      ...prev,
      selectedDrinks: prev.selectedDrinks.includes(drink)
        ? prev.selectedDrinks.filter((d) => d !== drink)
        : [...prev.selectedDrinks, drink],
    }));
  };

  const handleCreateEvent = async () => {
    setIsCreating(true);
    // Simulate API call
    await new Promise((resolve) => setTimeout(resolve, 2000));
    setIsCreating(false);
    setEventCreated(true);
  };

  if (eventCreated) {
    return (
      <Layout>
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <Card className="text-center">
            <CardContent className="p-8">
              <div className="flex justify-center mb-6">
                <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center">
                  <CheckCircle className="w-8 h-8 text-green-600" />
                </div>
              </div>
              <h2 className="text-2xl font-bold mb-4">
                Event Created Successfully!
              </h2>
              <p className="text-gray-600 mb-6">
                Your event "{eventData.name}" has been created and is ready to
                go.
              </p>
              <div className="flex justify-center space-x-4">
                <Button className="bg-gradient-to-r from-brand-purple to-brand-blue">
                  <QrCode className="w-4 h-4 mr-2" />
                  Generate QR Code
                </Button>
                <Button
                  variant="outline"
                  onClick={() => setEventCreated(false)}
                >
                  Create Another Event
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      </Layout>
    );
  }

  const getRoleIcon = () => {
    switch (user?.role) {
      case "DJ":
        return Music;
      case "BARISTA":
        return Coffee;
      case "HOST":
        return Users;
      case "COMPANY":
        return Building2;
      default:
        return Calendar;
    }
  };

  const RoleIcon = getRoleIcon();

  return (
    <Layout>
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="mb-8">
          <div className="flex items-center space-x-3 mb-4">
            <div className="w-12 h-12 bg-gradient-to-br from-brand-purple to-brand-blue rounded-lg flex items-center justify-center">
              <RoleIcon className="w-6 h-6 text-white" />
            </div>
            <div>
              <h1 className="text-3xl font-bold text-gray-900">
                Create New Event
              </h1>
              <p className="text-gray-600">
                Set up your {user?.role === "COMPANY" ? "team's" : ""} event
                details
              </p>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Main Form */}
          <div className="lg:col-span-2 space-y-6">
            {/* Basic Information */}
            <Card>
              <CardHeader>
                <CardTitle>Event Details</CardTitle>
                <CardDescription>
                  Basic information about your event
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="name">Event Name</Label>
                  <Input
                    id="name"
                    value={eventData.name}
                    onChange={(e) => handleInputChange("name", e.target.value)}
                    placeholder="e.g., Saturday Night Vibes"
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="description">Description</Label>
                  <Textarea
                    id="description"
                    value={eventData.description}
                    onChange={(e) =>
                      handleInputChange("description", e.target.value)
                    }
                    placeholder="Describe your event..."
                    rows={3}
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="venue">Venue/Location</Label>
                  <Input
                    id="venue"
                    value={eventData.venue}
                    onChange={(e) => handleInputChange("venue", e.target.value)}
                    placeholder="e.g., Blue Moon Bar"
                  />
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="date">Date</Label>
                    <Input
                      id="date"
                      type="date"
                      value={eventData.date}
                      onChange={(e) =>
                        handleInputChange("date", e.target.value)
                      }
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="time">Time</Label>
                    <Input
                      id="time"
                      type="time"
                      value={eventData.time}
                      onChange={(e) =>
                        handleInputChange("time", e.target.value)
                      }
                    />
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Role-specific settings */}
            {user?.role === "DJ" && (
              <Card>
                <CardHeader>
                  <CardTitle>DJ Settings</CardTitle>
                  <CardDescription>
                    Configure song request preferences
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="flex items-center justify-between">
                    <div className="space-y-0.5">
                      <Label>Allow Free Requests</Label>
                      <p className="text-sm text-gray-500">
                        Let people request songs for free
                      </p>
                    </div>
                    <Switch
                      checked={eventData.allowFreeRequests}
                      onCheckedChange={(checked) =>
                        handleInputChange("allowFreeRequests", checked)
                      }
                    />
                  </div>

                  {!eventData.allowFreeRequests && (
                    <div className="space-y-2">
                      <Label htmlFor="songRequestPrice">
                        Song Request Price ($)
                      </Label>
                      <Input
                        id="songRequestPrice"
                        type="number"
                        step="0.50"
                        value={eventData.songRequestPrice}
                        onChange={(e) =>
                          handleInputChange(
                            "songRequestPrice",
                            parseFloat(e.target.value),
                          )
                        }
                        placeholder="5.00"
                      />
                    </div>
                  )}
                </CardContent>
              </Card>
            )}

            {user?.role === "barista" && (
              <Card>
                <CardHeader>
                  <CardTitle>Menu Selection</CardTitle>
                  <CardDescription>
                    Choose drinks to offer at this event
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-2 gap-3">
                    {availableDrinks.map((drink) => (
                      <div
                        key={drink}
                        className={`p-3 rounded-lg border cursor-pointer transition-all ${
                          eventData.selectedDrinks.includes(drink)
                            ? "border-brand-blue bg-brand-blue/5"
                            : "border-gray-200 hover:border-brand-blue/50"
                        }`}
                        onClick={() => handleDrinkSelection(drink)}
                      >
                        <div className="flex items-center justify-between">
                          <span className="font-medium">{drink}</span>
                          {eventData.selectedDrinks.includes(drink) && (
                            <CheckCircle className="w-4 h-4 text-brand-blue" />
                          )}
                        </div>
                      </div>
                    ))}
                  </div>
                  <p className="text-sm text-gray-500 mt-3">
                    Selected: {eventData.selectedDrinks.length} drinks
                  </p>
                </CardContent>
              </Card>
            )}

            {user?.role === "company" && (
              <Card>
                <CardHeader>
                  <CardTitle>Staff Assignment</CardTitle>
                  <CardDescription>
                    Assign team members to this event
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="space-y-2">
                    <Label>DJ</Label>
                    <Select
                      value={eventData.assignedStaff.dj}
                      onValueChange={(value) =>
                        handleStaffAssignment("dj", value)
                      }
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Select DJ" />
                      </SelectTrigger>
                      <SelectContent>
                        {companyStaff.dj.map((staff) => (
                          <SelectItem key={staff.id} value={staff.id}>
                            {staff.name}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>

                  <div className="space-y-2">
                    <Label>Barista</Label>
                    <Select
                      value={eventData.assignedStaff.barista}
                      onValueChange={(value) =>
                        handleStaffAssignment("barista", value)
                      }
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Select Barista" />
                      </SelectTrigger>
                      <SelectContent>
                        {companyStaff.barista.map((staff) => (
                          <SelectItem key={staff.id} value={staff.id}>
                            {staff.name}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>

                  <div className="space-y-2">
                    <Label>Host</Label>
                    <Select
                      value={eventData.assignedStaff.host}
                      onValueChange={(value) =>
                        handleStaffAssignment("host", value)
                      }
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Select Host" />
                      </SelectTrigger>
                      <SelectContent>
                        {companyStaff.host.map((staff) => (
                          <SelectItem key={staff.id} value={staff.id}>
                            {staff.name}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                </CardContent>
              </Card>
            )}
          </div>

          {/* Preview/Summary */}
          <div className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Event Preview</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <div className="space-y-2">
                  <h3 className="font-semibold">
                    {eventData.name || "Event Name"}
                  </h3>
                  <p className="text-sm text-gray-600">
                    {eventData.description || "Event description"}
                  </p>
                </div>

                <Separator />

                <div className="space-y-2 text-sm">
                  <div className="flex items-center space-x-2">
                    <MapPin className="w-4 h-4 text-gray-400" />
                    <span>{eventData.venue || "Venue TBD"}</span>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Calendar className="w-4 h-4 text-gray-400" />
                    <span>{eventData.date || "Date TBD"}</span>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Clock className="w-4 h-4 text-gray-400" />
                    <span>{eventData.time || "Time TBD"}</span>
                  </div>
                </div>

                <Separator />

                {user?.role === "DJ" && (
                  <div className="space-y-1">
                    <p className="text-sm font-medium">Song Requests:</p>
                    <Badge
                      variant={
                        eventData.allowFreeRequests ? "secondary" : "default"
                      }
                    >
                      {eventData.allowFreeRequests
                        ? "Free"
                        : `$${eventData.songRequestPrice.toFixed(2)}`}
                    </Badge>
                  </div>
                )}

                {user?.role === "barista" && (
                  <div className="space-y-1">
                    <p className="text-sm font-medium">Menu Items:</p>
                    <p className="text-xs text-gray-500">
                      {eventData.selectedDrinks.length} drinks selected
                    </p>
                  </div>
                )}
              </CardContent>
            </Card>

            <Button
              onClick={handleCreateEvent}
              disabled={!eventData.name || !eventData.venue || isCreating}
              className="w-full bg-gradient-to-r from-brand-purple to-brand-blue"
              size="lg"
            >
              {isCreating ? "Creating Event..." : "Create Event"}
            </Button>
          </div>
        </div>
      </div>
    </Layout>
  );
}
