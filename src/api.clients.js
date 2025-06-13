import { createClient } from '@supabase/supabase-js';


// Create a single supabase client for interacting with your database
const supabaseUrl = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImJoa21hemd2Y3JncWVqdnZtcW15Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDc2NTM5NjAsImV4cCI6MjA2MzIyOTk2MH0.7PT8Y-oEaOLRjMUz2Vc4IL7Mh1bGNzLqK-2k1lx98Lk';
export const supabase = createClient('https://bhkmazgvcrgqejvvmqmy.supabase.co', supabaseUrl)
