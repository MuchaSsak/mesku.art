import { createClient } from "@supabase/supabase-js";

import {
  SUPABASE_PUBLIC_ANON_KEY,
  SUPABASE_PUBLIC_URL,
} from "../utils/constants";

// Create a single supabase client for interacting with your database
const supabase = createClient(SUPABASE_PUBLIC_URL, SUPABASE_PUBLIC_ANON_KEY);

export default supabase;
