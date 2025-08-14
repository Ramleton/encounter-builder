use serde::{Deserialize, Serialize};

use crate::{
    database::{
        action_db::save_statblock_actions_helper,
        condition_type_db::save_statblock_condition_immunities_helper,
        damage_type_db::save_statblock_damage_types_helper, trait_db::save_statblock_traits_helper,
    },
    types::{
        action_types::ActionDB,
        damage_types::DamageTypeDB,
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

#[derive(Serialize, Deserialize, Debug)]
pub struct RetrieveStatBlockActionsResponse {
    pub actions: Vec<ActionDB>,
    pub bonus_actions: Vec<ActionDB>,
    pub reactions: Vec<ActionDB>,
    pub legendary_actions: Vec<ActionDB>,
}

#[derive(Serialize, Deserialize, Debug)]
pub struct RetrieveStatBlockDamageTypesResponse {
    pub resistances: Vec<DamageTypeDB>,
    pub immunities: Vec<DamageTypeDB>,
    pub vulnerabilities: Vec<DamageTypeDB>,
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
        save_statblock_traits_helper(&stat_block, &config, &client, &access_token).await?;
        save_statblock_damage_types_helper(&stat_block, &config, &client, &access_token).await?;
        save_statblock_condition_immunities_helper(&stat_block, &config, &client, &access_token)
            .await?;

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
pub async fn fetch_statblocks_with_joins(
    access_token: String,
) -> Result<RetrieveStatBlockResponse, String> {
    let config = init_supabase().await.map_err(|e| e.to_string())?;
    let client = reqwest::Client::new();

    let query = "select=*,\
        Action(name, description),\
        BonusAction(name, description),\
        Reaction(name, description),\
        LegendaryAction(name, description),\
        DamageResistance(damage_type),\
        DamageImmunity(damage_type),\
        DamageVulnerability(damage_type),\
        ConditionImmunity(condition_type),\
        Trait(name, description)
    ";

    let get_url = format!("{}/rest/v1/StatBlock?{}", config.url, query);

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

    let statblock_join: Vec<StatBlockFromDB> = response
        .json()
        .await
        .map_err(|e| format!("Failed to parse StatBlock response: {}", e))?;

    println!("{:?}", statblock_join);

    let statblocks: Vec<StatBlock> = statblock_join
        .into_iter()
        .map(|sb_with_relations| StatBlock::statblock_from_db(&sb_with_relations))
        .collect();

    Ok(RetrieveStatBlockResponse {
        statblocks,
        status: status.as_u16(),
        message: "Successfully retrieved statblocks with relations".to_string(),
    })
}
