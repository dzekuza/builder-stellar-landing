import { useState, useEffect } from "react";
import { useSearchParams } from "react-router-dom";
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
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import {
  QrCode,
  Download,
  Copy,
  Share2,
  Music,
  Coffee,
  Users,
  ExternalLink,
  CheckCircle,
} from "lucide-react";

export default function QRGenerator() {
  const { user } = useAuth();
  const [searchParams] = useSearchParams();
  const [selectedEvent, setSelectedEvent] = useState("");
  const [qrGenerated, setQrGenerated] = useState(false);
  const [copied, setCopied] = useState(false);

  // Check for pre-selected event from URL parameters
  useEffect(() => {
    const eventParam = searchParams.get("event");
    if (eventParam) {
      setSelectedEvent(eventParam);
      setQrGenerated(true);
    }
  }, [searchParams]);

  // Mock events data
  const mockEvents = [
    {
      id: "1",
      name: "Saturday Night Vibes",
      venue: "Blue Moon Bar",
      date: "Dec 16, 2023",
      type: user?.role || "dj",
    },
    {
      id: "2",
      name: "Wedding Reception",
      venue: "Grand Hotel",
      date: "Dec 18, 2023",
      type: user?.role || "dj",
    },
    {
      id: "3",
      name: "Corporate Event",
      venue: "Tech Hub",
      date: "Dec 20, 2023",
      type: user?.role || "dj",
    },
  ];

  const generateQRCode = () => {
    setQrGenerated(true);
  };

  const copyToClipboard = async () => {
    const url = `https://eventflow.app/public/${selectedEvent}`;
    await navigator.clipboard.writeText(url);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const downloadQR = () => {
    // In a real app, this would generate and download the actual QR code
    const link = document.createElement("a");
    link.download = `eventflow-qr-${selectedEvent}.png`;
    link.href =
      "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVR42mNkYPhfDwAChwGA60e6kgAAAABJRU5ErkJggg==";
    link.click();
  };

  const getEventTypeInfo = () => {
    switch (user?.role) {
      case "DJ":
        return {
          icon: Music,
          title: "Song Request QR Code",
          description: "Customers can scan to request songs",
          features: ["Song requests", "Payment processing", "Live updates"],
          color: "from-brand-purple to-brand-purple-dark",
        };
      case "BARISTA":
        return {
          icon: Coffee,
          title: "Menu QR Code",
          description: "Customers can scan to order drinks",
          features: ["Digital menu", "Order placement", "Payment processing"],
          color: "from-brand-blue to-brand-blue-dark",
        };
      case "HOST":
        return {
          icon: Users,
          title: "Event QR Code",
          description: "Guests can scan for event information",
          features: ["Event details", "Schedule", "Contact info"],
          color: "from-brand-success to-green-600",
        };
      default:
        return {
          icon: Music,
          title: "Event QR Code",
          description: "Customers can scan to interact",
          features: ["Event access", "Interactive features"],
          color: "from-brand-purple to-brand-blue",
        };
    }
  };

  const typeInfo = getEventTypeInfo();
  const TypeIcon = typeInfo.icon;

  return (
    <Layout>
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="mb-8">
          <div className="flex items-center space-x-3 mb-4">
            <div
              className={`w-12 h-12 bg-gradient-to-br ${typeInfo.color} rounded-lg flex items-center justify-center`}
            >
              <QrCode className="w-6 h-6 text-white" />
            </div>
            <div>
              <h1 className="text-3xl font-bold text-gray-900">
                QR Code Generator
              </h1>
              <p className="text-gray-600">Generate QR codes for your events</p>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* QR Code Generator */}
          <div className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center space-x-2">
                  <TypeIcon className="w-5 h-5" />
                  <span>{typeInfo.title}</span>
                </CardTitle>
                <CardDescription>{typeInfo.description}</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <label className="text-sm font-medium">Select Event</label>
                  <Select
                    value={selectedEvent}
                    onValueChange={setSelectedEvent}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Choose an event" />
                    </SelectTrigger>
                    <SelectContent>
                      {mockEvents.map((event) => (
                        <SelectItem key={event.id} value={event.id}>
                          <div>
                            <p className="font-medium">{event.name}</p>
                            <p className="text-xs text-gray-500">
                              {event.venue} • {event.date}
                            </p>
                          </div>
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                <Button
                  onClick={generateQRCode}
                  disabled={!selectedEvent}
                  className={`w-full bg-gradient-to-r ${typeInfo.color}`}
                >
                  <QrCode className="w-4 h-4 mr-2" />
                  Generate QR Code
                </Button>

                {/* Features List */}
                <div className="space-y-2">
                  <p className="text-sm font-medium text-gray-600">Features:</p>
                  <div className="space-y-1">
                    {typeInfo.features.map((feature, index) => (
                      <div key={index} className="flex items-center space-x-2">
                        <CheckCircle className="w-4 h-4 text-green-600" />
                        <span className="text-sm text-gray-600">{feature}</span>
                      </div>
                    ))}
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* QR Code Display */}
          <div className="space-y-6">
            {qrGenerated && selectedEvent ? (
              <Card>
                <CardHeader>
                  <CardTitle>Your QR Code</CardTitle>
                  <CardDescription>
                    {mockEvents.find((e) => e.id === selectedEvent)?.name}
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  {/* Mock QR Code */}
                  <div className="bg-white p-8 rounded-lg border-2 border-dashed border-gray-300 text-center">
                    <div className="w-48 h-48 mx-auto bg-gray-100 rounded-lg flex items-center justify-center">
                      <QrCode className="w-32 h-32 text-gray-400" />
                    </div>
                    <p className="text-sm text-gray-500 mt-4">
                      QR Code for event access
                    </p>
                  </div>

                  {/* Event URL */}
                  <div className="space-y-2">
                    <label className="text-sm font-medium">Event URL:</label>
                    <div className="flex items-center space-x-2">
                      <code className="flex-1 bg-gray-100 px-3 py-2 rounded text-sm">
                        https://eventflow.app/public/{selectedEvent}
                      </code>
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={copyToClipboard}
                      >
                        {copied ? (
                          <CheckCircle className="w-4 h-4" />
                        ) : (
                          <Copy className="w-4 h-4" />
                        )}
                      </Button>
                    </div>
                  </div>

                  <Separator />

                  {/* Action Buttons */}
                  <div className="grid grid-cols-2 gap-3">
                    <Button variant="outline" onClick={downloadQR}>
                      <Download className="w-4 h-4 mr-2" />
                      Download
                    </Button>
                    <Button variant="outline">
                      <Share2 className="w-4 h-4 mr-2" />
                      Share
                    </Button>
                  </div>

                  <Button
                    variant="outline"
                    className="w-full"
                    onClick={() =>
                      window.open(
                        `https://eventflow.app/public/${selectedEvent}`,
                        "_blank",
                      )
                    }
                  >
                    <ExternalLink className="w-4 h-4 mr-2" />
                    Preview Public Page
                  </Button>
                </CardContent>
              </Card>
            ) : (
              <Card>
                <CardContent className="p-8 text-center">
                  <QrCode className="w-16 h-16 text-gray-300 mx-auto mb-4" />
                  <h3 className="text-lg font-medium text-gray-900 mb-2">
                    Generate Your QR Code
                  </h3>
                  <p className="text-gray-500">
                    Select an event and click generate to create your QR code
                  </p>
                </CardContent>
              </Card>
            )}

            {/* Instructions */}
            <Card>
              <CardHeader>
                <CardTitle>How it works</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3 text-sm">
                  <div className="flex items-start space-x-3">
                    <Badge variant="secondary" className="mt-0.5">
                      1
                    </Badge>
                    <p>Select the event you want to create a QR code for</p>
                  </div>
                  <div className="flex items-start space-x-3">
                    <Badge variant="secondary" className="mt-0.5">
                      2
                    </Badge>
                    <p>Generate the QR code and download or share it</p>
                  </div>
                  <div className="flex items-start space-x-3">
                    <Badge variant="secondary" className="mt-0.5">
                      3
                    </Badge>
                    <p>Customers scan the code to access your event features</p>
                  </div>
                  <div className="flex items-start space-x-3">
                    <Badge variant="secondary" className="mt-0.5">
                      4
                    </Badge>
                    <p>Monitor interactions in real-time from your dashboard</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </Layout>
  );
}
