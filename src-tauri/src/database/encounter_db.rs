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

#[derive(Serialize, Deserialize, Debug)]
pub struct FetchEncountersResponse {
    pub encounters: Vec<Encounter>,
    pub status: u16,
    pub message: String,
}

#[derive(Serialize, Deserialize, Debug)]
pub struct FetchPlayableStatBlocksForEncounterResponse {
    pub playable_stat_blocks: Vec<PlayableStatBlock>,
    pub status: u16,
    pub message: String,
}

#[derive(Serialize, Deserialize, Debug)]
pub struct FetchEncounterPlayersForEncounterResponse {
    pub encounter_players: Vec<EncounterPlayer>,
    pub status: u16,
    pub message: String,
}

//? GET

#[tauri::command]
pub async fn fetch_encounter_players_for_encounter(
    encounter_id: i64,
    access_token: String,
) -> Result<FetchEncounterPlayersForEncounterResponse, FetchEncounterPlayersForEncounterResponse> {
    let config = init_supabase()
        .await
        .map_err(|e| FetchEncounterPlayersForEncounterResponse {
            encounter_players: Vec::new(),
            status: 500,
            message: format!("EncounterPlayer fetch failed: {}", e),
        })?;
    let client = reqwest::Client::new();
    let url = format!(
        "{}/rest/v1/EncounterPlayer?encounter_id=eq.{}",
        config.url, encounter_id
    );

    let response = client
        .get(&url)
        .header("apikey", &config.anon_key)
        .header("Authorization", format!("Bearer {}", &access_token))
        .header("Content-Type", "application/json")
        .send()
        .await
        .map_err(|e| FetchEncounterPlayersForEncounterResponse {
            encounter_players: Vec::new(),
            status: 500,
            message: format!("EncounterPlayer fetch failed: {}", e),
        })?;

    let status = response.status();

    if !status.is_success() {
        let error_text = response.text().await.unwrap_or_default();
        return Err(FetchEncounterPlayersForEncounterResponse {
            encounter_players: Vec::new(),
            status: status.as_u16(),
            message: format!("EncounterPlayer fetch failed: {}", error_text),
        });
    }

    let encounter_players =
        response
            .json()
            .await
            .map_err(|e| FetchEncounterPlayersForEncounterResponse {
                encounter_players: Vec::new(),
                status: 500,
                message: format!(
                    "Failed to parse EncounterPlayer response: {}",
                    e.to_string()
                ),
            })?;

    Ok(FetchEncounterPlayersForEncounterResponse {
        encounter_players,
        status: status.as_u16(),
        message: format!("Successfully fetched EncounterPlayers"),
    })
}

#[tauri::command]
pub async fn fetch_playable_statblocks_for_encounter(
    encounter_id: i64,
    access_token: String,
) -> Result<FetchPlayableStatBlocksForEncounterResponse, FetchPlayableStatBlocksForEncounterResponse>
{
    let config =
        init_supabase()
            .await
            .map_err(|e| FetchPlayableStatBlocksForEncounterResponse {
                playable_stat_blocks: Vec::new(),
                status: 500,
                message: format!("PlayableStatBlock fetch failed: {}", e),
            })?;
    let client = reqwest::Client::new();
    let url = format!(
        "{}/rest/v1/PlayableStatBlock?encounter_id=eq.{}",
        config.url, encounter_id
    );

    let response = client
        .get(&url)
        .header("apikey", &config.anon_key)
        .header("Authorization", format!("Bearer {}", &access_token))
        .header("Content-Type", "application/json")
        .send()
        .await
        .map_err(|e| FetchPlayableStatBlocksForEncounterResponse {
            playable_stat_blocks: Vec::new(),
            status: 500,
            message: format!("PlayableStatBlock fetch failed: {}", e),
        })?;

    let status = response.status();

    if !status.is_success() {
        let error_text = response.text().await.unwrap_or_default();
        return Err(FetchPlayableStatBlocksForEncounterResponse {
            playable_stat_blocks: Vec::new(),
            status: status.as_u16(),
            message: format!("PlayableStatBlock fetch failed: {}", error_text),
        });
    }

    let playable_stat_blocks =
        response
            .json()
            .await
            .map_err(|e| FetchPlayableStatBlocksForEncounterResponse {
                playable_stat_blocks: Vec::new(),
                status: 500,
                message: format!(
                    "Failed to parse PlayableStatBlock response: {}",
                    e.to_string()
                ),
            })?;

    Ok(FetchPlayableStatBlocksForEncounterResponse {
        playable_stat_blocks,
        status: status.as_u16(),
        message: format!("Successfully fetched PlayableStatBlocks"),
    })
}

#[tauri::command]
pub async fn fetch_encounters(
    access_token: String,
) -> Result<FetchEncountersResponse, FetchEncountersResponse> {
    let config = init_supabase().await.map_err(|e| FetchEncountersResponse {
        encounters: Vec::new(),
        status: 500,
        message: format!("Encounter fetch failed: {}", e),
    })?;
    let client = reqwest::Client::new();
    let url = format!("{}/rest/v1/Encounter", config.url);

    let response = client
        .get(&url)
        .header("apikey", &config.anon_key)
        .header("Authorization", format!("Bearer {}", &access_token))
        .header("Content-Type", "application/json")
        .send()
        .await
        .map_err(|e| FetchEncountersResponse {
            encounters: Vec::new(),
            status: 500,
            message: format!("Encounter fetch failed: {}", e),
        })?;

    let status = response.status();

    if !status.is_success() {
        let error_text = response.text().await.unwrap_or_default();
        return Err(FetchEncountersResponse {
            encounters: Vec::new(),
            status: status.as_u16(),
            message: format!("Encounter fetch failed: {}", error_text),
        });
    }

    let encounters = response.json().await.map_err(|e| FetchEncountersResponse {
        encounters: Vec::new(),
        status: 500,
        message: format!("Failed to parse Encounter response: {}", e.to_string()),
    })?;

    Ok(FetchEncountersResponse {
        encounters,
        status: status.as_u16(),
        message: format!("Successfully fetched Encounters"),
    })
}

//? UPSERT

#[tauri::command]
pub async fn save_encounter_players(
    encounter_players: Vec<EncounterPlayer>,
    access_token: String,
) -> Result<SaveEncounterPlayersResponse, String> {
    let config = init_supabase().await.map_err(|e| e.to_string())?;
    let client = reqwest::Client::new();

    if let Some(first_player) = encounter_players.first() {
        let delete_url = format!(
            "{}/rest/v1/EncounterPlayer?encounter_id=eq.{}",
            config.url, first_player.encounter_id
        );

        let delete_response = client
            .delete(&delete_url)
            .header("apikey", &config.anon_key)
            .header("Authorization", format!("Bearer {}", &access_token))
            .send()
            .await
            .map_err(|e| format!("Request failed: {}", e))?;

        if !delete_response.status().is_success() {
            let error_text = delete_response.text().await.unwrap_or_default();
            return Err(format!(
                "Failed to delete existing encounter players: {}",
                error_text
            ));
        }
    }

    for player in encounter_players {
        let insert_obj = player.clone();
        let insert_url = format!("{}/rest/v1/EncounterPlayer", config.url);

        let response = client
            .post(&insert_url)
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
            return Err(format!("Supabase insert error {}: {}", status, text));
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

    if let Some(first_statblock) = playable_stat_blocks.first() {
        let delete_url = format!(
            "{}/rest/v1/PlayableStatBlock?encounter_id=eq.{}",
            config.url, first_statblock.encounter_id
        );

        let delete_response = client
            .delete(&delete_url)
            .header("apikey", &config.anon_key)
            .header("Authorization", format!("Bearer {}", &access_token))
            .send()
            .await
            .map_err(|e| format!("Request failed: {}", e))?;

        if !delete_response.status().is_success() {
            let error_text = delete_response.text().await.unwrap_or_default();
            return Err(format!(
                "Failed to delete existing playable statblocks: {}",
                error_text
            ));
        }
    }

    for statblock in playable_stat_blocks {
        let insert_obj = statblock.clone();
        let insert_url = format!("{}/rest/v1/PlayableStatBlock", config.url);

        let response = client
            .post(&insert_url)
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
            return Err(format!("Supabase insert error {}: {}", status, text));
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

//? Delete

#[tauri::command]
pub async fn delete_encounter(encounter_id: i64, access_token: String) -> Result<String, String> {
    let config = init_supabase().await.map_err(|e| e.to_string())?;
    let client = reqwest::Client::new();
    let delete_url = format!("{}/rest/v1/Encounter?id=eq.{}", config.url, encounter_id);

    let response = client
        .delete(&delete_url)
        .header("apikey", &config.anon_key)
        .header("Authorization", format!("Bearer {}", &access_token))
        .header("Content-Type", "application/json")
        .send()
        .await
        .map_err(|e| format!("Request failed: {}", e))?;

    let status = response.status();

    if !status.is_success() {
        return Err("Supabase delete error {}: {}".to_string());
    }

    return Ok("Encounter deleted successfully".to_string());
}
