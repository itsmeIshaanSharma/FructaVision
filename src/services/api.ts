import { supabase } from '../lib/supabase';

export type FreshnessStatus = 'Fresh' | 'Ripe' | 'Overripe';

export interface AnalysisResponse {
  fruit: string;
  freshness: FreshnessStatus;
  confidence: number;
  shelfLife: string;
}

export interface DailyScans {
  name: string;
  scans: number;
}

export interface AnalyticsData {
  totalScans: number;
  avgConfidence: number;
  spoiledCount: number;
  freshPercent: number;
  spoiledPercent: number;
  dailyScans: DailyScans[];
}

export interface RecentScan {
  id: string;
  fruit: string;
  freshness: FreshnessStatus;
  confidence: number;
  shelfLife: string;
  createdAt: string; // ISO string
}

// ML Inference endpoint resolution (deployment-safe):
// 1) VITE_API_ANALYZE_URL (full endpoint)
// 2) VITE_HF_SPACE_URL + /api/analyze
// 3) /api/analyze (same-origin reverse proxy route)
const HF_URL = import.meta.env.VITE_HF_SPACE_URL as string | undefined;
const API_ANALYZE_URL = import.meta.env.VITE_API_ANALYZE_URL as string | undefined;

async function callMLModel(fileOrImageSrc: File | string): Promise<AnalysisResponse> {
  const formData = new FormData();

  if (typeof fileOrImageSrc === 'string') {
    // Convert base64 data URL to Blob (from camera capture)
    const response = await fetch(fileOrImageSrc);
    const blob = await response.blob();
    formData.append('file', blob, 'camera_capture.jpg');
  } else {
    formData.append('file', fileOrImageSrc);
  }

  const apiUrl = API_ANALYZE_URL || (HF_URL ? `${HF_URL}/api/analyze` : '/api/analyze');

  const res = await fetch(apiUrl, {
    method: 'POST',
    body: formData,
  });

  if (!res.ok) {
    throw new Error(`Model API responded with ${res.status}: ${res.statusText}`);
  }

  return res.json() as Promise<AnalysisResponse>;
}

/**
 * Main function: calls ML model, saves result to Supabase, returns result.
 */
export async function analyzeImage(fileOrImageSrc: File | string): Promise<AnalysisResponse> {
  let result: AnalysisResponse;

  try {
    result = await callMLModel(fileOrImageSrc);
  } catch (error) {
    console.error('ML model call failed, using mock fallback:', error);
    result = await mockAnalysis();
  }

  // Save scan to Supabase DB (best-effort — don't block UI if this fails)
  try {
    const { data: { user } } = await supabase.auth.getUser();
    if (user) {
      await supabase.from('scans').insert({
        user_id: user.id,
        fruit: result.fruit,
        freshness: result.freshness,
        confidence: result.confidence,
        shelf_life: result.shelfLife,
      });
    }
  } catch (dbError) {
    console.warn('Failed to save scan to database:', dbError);
  }

  return result;
}

/**
 * Fetches analytics data for the current user from Supabase.
 */
export async function getAnalytics(): Promise<AnalyticsData> {
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) throw new Error('Not authenticated');

  // Fetch all scans for this user from the last 7 days
  const sevenDaysAgo = new Date();
  sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 7);

  const { data, error } = await supabase
    .from('scans')
    .select('*')
    .eq('user_id', user.id)
    .gte('created_at', sevenDaysAgo.toISOString())
    .order('created_at', { ascending: true });

  if (error) throw error;

  const scans = data ?? [];
  const totalScans = scans.length;
  const avgConfidence = totalScans > 0
    ? Math.round((scans.reduce((sum, s) => sum + s.confidence, 0) / totalScans) * 100)
    : 0;

  const spoiledCount = scans.filter(s => s.freshness === 'Overripe').length;
  const freshCount = scans.filter(s => s.freshness === 'Fresh').length;
  const freshPercent = totalScans > 0 ? Math.round((freshCount / totalScans) * 100) : 0;
  const spoiledPercent = totalScans > 0 ? Math.round((spoiledCount / totalScans) * 100) : 0;

  // Group scans by day-of-week label (Mon, Tue, ...)
  const dayLabels = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
  const dayCounts: Record<string, number> = {};

  // Initialize for the last 7 days in order
  for (let i = 6; i >= 0; i--) {
    const d = new Date();
    d.setDate(d.getDate() - i);
    dayCounts[dayLabels[d.getDay()]] = 0;
  }

  scans.forEach(scan => {
    const day = dayLabels[new Date(scan.created_at).getDay()];
    if (dayCounts[day] !== undefined) {
      dayCounts[day]++;
    }
  });

  const dailyScans: DailyScans[] = Object.entries(dayCounts).map(([name, scans]) => ({ name, scans }));

  return { totalScans, avgConfidence, spoiledCount, freshPercent, spoiledPercent, dailyScans };
}

// Fallback mock for when neither HF Space nor local backend is available
async function mockAnalysis(): Promise<AnalysisResponse> {
  await new Promise(resolve => setTimeout(resolve, 1500));
  const mockFruits = ['Apple', 'Banana', 'Mango', 'Avocado', 'Strawberry', 'Orange'];
  const randomFruit = mockFruits[Math.floor(Math.random() * mockFruits.length)];
  const statusOptions: FreshnessStatus[] = ['Fresh', 'Ripe', 'Overripe'];
  const status = statusOptions[Math.floor(Math.random() * statusOptions.length)];

  return {
    fruit: randomFruit,
    freshness: status,
    confidence: Number((Math.random() * (0.99 - 0.70) + 0.70).toFixed(2)),
    shelfLife:
      status === 'Fresh' ? '7-10 days' : status === 'Ripe' ? '2-4 days' : '< 1 day (Consume immediately)',
  };
}

/**
 * Fetches the 10 most recent scans for the current user.
 */
export async function getRecentScans(): Promise<RecentScan[]> {
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return [];

  const { data, error } = await supabase
    .from('scans')
    .select('*')
    .eq('user_id', user.id)
    .order('created_at', { ascending: false })
    .limit(10);

  if (error) throw error;

  return (data ?? []).map(row => ({
    id: row.id as string,
    fruit: row.fruit as string,
    freshness: row.freshness as FreshnessStatus,
    confidence: row.confidence as number,
    shelfLife: row.shelf_life as string,
    createdAt: row.created_at as string,
  }));
}

