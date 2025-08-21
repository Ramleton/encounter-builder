use chrono::{DateTime, Utc};
use serde::{Deserialize, Serialize};
use typeshare::typeshare;

#[derive(Serialize, Deserialize, Debug, Clone)]
#[typeshare]
pub struct EncounterPlayer {
    pub name: String,
    pub level: u8,
    pub hp: u16,
    pub current_hp: u16,
    pub temporary_hp: u16,
    #[serde(skip_serializing_if = "Option::is_none")]
    pub initiative: Option<u16>,
    pub encounter_id: i64,
}

#[derive(Serialize, Deserialize, Debug, Clone)]
#[typeshare]
pub struct PlayableStatBlock {
    #[serde(skip_serializing_if = "Option::is_none")]
    pub id: Option<i64>,
    pub current_hp: u16,
    pub temporary_hp: u16,
    #[serde(skip_serializing_if = "Option::is_none")]
    pub initiative: Option<u16>,
    #[serde(skip_serializing_if = "Option::is_none")]
    pub name: Option<String>,
    pub statblock_id: i64,
    pub encounter_id: i64,
}

#[derive(Serialize, Deserialize, Debug, Clone)]
#[typeshare]
pub struct Encounter {
    #[serde(skip_serializing_if = "Option::is_none")]
    pub id: Option<i64>,
    pub name: String,
    pub user_id: String,
    pub last_modified: DateTime<Utc>,
}
