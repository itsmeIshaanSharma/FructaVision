import { motion } from "framer-motion";
import { CheckCircle2, RotateCcw } from "lucide-react";
import type { AnalysisResponse, FreshnessStatus } from "../../services/api";

interface ResultCardProps {
  result: AnalysisResponse;
  onReset: () => void;
}

const statusConfig: Record<FreshnessStatus, { color: string, bg: string, label: string }> = {
  Fresh: { color: "text-success", bg: "bg-success/10", label: "Peak Freshness" },
  Ripe: { color: "text-warning", bg: "bg-warning/10", label: "Ripening" },
  Overripe: { color: "text-destructive", bg: "bg-destructive/10", label: "Overripe" }
};

export function ResultCard({ result, onReset }: ResultCardProps) {
  const config = statusConfig[result.freshness] || statusConfig.Fresh;
  const percentage = Math.round(result.confidence * 100);

  return (
    <motion.div 
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4, ease: "easeOut" }}
      className="bg-card w-full rounded-3xl shadow-lg border border-border mt-6 md:mt-8 p-5 sm:p-6 md:p-8 max-w-2xl mx-auto"
    >
      <div className="flex flex-col items-center text-center">
        
        <motion.div 
          initial={{ scale: 0.8, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ delay: 0.2, type: "spring", stiffness: 200 }}
          className={`w-16 h-16 sm:w-20 sm:h-20 rounded-full flex items-center justify-center mb-4 ${config.bg} ${config.color}`}
        >
          <CheckCircle2 className="w-8 h-8 sm:w-10 sm:h-10" />
        </motion.div>

        <h2 className="text-2xl sm:text-3xl font-bold tracking-tight mb-2 text-foreground">
          {result.fruit} Detected
        </h2>
        
        <div className={`mt-2 px-4 py-1.5 rounded-full font-bold text-sm uppercase tracking-wider ${config.bg} ${config.color}`}>
          {config.label}
        </div>

        <div className="w-full mt-10">
          <div className="flex justify-between items-end mb-2">
            <span className="text-sm font-medium text-muted-foreground">AI Confidence</span>
            <span className="text-xl font-bold text-foreground">{percentage}%</span>
          </div>
          <div className="h-3 w-full bg-muted rounded-full overflow-hidden">
            <motion.div 
              initial={{ width: 0 }}
              animate={{ width: `${percentage}%` }}
              transition={{ delay: 0.4, duration: 0.8, ease: "easeOut" }}
              className={`h-full rounded-full ${result.freshness === 'Fresh' ? 'bg-success' : result.freshness === 'Ripe' ? 'bg-warning' : 'bg-destructive'}`}
            />
          </div>
        </div>

        <div className="mt-8 flex flex-col items-center p-4 bg-muted/40 rounded-2xl w-full border border-border/50">
          <span className="text-xs font-semibold uppercase tracking-wider text-muted-foreground mb-1">
            Estimated Shelf Life
          </span>
          <span className="font-semibold text-foreground text-lg">
            {result.shelfLife}
          </span>
        </div>

        <button 
          onClick={onReset}
          className="mt-8 flex items-center space-x-2 px-8 py-3.5 bg-foreground hover:bg-foreground/90 text-background font-semibold rounded-xl shadow-md transition-all active:scale-95"
        >
          <RotateCcw className="w-5 h-5" />
          <span>Scan Another</span>
        </button>

      </div>
    </motion.div>
  );
}
