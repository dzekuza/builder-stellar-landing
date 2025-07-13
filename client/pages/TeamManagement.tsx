import { useState, useEffect } from "react";
import { useAuth } from "@/contexts/AuthContext";
import { Loading } from "@/components/Loading";
import { toast } from "@/hooks/use-toast";
import { Layout } from "@/components/Layout";
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
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Users,
  Plus,
  Mail,
  Phone,
  MapPin,
  Calendar,
  DollarSign,
  Star,
  Music,
  Coffee,
  UserCheck,
  Edit,
  Trash2,
  MoreHorizontal,
  Send,
} from "lucide-react";

interface TeamMember {
  id: string;
  name: string;
  email: string;
  phone: string;
  role: "dj" | "barista" | "host";
  status: "active" | "inactive" | "pending";
  joinDate: string;
  eventsCount: number;
  totalEarnings: number;
  rating: number;
  location: string;
  bio: string;
}

export default function TeamManagement() {
  const { user } = useAuth();
  const [teamMembers, setTeamMembers] = useState<TeamMember[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

    const [isInviteOpen, setIsInviteOpen] = useState(false);
  const [inviteData, setInviteData] = useState({
    email: "",
    role: "",
    message: "",
  });
  const [isInviting, setIsInviting] = useState(false);

  useEffect(() => {
    const fetchTeamMembers = async () => {
      try {
        const token = localStorage.getItem("eventflow_token");
        if (!token) {
          throw new Error("No authentication token found");
        }

        const response = await fetch("/api/team/members", {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }

        const data = await response.json();
        setTeamMembers(data.members || []);
      } catch (err) {
        console.error("Failed to fetch team members:", err);
        setError(err instanceof Error ? err.message : "Failed to load team members");
        // For now, set empty array to show empty state instead of error
        setTeamMembers([]);
      } finally {
        setLoading(false);
      }
    };

    if (user?.role === "COMPANY") {
      fetchTeamMembers();
    } else {
      setLoading(false);
      setError("Access denied. Only company accounts can manage team members.");
    }
  }, [user]);

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

  const getStatusColor = (status: string) => {
    switch (status) {
      case "active":
        return "bg-green-100 text-green-800";
      case "inactive":
        return "bg-gray-100 text-gray-800";
      case "pending":
        return "bg-yellow-100 text-yellow-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

    const handleInvite = async () => {
    if (!inviteData.email || !inviteData.role) {
      toast({
        title: "Missing Information",
        description: "Please provide email and role for the invitation.",
        variant: "destructive",
      });
      return;
    }

    setIsInviting(true);
    try {
      const token = localStorage.getItem("eventflow_token");
      if (!token) {
        throw new Error("No authentication token found");
      }

      const response = await fetch("/api/team/invite", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          email: inviteData.email,
          role: inviteData.role.toUpperCase(),
          message: inviteData.message,
        }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || "Failed to send invitation");
      }

      toast({
        title: "Invitation Sent!",
        description: `Invitation sent to ${inviteData.email} successfully.`,
      });

      setInviteData({ email: "", role: "", message: "" });
      setIsInviteOpen(false);
    } catch (error) {
      console.error("Failed to send invitation:", error);
      toast({
        title: "Error",
        description: error instanceof Error ? error.message : "Failed to send invitation. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsInviting(false);
    }
  };

    const handleDeleteMember = async (id: string) => {
    const memberToDelete = teamMembers.find(m => m.id === id);
    if (!memberToDelete) return;

    if (!window.confirm(`Are you sure you want to remove ${memberToDelete.name} from your team? This action cannot be undone.`)) {
      return;
    }

    try {
      const token = localStorage.getItem("eventflow_token");
      if (!token) {
        throw new Error("No authentication token found");
      }

      const response = await fetch(`/api/team/members/${id}`, {
        method: "DELETE",
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (!response.ok) {
        throw new Error("Failed to remove team member");
      }

      setTeamMembers(teamMembers.filter((member) => member.id !== id));
      toast({
        title: "Member Removed",
        description: `${memberToDelete.name} has been removed from your team.`,
      });
    } catch (error) {
      console.error("Failed to remove team member:", error);
      toast({
        title: "Error",
        description: "Failed to remove team member. Please try again.",
        variant: "destructive",
      });
    }
  };

    const activeMembers = teamMembers.filter((m) => m.status === "active");
  const pendingMembers = teamMembers.filter((m) => m.status === "pending");

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
              {error.includes("Access denied") ? "Access Denied" : "Error Loading Team"}
            </h2>
            <p className="text-gray-600 dark:text-gray-400 mb-4">{error}</p>
            {!error.includes("Access denied") && (
              <Button onClick={() => window.location.reload()}>Try Again</Button>
            )}
          </div>
        </div>
      </Layout>
    );
  }

  return (
    <Layout>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">
              Team Management
            </h1>
            <p className="text-gray-600 mt-1">
              Manage your team members and their roles
            </p>
          </div>
          <Dialog open={isInviteOpen} onOpenChange={setIsInviteOpen}>
            <DialogTrigger asChild>
              <Button className="bg-gradient-to-r from-brand-purple to-brand-blue">
                <Plus className="w-4 h-4 mr-2" />
                Invite Member
              </Button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>Invite Team Member</DialogTitle>
                <DialogDescription>
                  Send an invitation to join your team
                </DialogDescription>
              </DialogHeader>
              <div className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="email">Email Address</Label>
                  <Input
                    id="email"
                    type="email"
                    value={inviteData.email}
                    onChange={(e) =>
                      setInviteData({ ...inviteData, email: e.target.value })
                    }
                    placeholder="member@example.com"
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="role">Role</Label>
                  <Select
                    value={inviteData.role}
                    onValueChange={(value) =>
                      setInviteData({ ...inviteData, role: value })
                    }
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Select role" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="dj">DJ</SelectItem>
                      <SelectItem value="barista">Barista</SelectItem>
                      <SelectItem value="host">Host</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="message">Personal Message (Optional)</Label>
                  <Textarea
                    id="message"
                    value={inviteData.message}
                    onChange={(e) =>
                      setInviteData({ ...inviteData, message: e.target.value })
                    }
                    placeholder="Welcome to our team..."
                    rows={3}
                  />
                </div>

                <div className="flex justify-end space-x-2">
                  <Button
                    variant="outline"
                    onClick={() => {
                      setIsInviteOpen(false);
                      setInviteData({ email: "", role: "", message: "" });
                    }}
                  >
                    Cancel
                  </Button>
                                    <Button onClick={handleInvite} disabled={isInviting}>
                    <Send className="w-4 h-4 mr-2" />
                    {isInviting ? "Sending..." : "Send Invitation"}
                  </Button>
                </div>
              </div>
            </DialogContent>
          </Dialog>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">
                    Total Members
                  </p>
                  <p className="text-2xl font-bold text-gray-900">
                    {teamMembers.length}
                  </p>
                </div>
                <Users className="h-8 w-8 text-brand-purple" />
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">
                    Active Members
                  </p>
                  <p className="text-2xl font-bold text-green-600">
                    {activeMembers.length}
                  </p>
                </div>
                <Badge className="bg-green-100 text-green-800">Active</Badge>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">
                    Pending Invites
                  </p>
                  <p className="text-2xl font-bold text-yellow-600">
                    {pendingMembers.length}
                  </p>
                </div>
                <Badge className="bg-yellow-100 text-yellow-800">Pending</Badge>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">
                    Total Earnings
                  </p>
                  <p className="text-2xl font-bold text-gray-900">
                    $
                    {teamMembers
                      .reduce((acc, member) => acc + member.totalEarnings, 0)
                      .toLocaleString()}
                  </p>
                </div>
                <DollarSign className="h-8 w-8 text-green-600" />
              </div>
            </CardContent>
          </Card>
        </div>

                {/* Team Members Grid */}
        {teamMembers.length === 0 ? (
          <div className="text-center py-12">
            <Card className="max-w-md mx-auto">
              <CardContent className="pt-6">
                <Users className="mx-auto h-12 w-12 text-gray-400 mb-4" />
                <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-2">
                  No team members yet
                </h3>
                <p className="text-gray-500 dark:text-gray-400 mb-6 max-w-md mx-auto">
                  Start building your team by inviting DJs, baristas, and hosts to join your events.
                </p>
                <Button
                  onClick={() => setIsInviteOpen(true)}
                  className="bg-gradient-to-r from-brand-purple to-brand-blue text-white px-6 py-3"
                >
                  <Plus className="w-4 h-4 mr-2" />
                  Invite Your First Member
                </Button>
              </CardContent>
            </Card>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {teamMembers.map((member) => {
            const RoleIcon = getRoleIcon(member.role);
            return (
              <Card key={member.id}>
                <CardHeader className="pb-3">
                  <div className="flex items-start justify-between">
                    <div className="flex items-center space-x-3">
                      <Avatar className="h-12 w-12">
                        <AvatarImage src={`/api/placeholder/48/48`} />
                        <AvatarFallback>
                          {member.name
                            .split(" ")
                            .map((n) => n[0])
                            .join("")}
                        </AvatarFallback>
                      </Avatar>
                      <div>
                        <CardTitle className="text-lg">{member.name}</CardTitle>
                        <div className="flex items-center space-x-2 mt-1">
                          <Badge
                            variant="secondary"
                            className={getRoleColor(member.role)}
                          >
                            <RoleIcon className="w-3 h-3 mr-1" />
                            {member.role.charAt(0).toUpperCase() +
                              member.role.slice(1)}
                          </Badge>
                          <Badge className={getStatusColor(member.status)}>
                            {member.status}
                          </Badge>
                        </div>
                      </div>
                    </div>
                    <Button variant="ghost" size="sm">
                      <MoreHorizontal className="w-4 h-4" />
                    </Button>
                  </div>
                </CardHeader>

                <CardContent className="space-y-3">
                  <p className="text-sm text-gray-600">{member.bio}</p>

                  <div className="space-y-2 text-sm">
                    <div className="flex items-center space-x-2">
                      <Mail className="w-4 h-4 text-gray-400" />
                      <span>{member.email}</span>
                    </div>
                    <div className="flex items-center space-x-2">
                      <Phone className="w-4 h-4 text-gray-400" />
                      <span>{member.phone}</span>
                    </div>
                    <div className="flex items-center space-x-2">
                      <MapPin className="w-4 h-4 text-gray-400" />
                      <span>{member.location}</span>
                    </div>
                  </div>

                  <div className="grid grid-cols-3 gap-3 pt-3 border-t">
                    <div className="text-center">
                      <p className="text-lg font-bold text-gray-900">
                        {member.eventsCount}
                      </p>
                      <p className="text-xs text-gray-500">Events</p>
                    </div>
                    <div className="text-center">
                      <p className="text-lg font-bold text-green-600">
                        ${member.totalEarnings}
                      </p>
                      <p className="text-xs text-gray-500">Earnings</p>
                    </div>
                    <div className="text-center">
                      <p className="text-lg font-bold text-yellow-600">
                        {member.rating}⭐
                      </p>
                      <p className="text-xs text-gray-500">Rating</p>
                    </div>
                  </div>

                  <div className="flex space-x-2 pt-3">
                    <Button variant="outline" size="sm" className="flex-1">
                      <Edit className="w-3 h-3 mr-1" />
                      Edit
                    </Button>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => handleDeleteMember(member.id)}
                      className="text-red-600 hover:text-red-700"
                    >
                      <Trash2 className="w-3 h-3" />
                    </Button>
                  </div>
                </CardContent>
              </Card>
            );
          })}
        </div>
      </div>
    </Layout>
  );
}