use crate::types::auth_types::SupabaseConfig;

pub async fn init_supabase() -> Result<SupabaseConfig, String> {
    Ok(SupabaseConfig {
        url: std::env::var("SUPABASE_URL").unwrap_or_else(|_| "https://jnyokkwidbszakhjttno.supabase.co".to_string()),
        anon_key: std::env::var("SUPABASE_ANON_KEY")
            .unwrap_or_else(|_| "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImpueW9ra3dpZGJzemFraGp0dG5vIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTMyODY4OTIsImV4cCI6MjA2ODg2Mjg5Mn0.8cG_DFiR4-iHryR5aMFhgOvLTYxAnauwquDwMlUvsaQ".to_string()),
    })
}
