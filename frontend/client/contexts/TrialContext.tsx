import {
  createContext,
  useContext,
  useState,
  useEffect,
  ReactNode,
} from "react";

interface TrialContextType {
  isTrialActive: boolean;
  trialTimeRemaining: number;
  activateTrial: () => void;
  hasTrialAccess: boolean;
}

const TrialContext = createContext<TrialContextType | undefined>(undefined);

export function TrialProvider({ children }: { children: ReactNode }) {
  const [isTrialActive, setIsTrialActive] = useState(false);
  const [trialTimeRemaining, setTrialTimeRemaining] = useState(
    14 * 24 * 60 * 60 * 1000,
  ); // 14 days in milliseconds

  useEffect(() => {
    // Check if trial was previously activated
    const trialStart = localStorage.getItem("trialStartTime");
    if (trialStart) {
      const startTime = parseInt(trialStart);
      const now = Date.now();
      const elapsed = now - startTime;
      const remaining = 14 * 24 * 60 * 60 * 1000 - elapsed;

      if (remaining > 0) {
        setIsTrialActive(true);
        setTrialTimeRemaining(remaining);
      } else {
        localStorage.removeItem("trialStartTime");
      }
    }
  }, []);

  const activateTrial = () => {
    const now = Date.now();
    localStorage.setItem("trialStartTime", now.toString());
    setIsTrialActive(true);
    setTrialTimeRemaining(14 * 24 * 60 * 60 * 1000);
  };

  const hasTrialAccess = true; // For testing, always grant trial access

  const value = {
    isTrialActive,
    trialTimeRemaining,
    activateTrial,
    hasTrialAccess,
  };

  return (
    <TrialContext.Provider value={value}>{children}</TrialContext.Provider>
  );
}

export function useTrialContext() {
  const context = useContext(TrialContext);
  if (context === undefined) {
    throw new Error("useTrialContext must be used within a TrialProvider");
  }
  return context;
}
