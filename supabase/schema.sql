CREATE TABLE IF NOT EXISTS public.scans (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  fruit TEXT NOT NULL,
  freshness TEXT NOT NULL CHECK (freshness IN ('Fresh','Ripe','Overripe')),
  confidence FLOAT NOT NULL,
  shelf_life TEXT NOT NULL,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX scans_user_id_idx ON public.scans(user_id);
CREATE INDEX scans_created_at_idx ON public.scans(created_at DESC);

ALTER TABLE public.scans ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view own scans"
ON public.scans FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can insert own scans"
ON public.scans FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can delete own scans"
ON public.scans FOR DELETE USING (auth.uid() = user_id);

