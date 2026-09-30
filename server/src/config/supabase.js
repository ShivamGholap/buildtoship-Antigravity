import { createClient } from "@supabase/supabase-js";
import { env } from "./env.js";

/**
 * Public client for auth verification (validating JWT tokens)
 */
export const supabaseAuth = createClient(env.SUPABASE_URL, env.SUPABASE_ANON_KEY, {
  auth: {
    persistSession: false,
    autoRefreshToken: false,
  },
});

/**
 * Creates an RLS-scoped Supabase client that forwards the authenticated user's JWT.
 * Every SQL operation performed by this client is governed by Row Level Security policies
 * for the authenticated user (auth.uid()).
 */
export function createUserClient(token) {
  return createClient(env.SUPABASE_URL, env.SUPABASE_ANON_KEY, {
    auth: {
      persistSession: false,
      autoRefreshToken: false,
    },
    global: {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    },
  });
}
