import { EventFlowLogo } from "./EventFlowLogo";

interface LoadingProps {
  message?: string;
}

export function Loading({ message = "Loading..." }: LoadingProps) {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-slate-50 via-white to-slate-50">
      <div className="text-center">
        <div className="mb-6">
          <EventFlowLogo className="justify-center" />
        </div>
        <div className="animate-spin h-8 w-8 mx-auto mb-4">
          <div className="h-8 w-8 border-4 border-brand-purple border-t-transparent rounded-full"></div>
        </div>
        <p className="text-gray-600">{message}</p>
      </div>
    </div>
  );
}
