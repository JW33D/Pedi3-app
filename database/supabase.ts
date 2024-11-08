import { createClient } from '@supabase/supabase-js';
import { Database } from './db_types';
import AsyncStorage from '@react-native-async-storage/async-storage';

const supabaseUrl = "https://wytzwiryaqjrsladjhst.supabase.co"
const supabaseAnonKey = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Ind5dHp3aXJ5YXFqcnNsYWRqaHN0Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3Mjc1NTMzODgsImV4cCI6MjA0MzEyOTM4OH0.Ae8HPyTKIt8RduNoafNtXWSmONRDFQ34PCfrkfZIvCU"

export const supabase = createClient<Database>(supabaseUrl, supabaseAnonKey,{
    auth:{
        storage: AsyncStorage,
        autoRefreshToken: true,
        persistSession:true,
        detectSessionInUrl: false,
    },
});
