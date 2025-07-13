import { useState } from "react";
import { Link } from "react-router-dom";
import { Layout } from "@/components/Layout";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Music, Coffee, Users, Building2, ArrowRight } from "lucide-react";

export default function Register() {
  const [step, setStep] = useState<"role" | "details">("role");
  const [selectedRole, setSelectedRole] = useState<string>("");
  const [formData, setFormData] = useState({
    email: "",
    password: "",
    confirmPassword: "",
    name: "",
    phone: "",
    companyName: "",
  });

  const roles = [
    {
      id: "dj",
      title: "DJ",
      description: "Accept song requests and manage your sets",
      icon: Music,
      features: ["Live song requests", "Payment integration", "Set analytics"],
    },
    {
      id: "barista",
      title: "Barista",
      description: "Take drink orders and manage your menu",
      icon: Coffee,
      features: ["Digital menu", "Order management", "Inventory tracking"],
    },
    {
      id: "host",
      title: "Event Host",
      description: "Coordinate and manage event activities",
      icon: Users,
      features: ["Event coordination", "Guest management", "Activity tracking"],
    },
    {
      id: "company",
      title: "Event Management Company",
      description: "Manage teams and multiple events",
      icon: Building2,
      features: [
        "Team management",
        "Multi-event oversight",
        "Company analytics",
      ],
    },
  ];

  const handleRoleSelect = (role: string) => {
    setSelectedRole(role);
  };

  const handleRoleNext = () => {
    if (selectedRole) {
      setStep("details");
    }
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // Handle registration logic here
    console.log("Registration data:", { ...formData, role: selectedRole });
  };

  if (step === "role") {
    return (
      <Layout>
        <div className="min-h-screen flex items-center justify-center px-4 py-12">
          <div className="max-w-4xl w-full">
            <div className="text-center mb-10">
              <h1 className="text-3xl md:text-4xl font-bold mb-4">
                Choose Your Role
              </h1>
              <p className="text-lg text-gray-600">
                Select the option that best describes how you'll use EventFlow
              </p>
            </div>

            <RadioGroup
              value={selectedRole}
              onValueChange={handleRoleSelect}
              className="grid grid-cols-1 md:grid-cols-2 gap-6"
            >
              {roles.map((role) => {
                const Icon = role.icon;
                return (
                  <div key={role.id} className="relative">
                    <RadioGroupItem
                      value={role.id}
                      id={role.id}
                      className="sr-only"
                    />
                    <Label
                      htmlFor={role.id}
                      className={`cursor-pointer block p-6 rounded-2xl border-2 transition-all duration-300 ${
                        selectedRole === role.id
                          ? "border-brand-purple bg-brand-purple/5 shadow-lg"
                          : "border-gray-200 hover:border-brand-purple/50 bg-white"
                      }`}
                    >
                      <div className="flex flex-col items-center text-center">
                        <div
                          className={`w-16 h-16 rounded-2xl mb-4 flex items-center justify-center ${
                            selectedRole === role.id
                              ? "bg-brand-purple text-white"
                              : "bg-gray-100 text-gray-600"
                          }`}
                        >
                          <Icon className="w-8 h-8" />
                        </div>
                        <h3 className="text-xl font-semibold mb-2">
                          {role.title}
                        </h3>
                        <p className="text-gray-600 mb-4">{role.description}</p>
                        <ul className="text-sm space-y-1">
                          {role.features.map((feature, index) => (
                            <li key={index} className="text-gray-500">
                              • {feature}
                            </li>
                          ))}
                        </ul>
                      </div>
                    </Label>
                  </div>
                );
              })}
            </RadioGroup>

            <div className="flex justify-center mt-10">
              <Button
                onClick={handleRoleNext}
                disabled={!selectedRole}
                size="lg"
                className="px-8"
              >
                Continue
                <ArrowRight className="ml-2 w-4 h-4" />
              </Button>
            </div>

            <div className="text-center mt-6">
              <p className="text-gray-600">
                Already have an account?{" "}
                <Link
                  to="/login"
                  className="text-brand-purple hover:underline font-medium"
                >
                  Sign in
                </Link>
              </p>
            </div>
          </div>
        </div>
      </Layout>
    );
  }

  return (
    <Layout>
      <div className="min-h-screen flex items-center justify-center px-4 py-12">
        <Card className="w-full max-w-md">
          <CardHeader className="text-center">
            <CardTitle className="text-2xl">Create Your Account</CardTitle>
            <CardDescription>
              You selected:{" "}
              <span className="font-medium text-brand-purple">
                {roles.find((r) => r.id === selectedRole)?.title}
              </span>
            </CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="email">Email</Label>
                <Input
                  id="email"
                  name="email"
                  type="email"
                  value={formData.email}
                  onChange={handleInputChange}
                  required
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="name">Full Name</Label>
                <Input
                  id="name"
                  name="name"
                  value={formData.name}
                  onChange={handleInputChange}
                  required
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="phone">Phone Number</Label>
                <Input
                  id="phone"
                  name="phone"
                  type="tel"
                  value={formData.phone}
                  onChange={handleInputChange}
                  required
                />
              </div>

              {selectedRole === "company" && (
                <div className="space-y-2">
                  <Label htmlFor="companyName">Company Name</Label>
                  <Input
                    id="companyName"
                    name="companyName"
                    value={formData.companyName}
                    onChange={handleInputChange}
                    required
                  />
                </div>
              )}

              <div className="space-y-2">
                <Label htmlFor="password">Password</Label>
                <Input
                  id="password"
                  name="password"
                  type="password"
                  value={formData.password}
                  onChange={handleInputChange}
                  required
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="confirmPassword">Confirm Password</Label>
                <Input
                  id="confirmPassword"
                  name="confirmPassword"
                  type="password"
                  value={formData.confirmPassword}
                  onChange={handleInputChange}
                  required
                />
              </div>

              <Button type="submit" className="w-full" size="lg">
                Create Account
              </Button>
            </form>

            <div className="mt-6 text-center">
              <button
                onClick={() => setStep("role")}
                className="text-sm text-gray-500 hover:underline"
              >
                ← Back to role selection
              </button>
            </div>
          </CardContent>
        </Card>
      </div>
    </Layout>
  );
}
