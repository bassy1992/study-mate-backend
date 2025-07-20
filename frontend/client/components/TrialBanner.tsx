import { useTrialContext } from "@/contexts/TrialContext";
import { Button } from "@/components/ui/button";
import { Clock, Sparkles } from "lucide-react";
import { Link } from "react-router-dom";

export default function TrialBanner() {
  const { isTrialActive, hasTrialAccess, activateTrial } = useTrialContext();

  if (!hasTrialAccess && !isTrialActive) {
    return null;
  }

  if (!isTrialActive) {
    return (
      <div className="bg-gradient-to-r from-blue-500 to-blue-600 text-white px-4 py-3">
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <Sparkles className="h-5 w-5" />
            <span className="font-medium">
              🎉 Free 14-day trial available! Test all features instantly.
            </span>
          </div>
          <Button
            onClick={activateTrial}
            className="bg-white text-blue-600 hover:bg-gray-100 font-bold"
            size="sm"
          >
            Start Free Trial
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-gradient-to-r from-blue-600 to-blue-700 text-white px-4 py-2">
      <div className="max-w-7xl mx-auto flex items-center justify-between">
        <div className="flex items-center space-x-2">
          <Clock className="h-4 w-4" />
          <span className="text-sm font-medium">
            🎊 Trial Active - Full Access Enabled! Explore all features.
          </span>
        </div>
        <Button
          variant="outline"
          size="sm"
          className="text-white border-white/50 hover:bg-white/20"
          asChild
        >
          <Link to="/bundles">Upgrade Now</Link>
        </Button>
      </div>
    </div>
  );
}
