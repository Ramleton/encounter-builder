use chrono::{DateTime, Utc};
use serde::{Deserialize, Serialize};
use typeshare::typeshare;

use crate::types::statblock_types::StatBlock;

#[derive(Serialize, Deserialize, Debug)]
#[typeshare]
pub struct Player {
    pub id: Option<i64>,
    pub name: String,
    pub hp: u16,
    pub current_hp: u16,
    pub temporary_hp: u16,
    pub initiative: u16,
    pub encounter_id: i64,
}

#[derive(Serialize, Deserialize, Debug)]
#[typeshare]
pub struct PlayableStatBlock {
    pub id: Option<i64>,
    pub current_hp: u16,
    pub temporary_hp: u16,
    pub initiative: u16,
    pub statblock_id: i64,
    pub encounter_id: i64,
}

#[derive(Serialize, Deserialize, Debug)]
#[typeshare]
pub struct Encounter {
    pub id: Option<i64>,
    pub name: String,
    pub user_id: String,
    pub last_modified: DateTime<Utc>,
}
