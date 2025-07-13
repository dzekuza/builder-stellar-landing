import { cn } from "@/lib/utils";

interface EventFlowLogoProps {
  className?: string;
  showText?: boolean;
}

export function EventFlowLogo({
  className,
  showText = true,
}: EventFlowLogoProps) {
  return (
    <div className={cn("flex items-center space-x-2", className)}>
      <div className="relative">
        <div className="w-8 h-8 bg-gradient-to-br from-brand-purple to-brand-blue rounded-lg flex items-center justify-center">
          <svg
            width="16"
            height="16"
            viewBox="0 0 24 24"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
            className="text-white"
          >
            <path
              d="M12 2L15.09 8.26L22 9L17 14L18.18 21L12 17.77L5.82 21L7 14L2 9L8.91 8.26L12 2Z"
              fill="currentColor"
            />
          </svg>
        </div>
      </div>
      {showText && (
        <span className="text-xl font-bold bg-gradient-to-r from-brand-purple to-brand-blue bg-clip-text text-transparent">
          EventFlow
        </span>
      )}
    </div>
  );
}
