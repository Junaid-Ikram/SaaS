// src/utils/supabase.js
import { createClient } from '@supabase/supabase-js';

const supabaseUrl = 'https://cfnpvgbhxmvheldpiysj.supabase.co'; // Replace with your Supabase URL
const supabaseKey = 'sb_publishable_nQKVyE885MSjvCJGCvdw2Q_SwJpEYy3'; // Replace with your Supabase anon key
export const supabase = createClient(supabaseUrl, supabaseKey);