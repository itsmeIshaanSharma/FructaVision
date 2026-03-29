import { useEffect, useState } from "react";
import { MainLayout } from "../layouts/MainLayout";
import {
  AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip,
  ResponsiveContainer, PieChart, Pie, Cell,
} from "recharts";
import { getAnalytics, getRecentScans, type AnalyticsData, type RecentScan, type FreshnessStatus } from "../services/api";
import { Loader2, RefreshCw } from "lucide-react";

const COLORS = ['hsl(var(--primary))', 'hsl(var(--destructive))'];

// Fruit name → emoji map
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
  Fresh: { label: 'FRESH', className: 'bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400' },
  Ripe: { label: 'RIPE', className: 'bg-yellow-100 text-yellow-700 dark:bg-yellow-900/30 dark:text-yellow-400' },
  Overripe: { label: 'OVERRIPE', className: 'bg-red-100 text-red-600 dark:bg-red-900/30 dark:text-red-400' },
};

function StatCard({ label, value, sub, valueClass }: { label: string; value: string | number; sub: string; valueClass?: string }) {
  return (
    <div className="bg-card border border-border/50 rounded-3xl p-6 shadow-sm">
      <h3 className="text-muted-foreground font-medium text-sm mb-1">{label}</h3>
      <p className={`text-4xl font-bold ${valueClass ?? 'text-foreground'}`}>{value}</p>
      <p className="text-xs font-medium mt-2 text-muted-foreground">{sub}</p>
    </div>
  );
}

export function Analytics() {
  const [data, setData] = useState<AnalyticsData | null>(null);
  const [recent, setRecent] = useState<RecentScan[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const load = async () => {
    setLoading(true);
    setError(null);
    try {
      const [analyticsResult, recentResult] = await Promise.all([getAnalytics(), getRecentScans()]);
      setData(analyticsResult);
      setRecent(recentResult);
    } catch (err) {
      console.error(err);
      setError('Failed to load analytics data. Make sure the Supabase DB is set up.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { load(); }, []);

  const freshnessData = data
    ? [
        { name: 'Fresh', value: data.freshPercent },
        { name: 'Spoiled', value: data.spoiledPercent },
      ]
    : [];

  return (
    <MainLayout>
      <div className="flex flex-col max-w-5xl mx-auto w-full space-y-6 md:space-y-8">

        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-4">
          <div>
            <h1 className="text-3xl sm:text-4xl font-extrabold tracking-tighter mb-2 text-foreground flex items-baseline">
              Analytics<span className="text-primary text-5xl">.</span>
            </h1>
            <p className="text-muted-foreground">Monitor your scanning activity and fresh produce statistics.</p>
          </div>
          <button
            onClick={load}
            disabled={loading}
            className="flex items-center space-x-2 text-muted-foreground hover:text-foreground bg-muted hover:bg-muted/80 px-4 py-2 rounded-xl text-sm font-medium transition-all disabled:opacity-50 self-start"
          >
            <RefreshCw className={`w-4 h-4 ${loading ? 'animate-spin' : ''}`} />
            <span>Refresh</span>
          </button>
        </div>

        {/* Error */}
        {error && (
          <div className="bg-destructive/10 text-destructive border border-destructive/20 rounded-2xl px-5 py-4 text-sm font-medium">
            {error}
          </div>
        )}

        {/* Loading */}
        {loading && !data && (
          <div className="flex items-center justify-center py-24">
            <Loader2 className="w-10 h-10 animate-spin text-primary/60" />
          </div>
        )}

        {data && (
          <>
            {/* Stat Cards */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 md:gap-6">
              <StatCard label="Total Scans (7 Days)" value={data.totalScans} sub={data.totalScans > 0 ? 'Keep scanning!' : 'No scans yet'} />
              <StatCard label="Avg Freshness Confidence" value={`${data.avgConfidence}%`} sub="Across all scanned items" />
              <StatCard label="Items Spoiled" value={data.spoiledCount} sub="Overripe items this week" valueClass="text-destructive" />
            </div>

            {/* Charts – only shown when there's data */}
            {data.totalScans > 0 && (
              <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                <div className="bg-card border border-border/50 rounded-3xl p-6 shadow-sm lg:col-span-2">
                  <h3 className="text-lg font-semibold mb-6">Scanning History (7 Days)</h3>
                  <div className="h-[280px] w-full">
                    <ResponsiveContainer width="100%" height="100%">
                      <AreaChart data={data.dailyScans} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                        <defs>
                          <linearGradient id="colorScans" x1="0" y1="0" x2="0" y2="1">
                            <stop offset="5%" stopColor="hsl(var(--primary))" stopOpacity={0.3} />
                            <stop offset="95%" stopColor="hsl(var(--primary))" stopOpacity={0} />
                          </linearGradient>
                        </defs>
                        <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="hsl(var(--border))" />
                        <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{ fill: 'hsl(var(--muted-foreground))' }} dy={10} />
                        <YAxis axisLine={false} tickLine={false} tick={{ fill: 'hsl(var(--muted-foreground))' }} allowDecimals={false} />
                        <Tooltip contentStyle={{ borderRadius: '12px', border: '1px solid hsl(var(--border))', backgroundColor: 'hsl(var(--card))' }} />
                        <Area type="monotone" dataKey="scans" stroke="hsl(var(--primary))" strokeWidth={3} fillOpacity={1} fill="url(#colorScans)" />
                      </AreaChart>
                    </ResponsiveContainer>
                  </div>
                </div>

                <div className="bg-card border border-border/50 rounded-3xl p-6 shadow-sm">
                  <h3 className="text-lg font-semibold mb-6">Freshness Breakdown</h3>
                  <div className="h-[240px] w-full">
                    <ResponsiveContainer width="100%" height="100%">
                      <PieChart>
                        <Pie data={freshnessData} cx="50%" cy="50%" innerRadius={65} outerRadius={95} paddingAngle={5} dataKey="value" stroke="none">
                          {freshnessData.map((_e, i) => <Cell key={i} fill={COLORS[i % COLORS.length]} />)}
                        </Pie>
                        <Tooltip formatter={(v) => [`${v}%`, '']} contentStyle={{ borderRadius: '12px', border: '1px solid hsl(var(--border))', backgroundColor: 'hsl(var(--card))' }} />
                      </PieChart>
                    </ResponsiveContainer>
                  </div>
                  <div className="flex justify-center flex-wrap gap-4 mt-2">
                    <div className="flex items-center space-x-2"><div className="w-3 h-3 rounded-full bg-primary" /><span className="text-sm font-medium">Fresh ({data.freshPercent}%)</span></div>
                    <div className="flex items-center space-x-2"><div className="w-3 h-3 rounded-full bg-destructive" /><span className="text-sm font-medium">Spoiled ({data.spoiledPercent}%)</span></div>
                  </div>
                </div>
              </div>
            )}

            {/* Recent History */}
            <div className="bg-card border border-border/50 rounded-3xl p-6 shadow-sm">
              <div className="flex items-center justify-between mb-5">
                <h3 className="text-lg font-semibold">Recent History</h3>
                {recent.length > 0 && (
                  <span className="text-xs text-muted-foreground font-medium">{recent.length} scan{recent.length !== 1 ? 's' : ''}</span>
                )}
              </div>

              {recent.length === 0 ? (
                <div className="py-12 text-center">
                  <p className="text-muted-foreground text-sm">No scans yet. Go to the Dashboard and analyze a fruit!</p>
                </div>
              ) : (
                <div className="space-y-3">
                  {recent.map((scan) => {
                    const badge = BADGE[scan.freshness];
                    return (
                      <div
                        key={scan.id}
                        className="flex items-center space-x-4 p-3.5 rounded-2xl bg-muted/30 hover:bg-muted/50 transition-colors"
                      >
                        {/* Fruit emoji circle */}
                        <div className="w-12 h-12 rounded-full bg-background border border-border/50 flex items-center justify-center text-2xl flex-shrink-0 shadow-sm">
                          {fruitEmoji(scan.fruit)}
                        </div>

                        {/* Info */}
                        <div className="flex-1 min-w-0">
                          <p className="font-semibold text-foreground truncate">{scan.fruit}</p>
                          <p className="text-xs text-muted-foreground mt-0.5">
                            {timeAgo(scan.createdAt)} &bull; {Math.round(scan.confidence * 100)}% Confidence
                          </p>
                        </div>

                        {/* Badge */}
                        <span className={`px-3 py-1 rounded-full text-xs font-bold tracking-wide flex-shrink-0 ${badge.className}`}>
                          {badge.label}
                        </span>
                      </div>
                    );
                  })}
                </div>
              )}
            </div>

          </>
        )}
      </div>
    </MainLayout>
  );
}
