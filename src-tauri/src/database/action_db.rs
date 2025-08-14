use reqwest::Client;

use crate::types::{
    auth_types::SupabaseConfig,
    statblock_types::{ActionDB, StatBlock},
};

pub async fn insert_action(
    action: ActionDB<'_>,
    config: &SupabaseConfig,
    client: &Client,
    access_token: &str,
    table_name: &str,
) -> Result<String, String> {
    // Insert currently existing actions for statblock
    let insert_url = format!("{}/rest/v1/{}", config.url, table_name);

    let insert_response = client
        .post(&insert_url)
        .header("apikey", &config.anon_key)
        .header("Authorization", format!("Bearer {}", access_token))
        .body(serde_json::to_string(&vec![action]).map_err(|e| e.to_string())?)
        .send()
        .await
        .map_err(|e| format!("{} insert failed: {}", table_name, e))?;

    if !insert_response.status().is_success() {
        return Err(format!(
            "{} insert failed: {}",
            table_name,
            insert_response.text().await.unwrap_or_default()
        ));
    }

    Ok(format!("{} insert successful", table_name))
}

pub async fn delete_actions_matching_statblock_id(
    stat_block: &StatBlock,
    config: &SupabaseConfig,
    client: &Client,
    access_token: &str,
    table_name: &str,
) -> Result<String, String> {
    // Delete pre-existing actions for statblock
    let delete_url = format!(
        "{}/rest/v1/{}?statblock_id=eq.{}",
        config.url,
        table_name,
        stat_block.id.unwrap()
    );

    let delete_response = client
        .delete(&delete_url)
        .header("apikey", &config.anon_key)
        .header("Authorization", format!("Bearer {}", access_token))
        .header("Content-Type", "application/json")
        .send()
        .await
        .map_err(|e| format!("{} delete failed: {}", table_name, e))?;

    if !delete_response.status().is_success() {
        return Err(format!(
            "{} delete failed: {}",
            table_name,
            delete_response.text().await.unwrap_or_default()
        ));
    }

    Ok(format!("{}s successfully deleted", table_name))
}
