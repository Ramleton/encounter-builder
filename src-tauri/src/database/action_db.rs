use reqwest::Client;

use crate::types::{
    action_types::ActionDB,
    auth_types::SupabaseConfig,
    statblock_types::{StatBlock, StatBlockFromDB},
};

//? Helper Util

pub async fn save_statblock_actions_helper(
    stat_block: &StatBlock,
    config: &SupabaseConfig,
    client: &Client,
    access_token: &str,
) -> Result<String, String> {
    let table_names = vec!["Action", "BonusAction", "Reaction", "LegendaryAction"];
    let actions = stat_block.actions_to_db()?;

    for table_name in &table_names {
        delete_actions_matching_statblock_id(
            &stat_block,
            &config,
            &client,
            &access_token,
            &table_name,
        )
        .await?;

        for action in actions.get(&table_name.to_string()).unwrap() {
            insert_action(action, config, client, access_token, &table_name).await?;
        }
    }

    Ok("Action inserts successful".to_string())
}

//? POST

pub async fn insert_action(
    action: &ActionDB,
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

//? GET

pub async fn retrieve_actions_matching_statblock_id(
    stat_block: &StatBlockFromDB,
    config: &SupabaseConfig,
    client: &Client,
    access_token: &str,
    table_name: &str,
) -> Result<Vec<ActionDB>, String> {
    // Retrieve actions for statblock
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

    let actions: Vec<ActionDB> = get_response
        .json()
        .await
        .map_err(|e| format!("Failed to parse Action response: {}", e))?;

    Ok(actions)
}

//? DELETE

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
