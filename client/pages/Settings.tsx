import { Layout } from "@/components/Layout";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Settings as SettingsIcon, Construction } from "lucide-react";

export default function Settings() {
  return (
    <Layout userRole="dj" isAuthenticated={true}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="text-center">
          <Card className="max-w-md mx-auto">
            <CardHeader>
              <div className="flex justify-center mb-4">
                <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center">
                  <SettingsIcon className="w-8 h-8 text-gray-600" />
                </div>
              </div>
              <CardTitle>Settings</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex items-center justify-center space-x-2 text-gray-500 mb-4">
                <Construction className="w-5 h-5" />
                <span>Coming Soon</span>
              </div>
              <p className="text-gray-600">
                Configure your account settings, payment preferences, and
                notification settings.
              </p>
            </CardContent>
          </Card>
        </div>
      </div>
    </Layout>
  );
}
