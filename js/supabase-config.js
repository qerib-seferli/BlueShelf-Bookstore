// =========================================================
// Bu fayl Supabase bağlantı məlumatlarını saxlayır.
// Burada URL və public anon açarı təyin edilir.
// Bu açar client tərəfdə istifadə üçün nəzərdə tutulur.
// =========================================================

// SUPABASE_URL dəyişəni proyektin API ünvanını saxlayır.
const SUPABASE_URL = "https://filjgtwixjbmjeyhuukl.supabase.co"; // Supabase layihə URL-i.

// SUPABASE_ANON_KEY dəyişəni public anon açarı saxlayır.
const SUPABASE_ANON_KEY = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImZpbGpndHdpeGpibWpleWh1dWtsIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzU2Njc5MjQsImV4cCI6MjA5MTI0MzkyNH0.y06FhqZLt3aGyzvMJ5XZLjYv4AUM6cVvmnzR4pUC8Qs"; // Client üçün public açar.

// window.supabaseClient qlobal obyekt yaradırıq.
window.supabaseClient = window.supabase.createClient(SUPABASE_URL, SUPABASE_ANON_KEY); // Supabase client yaradılır.
