
import { Loader2 } from "lucide-react";

interface LoadingSpinnerProps {
  className?: string;
  message?: string;
}

export const LoadingSpinner = ({ className = "w-8 h-8", message }: LoadingSpinnerProps) => {
  return (
    <div className="min-h-screen bg-black flex items-center justify-center">
      <div className="text-center space-y-4">
        <Loader2 className={`animate-spin text-orange-500 mx-auto ${className}`} />
        {message && <p className="text-gray-400">{message}</p>}
      </div>
    </div>
  );
};
