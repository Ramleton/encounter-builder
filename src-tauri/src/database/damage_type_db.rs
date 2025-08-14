//? POST

use reqwest::Client;

use crate::types::{
    auth_types::SupabaseConfig,
    statblock_types::{DamageTypeDB, StatBlock, StatBlockFromDB},
};

//? Helper Util

pub async fn save_statblock_damage_types_helper(
    stat_block: &StatBlock,
    config: &SupabaseConfig,
    client: &Client,
    access_token: &str,
) -> Result<String, String> {
    let table_names = vec!["DamageResistance", "DamageImmunity", "DamageVulnerability"];
    let damage_types = stat_block.damage_types_to_db()?;

    for table_name in &table_names {
        delete_damage_types_matching_statblock_id(
            stat_block,
            config,
            client,
            access_token,
            table_name,
        )
        .await?;

        for damage_type in damage_types.get(&table_name.to_string()).unwrap() {
            insert_damage_types(damage_type, config, client, access_token, table_name).await?;
        }
    }
    Ok("Damage Type inserts successful".to_string())
}

pub async fn insert_damage_types(
    damage_type: &DamageTypeDB,
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
        .body(serde_json::to_string(&vec![damage_type]).map_err(|e| e.to_string())?)
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

//? GET

pub async fn retrieve_damage_types_matching_statblock_id(
    stat_block: &StatBlockFromDB,
    config: &SupabaseConfig,
    client: &Client,
    access_token: &str,
    table_name: &str,
) -> Result<Vec<DamageTypeDB>, String> {
    // Retrieve damage types for statblock
    let get_url = format!(
        "{}/rest/v1/{}?statblock_id=eq.{}",
        config.url, table_name, stat_block.id
    );

    let get_response = client
        .get(&get_url)
        .header("apikey", &config.anon_key)
        .header("Authorization", format!("Bearer {}", access_token))
        .header("Content-Type", "application/json")
        .send()
        .await
        .map_err(|e| format!("{} fetch failed: {}", table_name, e))?;

    if !get_response.status().is_success() {
        return Err(format!(
            "{} fetch failed: {}",
            table_name,
            get_response.text().await.unwrap_or_default()
        ));
    }

    let damage_types: Vec<DamageTypeDB> = get_response
        .json()
        .await
        .map_err(|e| format!("Failed to parse DamageType response: {}", e))?;

    Ok(damage_types)
}

//? DELETE

pub async fn delete_damage_types_matching_statblock_id(
    stat_block: &StatBlock,
    config: &SupabaseConfig,
    client: &Client,
    access_token: &str,
    table_name: &str,
) -> Result<String, String> {
    // Delete pre-existing damage types for statblock
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
