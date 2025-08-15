//? Helper Util

use reqwest::Client;

use crate::types::{auth_types::SupabaseConfig, spell_types::SpellsDB, statblock_types::StatBlock};

pub async fn save_statblock_spells_helper(
    stat_block: &StatBlock,
    config: &SupabaseConfig,
    client: &Client,
    access_token: &str,
) -> Result<String, String> {
    if let Ok(spells) = stat_block.spells_to_db() {
        delete_spells_matching_statblock_id(stat_block, config, client, access_token).await?;

        for spell in spells {
            insert_spells(&spell, config, client, access_token).await?;
        }
    }
    Ok("Spell inserts successful".to_string())
}

//? POST

pub async fn insert_spells(
    spells: &SpellsDB,
    config: &SupabaseConfig,
    client: &Client,
    access_token: &str,
) -> Result<String, String> {
    // Insert currently existing spells for statblock
    let insert_url = format!("{}/rest/v1/Spells", config.url);

    let insert_response = client
        .post(&insert_url)
        .header("apikey", &config.anon_key)
        .header("Authorization", format!("Bearer {}", access_token))
        .body(serde_json::to_string(&vec![spells]).map_err(|e| e.to_string())?)
        .send()
        .await
        .map_err(|e| format!("Spell insert failed: {}", e))?;

    if !insert_response.status().is_success() {
        return Err(format!(
            "Spell insert failed: {}",
            insert_response.text().await.unwrap_or_default()
        ));
    }

    Ok("Spell insert successful".to_string())
}

//? GET

//? DELETE

pub async fn delete_spells_matching_statblock_id(
    stat_block: &StatBlock,
    config: &SupabaseConfig,
    client: &Client,
    access_token: &str,
) -> Result<String, String> {
    // Delete pre-existing spells for statblock
    let delete_url = format!(
        "{}/rest/v1/Spells?statblock_id=eq.{}",
        config.url,
        stat_block.id.unwrap()
    );

    let delete_response = client
        .delete(&delete_url)
        .header("apikey", &config.anon_key)
        .header("Authorization", format!("Bearer {}", access_token))
        .header("Content-Type", "application/json")
        .send()
        .await
        .map_err(|e| format!("Spells delete failed: {}", e))?;

    if !delete_response.status().is_success() {
        return Err(format!(
            "Spells delete failed: {}",
            delete_response.text().await.unwrap_or_default()
        ));
    }

    Ok("Spells successfully deleted".to_string())
}
