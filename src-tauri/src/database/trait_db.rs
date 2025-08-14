//? Helper Util

use reqwest::Client;

use crate::types::{auth_types::SupabaseConfig, statblock_types::StatBlock, trait_types::TraitDB};

pub async fn save_statblock_traits_helper(
    stat_block: &StatBlock,
    config: &SupabaseConfig,
    client: &Client,
    access_token: &str,
) -> Result<String, String> {
    let traits = stat_block.traits_to_db().unwrap();

    delete_traits_matching_statblock_id(stat_block, config, client, access_token).await?;

    for statblock_trait in traits {
        insert_traits(&statblock_trait, config, client, access_token).await?;
    }

    Ok("Trait inserts successful".to_string())
}

//? POST

pub async fn insert_traits(
    statblock_trait: &TraitDB,
    config: &SupabaseConfig,
    client: &Client,
    access_token: &str,
) -> Result<String, String> {
    // Insert currently existing condition types for statblock
    let insert_url = format!("{}/rest/v1/Trait", config.url);

    let insert_response = client
        .post(&insert_url)
        .header("apikey", &config.anon_key)
        .header("Authorization", format!("Bearer {}", access_token))
        .body(serde_json::to_string(&vec![statblock_trait]).map_err(|e| e.to_string())?)
        .send()
        .await
        .map_err(|e| format!("Trait insert failed: {}", e))?;

    if !insert_response.status().is_success() {
        return Err(format!(
            "Trait insert failed: {}",
            insert_response.text().await.unwrap_or_default()
        ));
    }

    Ok("Trait insert successful".to_string())
}

//? GET

//? DELETE

pub async fn delete_traits_matching_statblock_id(
    stat_block: &StatBlock,
    config: &SupabaseConfig,
    client: &Client,
    access_token: &str,
) -> Result<String, String> {
    // Delete pre-existing condition immunities for statblock
    let delete_url = format!(
        "{}/rest/v1/Trait?statblock_id=eq.{}",
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
        .map_err(|e| format!("Trait delete failed: {}", e))?;

    if !delete_response.status().is_success() {
        return Err(format!(
            "Trait delete failed: {}",
            delete_response.text().await.unwrap_or_default()
        ));
    }

    Ok("Traits successfully deleted".to_string())
}
