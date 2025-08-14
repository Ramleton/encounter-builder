//? Helper Util

use reqwest::Client;

use crate::types::{
    auth_types::SupabaseConfig,
    statblock_types::{ConditionImmunityDB, StatBlock},
};

pub async fn save_statblock_condition_immunities_helper(
    stat_block: &StatBlock,
    config: &SupabaseConfig,
    client: &Client,
    access_token: &str,
) -> Result<String, String> {
    let condition_types = stat_block.condition_immunities_to_db().unwrap();

    delete_condition_immunities_matching_statblock_id(stat_block, config, client, access_token)
        .await?;

    for condition_type in condition_types {
        insert_condition_immunities(&condition_type, config, client, access_token).await?;
    }

    Ok("Damage Type inserts successful".to_string())
}

//? POST

pub async fn insert_condition_immunities(
    condition_type: &ConditionImmunityDB,
    config: &SupabaseConfig,
    client: &Client,
    access_token: &str,
) -> Result<String, String> {
    // Insert currently existing condition types for statblock
    let insert_url = format!("{}/rest/v1/ConditionImmunity", config.url);

    let insert_response = client
        .post(&insert_url)
        .header("apikey", &config.anon_key)
        .header("Authorization", format!("Bearer {}", access_token))
        .body(serde_json::to_string(&vec![condition_type]).map_err(|e| e.to_string())?)
        .send()
        .await
        .map_err(|e| format!("ConditionImmunity insert failed: {}", e))?;

    if !insert_response.status().is_success() {
        return Err(format!(
            "ConditionImmunity insert failed: {}",
            insert_response.text().await.unwrap_or_default()
        ));
    }

    Ok("ConditionImmunity insert successful".to_string())
}

//? GET

//? DELETE

pub async fn delete_condition_immunities_matching_statblock_id(
    stat_block: &StatBlock,
    config: &SupabaseConfig,
    client: &Client,
    access_token: &str,
) -> Result<String, String> {
    // Delete pre-existing condition immunities for statblock
    let delete_url = format!(
        "{}/rest/v1/ConditionImmunity?statblock_id=eq.{}",
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
        .map_err(|e| format!("ConditionImmunity delete failed: {}", e))?;

    if !delete_response.status().is_success() {
        return Err(format!(
            "ConditionImmunity delete failed: {}",
            delete_response.text().await.unwrap_or_default()
        ));
    }

    Ok("Condition Immunities successfully deleted".to_string())
}
