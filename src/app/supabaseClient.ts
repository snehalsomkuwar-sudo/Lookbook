import { createClient, SupabaseClient } from "@supabase/supabase-js";

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

// Singleton pattern: reuse the same instance across HMR reloads by
// attaching it to `globalThis` so the GoTrueClient is never duplicated.
const GLOBAL_KEY = "__livspace_supabase_client__";

function getSupabaseClient(): SupabaseClient {
  if ((globalThis as Record<string, unknown>)[GLOBAL_KEY]) {
    return (globalThis as Record<string, unknown>)[GLOBAL_KEY] as SupabaseClient;
  }
  const client = createClient(supabaseUrl, supabaseAnonKey);
  (globalThis as Record<string, unknown>)[GLOBAL_KEY] = client;
  return client;
}

export const supabase = getSupabaseClient();
