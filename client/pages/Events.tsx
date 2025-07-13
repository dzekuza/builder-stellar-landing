import { Layout } from "@/components/Layout";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Calendar, Construction } from "lucide-react";

export default function Events() {
  return (
    <Layout>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="text-center">
          <Card className="max-w-md mx-auto">
            <CardHeader>
              <div className="flex justify-center mb-4">
                <div className="w-16 h-16 bg-brand-purple/10 rounded-full flex items-center justify-center">
                  <Calendar className="w-8 h-8 text-brand-purple" />
                </div>
              </div>
              <CardTitle>Events Management</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex items-center justify-center space-x-2 text-gray-500 mb-4">
                <Construction className="w-5 h-5" />
                <span>Coming Soon</span>
              </div>
              <p className="text-gray-600">
                Full event management features will be available here soon.
                Create, manage, and track all your events in one place.
              </p>
            </CardContent>
          </Card>
        </div>
      </div>
    </Layout>
  );
}
