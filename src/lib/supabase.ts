import { createClient } from '@supabase/supabase-js';

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL as string;
// Accept either naming convention for the key
const supabaseAnonKey = (
  import.meta.env.VITE_SUPABASE_ANON_KEY ||
  import.meta.env.VITE_SUPABASE_PUBLISHABLE_DEFAULT_KEY
) as string;

if (!supabaseUrl || !supabaseAnonKey) {
  throw new Error(
    'Missing Supabase environment variables. Make sure VITE_SUPABASE_URL and ' +
    'VITE_SUPABASE_ANON_KEY (or VITE_SUPABASE_PUBLISHABLE_DEFAULT_KEY) are set in your .env file.'
  );
}

export const supabase = createClient(supabaseUrl, supabaseAnonKey);
