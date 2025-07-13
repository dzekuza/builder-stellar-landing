import { useAuth, UserRole } from "@/contexts/AuthContext";
import { useNavigate } from "react-router-dom";
import { Layout } from "@/components/Layout";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Music, Coffee, Users, Building2 } from "lucide-react";

export default function Demo() {
  const { login } = useAuth();
  const navigate = useNavigate();

  const demoUsers = [
    {
      role: "DJ" as UserRole,
      name: "DJ Alex",
      email: "alex@eventflow.com",
      icon: Music,
      description: "Experience the DJ dashboard with live song requests",
      color: "from-brand-purple to-brand-purple-dark",
    },
    {
      role: "BARISTA" as UserRole,
      name: "Sarah the Barista",
      email: "sarah@eventflow.com",
      icon: Coffee,
      description: "Manage drink orders and your digital menu",
      color: "from-brand-blue to-brand-blue-dark",
    },
    {
      role: "HOST" as UserRole,
      name: "Mike Host",
      email: "mike@eventflow.com",
      icon: Users,
      description: "Coordinate events and manage guest activities",
      color: "from-brand-success to-green-600",
    },
    {
      role: "COMPANY" as UserRole,
      name: "EventCorp Manager",
      email: "manager@eventcorp.com",
      icon: Building2,
      description: "Oversee teams and manage multiple events",
      color: "from-brand-purple via-brand-blue to-brand-purple",
    },
  ];

  const handleDemoLogin = async (demoUser: (typeof demoUsers)[0]) => {
    try {
      // First try to login with existing demo user
      const defaultPassword = "demo123";

      try {
        await login(demoUser.email, defaultPassword);
        navigate("/dashboard");
        return;
      } catch (loginError) {
        // If login fails, user doesn't exist, so create them
        console.log("Demo user doesn't exist, creating...");
      }

      // Create demo user via registration
      const response = await fetch("/api/auth/register", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          email: demoUser.email,
          password: defaultPassword,
          name: demoUser.name,
          role: demoUser.role,
          phone: "+1 (555) 123-4567",
          companyName: demoUser.role === "COMPANY" ? "EventCorp" : undefined,
        }),
      });

      if (response.ok) {
        const { user, token } = await response.json();
        localStorage.setItem("eventflow_token", token);
        localStorage.setItem("eventflow_user", JSON.stringify(user));
        navigate("/dashboard");
      } else {
        // User might already exist but login failed for another reason
        // Try login again
        await login(demoUser.email, defaultPassword);
        navigate("/dashboard");
      }
    } catch (error) {
      console.error("Demo login failed:", error);
      alert("Demo login failed. Please try again.");
    }
  };

  return (
    <Layout>
      <div className="min-h-screen flex items-center justify-center px-4 py-12">
        <div className="max-w-4xl w-full">
          <div className="text-center mb-10">
            <h1 className="text-3xl md:text-4xl font-bold mb-4">
              Try EventFlow Demo
            </h1>
            <p className="text-lg text-gray-600">
              Experience different user roles and see how EventFlow adapts to
              your needs
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {demoUsers.map((demoUser) => {
              const Icon = demoUser.icon;
              return (
                <Card
                  key={demoUser.role}
                  className="group hover:shadow-xl transition-all duration-300 border-0 bg-white/80 backdrop-blur-sm hover:-translate-y-2"
                >
                  <CardHeader className="text-center pb-4">
                    <div
                      className={`w-16 h-16 mx-auto mb-4 rounded-2xl bg-gradient-to-br ${demoUser.color} flex items-center justify-center`}
                    >
                      <Icon className="w-8 h-8 text-white" />
                    </div>
                    <CardTitle className="text-xl">{demoUser.name}</CardTitle>
                    <CardDescription className="text-base">
                      {demoUser.description}
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <Button
                      onClick={() => handleDemoLogin(demoUser)}
                      className={`w-full bg-gradient-to-r ${demoUser.color} text-white hover:opacity-90`}
                    >
                      Try as{" "}
                      {demoUser.role.charAt(0).toUpperCase() +
                        demoUser.role.slice(1)}
                    </Button>
                  </CardContent>
                </Card>
              );
            })}
          </div>

          <div className="text-center mt-10">
            <p className="text-gray-600 mb-4">
              Or create your own account for a personalized experience
            </p>
            <div className="flex justify-center space-x-4">
              <Button variant="outline" onClick={() => navigate("/register")}>
                Sign Up Free
              </Button>
              <Button variant="outline" onClick={() => navigate("/login")}>
                Sign In
              </Button>
            </div>
          </div>
        </div>
      </div>
    </Layout>
  );
}
