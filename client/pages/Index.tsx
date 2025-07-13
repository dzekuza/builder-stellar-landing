import { Link } from "react-router-dom";
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
  ArrowRight,
  Music,
  Coffee,
  Users,
  Building2,
  QrCode,
  BarChart3,
  Zap,
  Star,
  CheckCircle,
} from "lucide-react";

export default function Index() {
  const userTypes = [
    {
      icon: Music,
      title: "DJ",
      description: "Accept song requests and manage your sets",
      features: [
        "Live song requests",
        "Request moderation",
        "Payment integration",
        "Performance analytics",
      ],
      color: "from-brand-purple to-brand-purple-dark",
    },
    {
      icon: Coffee,
      title: "Barista",
      description: "Take drink orders and manage your menu",
      features: [
        "Digital drink menu",
        "Order management",
        "Ingredient tracking",
        "Sales analytics",
      ],
      color: "from-brand-blue to-brand-blue-dark",
    },
    {
      icon: Users,
      title: "Event Host",
      description: "Coordinate and manage event activities",
      features: [
        "Event coordination",
        "Guest management",
        "Activity tracking",
        "Real-time updates",
      ],
      color: "from-brand-success to-green-600",
    },
    {
      icon: Building2,
      title: "Event Company",
      description: "Manage teams and multiple events",
      features: [
        "Team management",
        "Multi-event oversight",
        "Staff assignments",
        "Company analytics",
      ],
      color: "from-brand-purple via-brand-blue to-brand-purple",
    },
  ];

  const features = [
    {
      icon: QrCode,
      title: "QR Code Integration",
      description:
        "Generate instant QR codes for seamless customer interactions",
    },
    {
      icon: Zap,
      title: "Real-time Updates",
      description: "Live synchronization across all devices and user types",
    },
    {
      icon: BarChart3,
      title: "Advanced Analytics",
      description: "Detailed insights and performance metrics for your events",
    },
  ];

  return (
    <Layout>
      <div className="relative">
        {/* Hero Section */}
        <section className="relative px-4 py-24 sm:px-6 lg:px-8">
          <div className="max-w-7xl mx-auto text-center">
            <div className="max-w-4xl mx-auto">
              <Badge
                variant="secondary"
                className="mb-6 bg-brand-purple/10 text-brand-purple border-brand-purple/20"
              >
                <Star className="w-3 h-3 mr-1" />
                Revolutionizing Event Management
              </Badge>

              <h1 className="text-4xl md:text-6xl lg:text-7xl font-bold mb-6 bg-gradient-to-r from-brand-purple via-brand-blue to-brand-purple bg-clip-text text-transparent leading-tight">
                EventFlow
              </h1>

              <p className="text-xl md:text-2xl text-gray-600 mb-8 leading-relaxed">
                The all-in-one platform for DJs, Baristas, Event Hosts, and
                Companies to manage events seamlessly
              </p>

              <div className="flex flex-col sm:flex-row gap-4 justify-center items-center mb-12">
                <Link to="/register">
                  <Button
                    size="lg"
                    className="bg-gradient-to-r from-brand-purple to-brand-blue hover:from-brand-purple-dark hover:to-brand-blue-dark text-white px-8 py-6 text-lg"
                  >
                    Get Started Free
                    <ArrowRight className="ml-2 w-5 h-5" />
                  </Button>
                </Link>
                <Link to="/demo">
                  <Button
                    variant="outline"
                    size="lg"
                    className="px-8 py-6 text-lg border-brand-purple/20 text-brand-purple hover:bg-brand-purple/5"
                  >
                    Watch Demo
                  </Button>
                </Link>
              </div>

              <div className="flex items-center justify-center space-x-8 text-sm text-gray-500">
                <div className="flex items-center">
                  <CheckCircle className="w-4 h-4 text-brand-success mr-2" />
                  Free to start
                </div>
                <div className="flex items-center">
                  <CheckCircle className="w-4 h-4 text-brand-success mr-2" />
                  No setup fees
                </div>
                <div className="flex items-center">
                  <CheckCircle className="w-4 h-4 text-brand-success mr-2" />
                  Cancel anytime
                </div>
              </div>
            </div>
          </div>

          {/* Background Elements */}
          <div className="absolute inset-0 -z-10 overflow-hidden">
            <div className="absolute -top-40 -right-32 w-80 h-80 bg-gradient-to-br from-brand-purple/20 to-brand-blue/20 rounded-full blur-3xl"></div>
            <div className="absolute -bottom-40 -left-32 w-80 h-80 bg-gradient-to-tr from-brand-blue/20 to-brand-purple/20 rounded-full blur-3xl"></div>
          </div>
        </section>

        {/* User Types Section */}
        <section className="px-4 py-20 sm:px-6 lg:px-8 bg-white/50">
          <div className="max-w-7xl mx-auto">
            <div className="text-center mb-16">
              <h2 className="text-3xl md:text-5xl font-bold mb-6">
                Built for Every Role
              </h2>
              <p className="text-xl text-gray-600 max-w-3xl mx-auto">
                Whether you're a DJ taking song requests, a barista managing
                orders, or running an event company, EventFlow adapts to your
                needs.
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              {userTypes.map((type, index) => {
                const Icon = type.icon;
                return (
                  <Card
                    key={index}
                    className="group hover:shadow-xl transition-all duration-300 border-0 bg-white/80 backdrop-blur-sm hover:-translate-y-2"
                  >
                    <CardHeader className="text-center pb-4">
                      <div
                        className={`w-16 h-16 mx-auto mb-4 rounded-2xl bg-gradient-to-br ${type.color} flex items-center justify-center`}
                      >
                        <Icon className="w-8 h-8 text-white" />
                      </div>
                      <CardTitle className="text-xl">{type.title}</CardTitle>
                      <CardDescription className="text-base">
                        {type.description}
                      </CardDescription>
                    </CardHeader>
                    <CardContent>
                      <ul className="space-y-2">
                        {type.features.map((feature, featureIndex) => (
                          <li
                            key={featureIndex}
                            className="flex items-center text-sm"
                          >
                            <CheckCircle className="w-4 h-4 text-brand-success mr-2 flex-shrink-0" />
                            {feature}
                          </li>
                        ))}
                      </ul>
                    </CardContent>
                  </Card>
                );
              })}
            </div>
          </div>
        </section>

        {/* Features Section */}
        <section className="px-4 py-20 sm:px-6 lg:px-8">
          <div className="max-w-7xl mx-auto">
            <div className="text-center mb-16">
              <h2 className="text-3xl md:text-5xl font-bold mb-6">
                Powerful Features
              </h2>
              <p className="text-xl text-gray-600 max-w-3xl mx-auto">
                Everything you need to run successful events, all in one
                platform.
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              {features.map((feature, index) => {
                const Icon = feature.icon;
                return (
                  <div key={index} className="text-center group">
                    <div className="w-20 h-20 mx-auto mb-6 bg-gradient-to-br from-brand-purple/10 to-brand-blue/10 rounded-2xl flex items-center justify-center group-hover:from-brand-purple/20 group-hover:to-brand-blue/20 transition-all duration-300">
                      <Icon className="w-10 h-10 text-brand-purple" />
                    </div>
                    <h3 className="text-xl font-semibold mb-4">
                      {feature.title}
                    </h3>
                    <p className="text-gray-600 leading-relaxed">
                      {feature.description}
                    </p>
                  </div>
                );
              })}
            </div>
          </div>
        </section>

        {/* CTA Section */}
        <section className="px-4 py-20 sm:px-6 lg:px-8 bg-gradient-to-r from-brand-purple to-brand-blue">
          <div className="max-w-4xl mx-auto text-center text-white">
            <h2 className="text-3xl md:text-5xl font-bold mb-6">
              Ready to Transform Your Events?
            </h2>
            <p className="text-xl mb-8 opacity-90">
              Join thousands of event professionals who trust EventFlow to power
              their success.
            </p>
            <Link to="/register">
              <Button
                size="lg"
                variant="secondary"
                className="bg-white text-brand-purple hover:bg-gray-100 px-8 py-6 text-lg"
              >
                Start Your Free Trial
                <ArrowRight className="ml-2 w-5 h-5" />
              </Button>
            </Link>
          </div>
        </section>
      </div>
    </Layout>
  );
}
