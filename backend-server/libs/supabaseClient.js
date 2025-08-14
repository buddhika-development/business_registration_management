import { createClient } from "@supabase/supabase-js";

const url = process.env.SUPABASE_URL;

export const adminClient = createClient(url, process.env.SUPABASE_SERVICE_ROLE_KEY, {
    auth: { persistSession: false },
})