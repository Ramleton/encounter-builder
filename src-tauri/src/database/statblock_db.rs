use serde::{Deserialize, Serialize};

use crate::{types::statblock_types::StatBlock, utils::supabase_util::init_supabase};

#[derive(Serialize, Deserialize, Debug)]
pub struct SaveStatBlockResponse {
    pub id: i64,
    pub name: String,
    pub message: String,
    pub was_updated: bool,
}

#[tauri::command]
pub async fn save_statblock(
    stat_block: StatBlock,
    access_token: String,
) -> Result<SaveStatBlockResponse, String> {
    let config = init_supabase().await?;
    let client = reqwest::Client::new();
    let insert_obj = stat_block.to_db();

    if let Some(id) = stat_block.id {
        // Update existing StatBlock
        let url = format!("{}/rest/v1/StatBlock?id=eq.{}", config.url, id);

        let response = client
            .patch(&url)
            .header("apikey", &config.anon_key)
            .header("Authorization", format!("Bearer {}", &access_token))
            .header("Content-Type", "application/json")
            .header("Prefer", "return=representation")
            .body(serde_json::to_string(&vec![insert_obj]).map_err(|e| e.to_string())?)
            .send()
            .await
            .map_err(|e| e.to_string())?;

        if response.status().is_success() {
            let response_text = response.text().await.map_err(|e| e.to_string())?;
            let returned_records: Vec<serde_json::Value> = serde_json::from_str(&response_text)
                .map_err(|e| format!("Failed to parse response: {}", e))?;

            if let Some(record) = returned_records.first() {
                let returned_id = record
                    .get("id")
                    .and_then(|v| v.as_i64())
                    .ok_or("No ID returned from update")?;

                Ok(SaveStatBlockResponse {
                    id: returned_id,
                    name: stat_block.name.clone(),
                    message: "StatBlock updated successfully".to_string(),
                    was_updated: true,
                })
            } else {
                Err("No data returned from update".to_string())
            }
        } else {
            Err(format!(
                "Supabase update error {}: {}",
                response.status(),
                response.text().await.unwrap_or_default()
            ))
        }
    } else {
        // INSERT new record
        let url = format!("{}/rest/v1/StatBlock", config.url);

        let response = client
            .post(&url)
            .header("apikey", &config.anon_key)
            .header("Authorization", format!("Bearer {}", &access_token))
            .header("Content-Type", "application/json")
            .header("Prefer", "return=representation")
            .body(serde_json::to_string(&vec![insert_obj]).map_err(|e| e.to_string())?)
            .send()
            .await
            .map_err(|e| e.to_string())?;

        if response.status().is_success() {
            let response_text = response.text().await.map_err(|e| e.to_string())?;
            let returned_records: Vec<serde_json::Value> = serde_json::from_str(&response_text)
                .map_err(|e| format!("Failed to parse response: {}", e))?;

            if let Some(record) = returned_records.first() {
                let new_id = record
                    .get("id")
                    .and_then(|v| v.as_i64())
                    .ok_or("No ID returned from insert")?;

                Ok(SaveStatBlockResponse {
                    id: new_id,
                    name: stat_block.name.clone(),
                    message: "StatBlock created successfully".to_string(),
                    was_updated: false,
                })
            } else {
                Err("No data returned from insert".to_string())
            }
        } else {
            Err(format!(
                "Supabase insert error {}: {}",
                response.status(),
                response.text().await.unwrap_or_default()
            ))
        }
    }
}
