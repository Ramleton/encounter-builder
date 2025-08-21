use serde::{Deserialize, Serialize};

use crate::{
    types::encounter_types::{Encounter, EncounterPlayer, PlayableStatBlock},
    utils::supabase_util::init_supabase,
};

#[derive(Serialize, Deserialize, Debug)]
pub struct SaveEncounterResponse {
    pub id: i64,
    pub status: u16,
    pub message: String,
    pub was_updated: bool,
}

#[derive(Serialize, Deserialize, Debug)]
pub struct SavePlayableStatBlocksResponse {
    pub message: String,
}

#[derive(Serialize, Deserialize, Debug)]
pub struct SaveEncounterPlayersResponse {
    pub message: String,
}

//? GET

//? UPSERT

#[tauri::command]
pub async fn save_encounter_players(
    encounter_players: Vec<EncounterPlayer>,
    access_token: String,
) -> Result<SaveEncounterPlayersResponse, String> {
    let config = init_supabase().await.map_err(|e| e.to_string())?;
    let client = reqwest::Client::new();
    for player in encounter_players {
        let insert_obj = player.clone();

        let (method, url) = if let Some(id) = player.id {
            (
                reqwest::Method::PATCH,
                format!("{}/rest/v1/EncounterPlayer?id=eq.{}", config.url, id),
            )
        } else {
            (
                reqwest::Method::POST,
                format!("{}/rest/v1/EncounterPlayer", config.url),
            )
        };

        let response = client
            .request(method.clone(), &url)
            .header("apikey", &config.anon_key)
            .header("Authorization", format!("Bearer {}", &access_token))
            .header("Content-Type", "application/json")
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
    }
    return Ok(SaveEncounterPlayersResponse {
        message: "EncounterPlayers saved successfully".to_string(),
    });
}

#[tauri::command]
pub async fn save_playable_statblocks(
    playable_stat_blocks: Vec<PlayableStatBlock>,
    access_token: String,
) -> Result<SavePlayableStatBlocksResponse, String> {
    let config = init_supabase().await.map_err(|e| e.to_string())?;
    let client = reqwest::Client::new();
    for statblock in playable_stat_blocks {
        let insert_obj = statblock.clone();

        let (method, url) = if let Some(id) = statblock.id {
            (
                reqwest::Method::PATCH,
                format!("{}/rest/v1/PlayableStatBlock?id=eq.{}", config.url, id),
            )
        } else {
            (
                reqwest::Method::POST,
                format!("{}/rest/v1/PlayableStatBlock", config.url),
            )
        };

        let response = client
            .request(method.clone(), &url)
            .header("apikey", &config.anon_key)
            .header("Authorization", format!("Bearer {}", &access_token))
            .header("Content-Type", "application/json")
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
    }
    return Ok(SavePlayableStatBlocksResponse {
        message: "PlayableStatBlocks saved successfully".to_string(),
    });
}

#[tauri::command]
pub async fn save_encounter(
    mut encounter: Encounter,
    access_token: String,
) -> Result<SaveEncounterResponse, String> {
    let config = init_supabase().await.map_err(|e| e.to_string())?;
    let client = reqwest::Client::new();
    let insert_obj = encounter.clone();

    let (method, url) = if let Some(id) = encounter.id {
        (
            reqwest::Method::PATCH,
            format!("{}/rest/v1/Encounter?id=eq.{}", config.url, id),
        )
    } else {
        (
            reqwest::Method::POST,
            format!("{}/rest/v1/Encounter", config.url),
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

        //? Encounter must exist now

        encounter.id = Some(id);

        return Ok(SaveEncounterResponse {
            id,
            status: status.as_u16(),
            message: if method == reqwest::Method::PATCH {
                "Encounter updated successfully".to_string()
            } else {
                "Encounter created successfully".to_string()
            },
            was_updated: method == reqwest::Method::PATCH,
        });
    }

    Err("No data returned from Supabase".to_string())
}
