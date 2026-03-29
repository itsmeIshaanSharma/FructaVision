-- ============================================================
-- FructaVision Database Schema
-- Run this in: Supabase Dashboard → SQL Editor → New Query
-- ============================================================

-- Scans table: stores every fruit analysis result per user
CREATE TABLE IF NOT EXISTS public.scans (
  id           UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id      UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  fruit        TEXT NOT NULL,
  freshness    TEXT NOT NULL CHECK (freshness IN ('Fresh', 'Ripe', 'Overripe')),
  confidence   FLOAT NOT NULL,
  shelf_life   TEXT NOT NULL,
  created_at   TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- Index for fast per-user queries (Analytics page)
CREATE INDEX IF NOT EXISTS scans_user_id_idx ON public.scans(user_id);
CREATE INDEX IF NOT EXISTS scans_created_at_idx ON public.scans(created_at DESC);

-- ============================================================
-- Row Level Security (RLS): each user only sees their own data
-- ============================================================
ALTER TABLE public.scans ENABLE ROW LEVEL SECURITY;

-- Policy: users can only SELECT their own rows
CREATE POLICY "Users can view own scans"
  ON public.scans FOR SELECT
  USING (auth.uid() = user_id);

-- Policy: users can only INSERT their own rows
CREATE POLICY "Users can insert own scans"
  ON public.scans FOR INSERT
  WITH CHECK (auth.uid() = user_id);

-- Policy: users can only DELETE their own rows
CREATE POLICY "Users can delete own scans"
  ON public.scans FOR DELETE
  USING (auth.uid() = user_id);
