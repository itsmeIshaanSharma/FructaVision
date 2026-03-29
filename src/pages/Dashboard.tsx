import { useState, useEffect, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import { MainLayout } from "../layouts/MainLayout";
import { ScannerCard } from "../components/Scanner/ScannerCard";
import { ResultCard } from "../components/Scanner/ResultCard";
import { analyzeImage, getRecentScans, type AnalysisResponse, type RecentScan, type FreshnessStatus } from "../services/api";

// Reused from Analytics — fruit emoji helper
const FRUIT_EMOJI: Record<string, string> = {
  apple: '🍎', banana: '🍌', mango: '🥭', avocado: '🥑',
  strawberry: '🍓', orange: '🍊', grape: '🍇', grapes: '🍇', guava: '🥝', watermelon: '🍉',
  pineapple: '🍍', lemon: '🍋', lime: '🍋', peach: '🍑',
  cherry: '🍒', pear: '🍐', kiwi: '🥝', blueberry: '🫐',
};
function fruitEmoji(name: string) {
  const key = name.toLowerCase().split(' ').find(w => FRUIT_EMOJI[w]);
  return key ? FRUIT_EMOJI[key] : '🍑';
}
function timeAgo(iso: string) {
  const diff = Math.floor((Date.now() - new Date(iso).getTime()) / 1000);
  if (diff < 60) return `${diff}s ago`;
  if (diff < 3600) return `${Math.floor(diff / 60)}m ago`;
  if (diff < 86400) return `${Math.floor(diff / 3600)}h ago`;
  return `${Math.floor(diff / 86400)}d ago`;
}
const BADGE: Record<FreshnessStatus, { label: string; className: string }> = {
  Fresh:    { label: 'FRESH',    className: 'bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400' },
  Ripe:     { label: 'RIPE',     className: 'bg-yellow-100 text-yellow-700 dark:bg-yellow-900/30 dark:text-yellow-400' },
  Overripe: { label: 'OVERRIPE', className: 'bg-red-100 text-red-600 dark:bg-red-900/30 dark:text-red-400' },
};

export function Dashboard() {
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [result, setResult] = useState<AnalysisResponse | null>(null);
  const [recent, setRecent] = useState<RecentScan[]>([]);
  const navigate = useNavigate();

  const loadRecent = useCallback(async () => {
    try {
      const scans = await getRecentScans();
      setRecent(scans);
    } catch {
      // Silently fail — DB may not be set up yet
    }
  }, []);

  useEffect(() => { loadRecent(); }, [loadRecent]);

  const handleAnalyze = async (source: File | string) => {
    setIsAnalyzing(true);
    setResult(null);
    try {
      const response = await analyzeImage(source);
      setResult(response);
      // Refresh history after a new scan
      await loadRecent();
    } catch (error) {
      console.error("Analysis failed:", error);
    } finally {
      setIsAnalyzing(false);
    }
  };

  const handleReset = () => setResult(null);

  return (
    <MainLayout>
      <div className="flex flex-col max-w-7xl mx-auto w-full">

        {/* Two-column layout: scanner left, history right */}
        <div className="flex flex-col 2xl:flex-row 2xl:items-start gap-6 md:gap-8">

          {/* Left — scanner */}
          <div className="flex-1 min-w-0">
            <div className="mb-6">
              <h1 className="text-3xl sm:text-4xl md:text-5xl font-extrabold tracking-tighter mb-3 text-foreground flex items-baseline">
                FructaVision<span className="text-primary text-4xl md:text-5xl">.</span>
              </h1>
              <p className="text-base md:text-lg text-muted-foreground leading-relaxed max-w-xl font-medium">
                Advanced AI-Powered Fruit Freshness Detection.<br />
                Objective quality analysis from farm to table.
              </p>
            </div>

            {result ? (
              <ResultCard result={result} onReset={handleReset} />
            ) : (
              <ScannerCard onAnalyze={handleAnalyze} isAnalyzing={isAnalyzing} />
            )}
          </div>

          {/* Right — Recent History panel */}
          <div className="2xl:w-80 2xl:flex-shrink-0">
            <div className="bg-card border border-border/50 rounded-3xl p-4 sm:p-5 shadow-sm 2xl:sticky 2xl:top-24">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-base font-semibold text-foreground">Recent History</h3>
                {recent.length > 0 && (
                  <button
                    onClick={() => navigate('/analytics')}
                    className="text-xs font-semibold text-primary hover:text-primary/80 transition-colors"
                  >
                    View All
                  </button>
                )}
              </div>

              {recent.length === 0 ? (
                <div className="py-10 text-center">
                  <p className="text-sm text-muted-foreground leading-relaxed">
                    No scans yet.<br />Upload or capture a fruit to get started.
                  </p>
                </div>
              ) : (
                <div className="space-y-2.5">
                  {recent.slice(0, 5).map((scan) => {
                    const badge = BADGE[scan.freshness];
                    return (
                      <div
                        key={scan.id}
                        className="flex items-center space-x-3 p-3 rounded-2xl bg-muted/30 hover:bg-muted/50 transition-colors"
                      >
                        {/* Emoji circle */}
                        <div className="w-10 h-10 rounded-full bg-background border border-border/50 flex items-center justify-center text-xl flex-shrink-0 shadow-sm">
                          {fruitEmoji(scan.fruit)}
                        </div>
                        {/* Text */}
                        <div className="flex-1 min-w-0">
                          <p className="font-semibold text-sm text-foreground truncate">{scan.fruit}</p>
                          <p className="text-xs text-muted-foreground mt-0.5">
                            {timeAgo(scan.createdAt)} &bull; {Math.round(scan.confidence * 100)}% Confidence
                          </p>
                        </div>
                        {/* Badge */}
                        <span className={`px-2.5 py-0.5 rounded-full text-[10px] font-bold tracking-wide flex-shrink-0 ${badge.className}`}>
                          {badge.label}
                        </span>
                      </div>
                    );
                  })}
                </div>
              )}
            </div>
          </div>

        </div>
      </div>
    </MainLayout>
  );
}
