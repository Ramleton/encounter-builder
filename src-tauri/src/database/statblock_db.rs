use crate::{types::statblock_types::StatBlock, utils::supabase_util::init_supabase};

#[tauri::command]
pub async fn save_statblock(statBlock: StatBlock, accessToken: String) -> Result<String, String> {
    let config = init_supabase().await?;
    let client = reqwest::Client::new();

    let url = format!("{}/rest/v1/StatBlock", config.url);

    let insert_obj = statBlock.to_db();

    let response = client
        .post(&url)
        .header("apikey", &config.anon_key)
        .header("Authorization", format!("Bearer {}", &accessToken))
        .header("Content-Type", "application/json")
        .body(serde_json::to_string(&vec![insert_obj]).map_err(|e| e.to_string())?)
        .send()
        .await
        .map_err(|e| e.to_string())?;

    if response.status().is_success() {
        Ok(response.text().await.map_err(|e| e.to_string())?)
    } else {
        Err(format!(
            "Supabase error {}: {}",
            response.status(),
            response.text().await.unwrap_or_default()
        ))
    }
}
