use reqwest::Client;
use serde::{Deserialize, Serialize};

use crate::{
    database::action_db::{delete_actions_matching_statblock_id, insert_action},
    types::{
        auth_types::SupabaseConfig,
        statblock_types::{StatBlock, StatBlockFromDB},
    },
    utils::supabase_util::init_supabase,
};

#[derive(Serialize, Deserialize, Debug)]
pub struct SaveStatBlockResponse {
    pub id: i64,
    pub name: String,
    pub message: String,
    pub was_updated: bool,
}

#[derive(Serialize, Deserialize, Debug)]
pub struct RetrieveStatBlockResponse {
    pub statblocks: Vec<StatBlock>,
    pub status: u16,
    pub message: String,
}

async fn save_statblock_actions_helper(
    stat_block: &StatBlock,
    config: &SupabaseConfig,
    client: &Client,
    access_token: &str,
) -> Result<String, String> {
    delete_actions_matching_statblock_id(&stat_block, &config, &client, &access_token, "Action")
        .await?;
    delete_actions_matching_statblock_id(
        &stat_block,
        &config,
        &client,
        &access_token,
        "BonusAction",
    )
    .await?;
    delete_actions_matching_statblock_id(&stat_block, &config, &client, &access_token, "Reaction")
        .await?;
    delete_actions_matching_statblock_id(
        &stat_block,
        &config,
        &client,
        &access_token,
        "LegendaryAction",
    )
    .await?;

    let actions = stat_block.actions_to_db()?;
    for action in actions.get("Action").unwrap() {
        insert_action(action, config, client, access_token, "Action").await?;
    }
    for bonus_action in actions.get("BonusAction").unwrap() {
        insert_action(bonus_action, config, client, access_token, "BonusAction").await?;
    }
    for reaction in actions.get("Reaction").unwrap() {
        insert_action(reaction, config, client, access_token, "Reaction").await?;
    }
    for legendary_action in actions.get("LegendaryAction").unwrap() {
        insert_action(
            legendary_action,
            config,
            client,
            access_token,
            "LegendaryAction",
        )
        .await?;
    }

    Ok("Action inserts successful".to_string())
}

#[tauri::command]
pub async fn save_statblock(
    mut stat_block: StatBlock,
    access_token: String,
) -> Result<SaveStatBlockResponse, String> {
    let config = init_supabase().await.map_err(|e| e.to_string())?;
    let client = reqwest::Client::new();
    let insert_obj = stat_block.statblock_to_db();

    let (method, url) = if let Some(id) = stat_block.id {
        (
            reqwest::Method::PATCH,
            format!("{}/rest/v1/StatBlock?id=eq.{}", config.url, id),
        )
    } else {
        (
            reqwest::Method::POST,
            format!("{}/rest/v1/StatBlock", config.url),
        )
    };

    let response = client
        .request(method.clone(), &url)
        .header("apikey", &config.anon_key)
        .header("Authorization", format!("Bearer {}", &access_token))
        .header("Content-Type", "application/json")
        .header("Prefer", "return=representation")
        .body(serde_json::to_string(&vec![insert_obj]).map_err(|e| e.to_string())?)
        .send()
        .await
        .map_err(|e| format!("Request failed: {}", e))?;

    let status = response.status();
    let text = response.text().await.map_err(|e| e.to_string())?;

    if !status.is_success() {
        return Err(format!(
            "Supabase {} error {}: {}",
            if method == reqwest::Method::PATCH {
                "update"
            } else {
                "insert"
            },
            status,
            text
        ));
    }

    let returned_records: Vec<serde_json::Value> =
        serde_json::from_str(&text).map_err(|e| format!("Failed to parse response: {}", e))?;

    if let Some(record) = returned_records.first() {
        let id = record
            .get("id")
            .and_then(|v| v.as_i64())
            .ok_or("No ID returned from Supabase")?;

        //? StatBlock must exist now

        stat_block.id = Some(id);

        save_statblock_actions_helper(&stat_block, &config, &client, &access_token).await?;

        return Ok(SaveStatBlockResponse {
            id,
            name: stat_block.name.clone(),
            message: if method == reqwest::Method::PATCH {
                "StatBlock updated successfully".to_string()
            } else {
                "StatBlock created successfully".to_string()
            },
            was_updated: method == reqwest::Method::PATCH,
        });
    }

    Err("No data returned from Supabase".to_string())
}

#[tauri::command]
pub async fn fetch_statblocks(access_token: String) -> Result<RetrieveStatBlockResponse, String> {
    let config = init_supabase().await.map_err(|e| e.to_string())?;
    let client = reqwest::Client::new();

    let get_url = format!("{}/rest/v1/StatBlock", config.url);

    let response = client
        .get(&get_url)
        .header("apikey", &config.anon_key)
        .header("Authorization", format!("Bearer {}", access_token))
        .header("Content-Type", "application/json")
        .send()
        .await
        .map_err(|e| format!("StatBlock fetch failed: {}", e))?;

    let status = response.status();

    if !status.is_success() {
        let error_text = response.text().await.unwrap_or_default();
        return Err(format!("StatBlock fetch failed: {}", error_text));
    }

    let data: Vec<StatBlockFromDB> = response
        .json()
        .await
        .map_err(|e| format!("Failed to parse StatBlock response: {}", e))?;

    let statblocks = data
        .iter()
        .map(|db_sb| StatBlock::statblock_from_db(db_sb))
        .collect();

    Ok(RetrieveStatBlockResponse {
        statblocks,
        status: status.as_u16(),
        message: "Successfully retrieved statblocks".to_string(),
    })
}
