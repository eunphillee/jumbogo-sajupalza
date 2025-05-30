import { createClient } from '@supabase/supabase-js';
import type { Database } from '@/types';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || 'https://demo.supabase.co';
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || 'demo-key';

export const supabase = createClient<Database>(supabaseUrl, supabaseAnonKey);

// 서버 사이드에서 사용할 admin 클라이언트
export const supabaseAdmin = createClient<Database>(
  supabaseUrl,
  process.env.SUPABASE_SERVICE_ROLE_KEY || 'demo-key'
); 