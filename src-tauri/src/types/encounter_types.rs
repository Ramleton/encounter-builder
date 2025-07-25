use chrono::{DateTime, Utc};
use serde::{Deserialize, Serialize};
use typeshare::typeshare;

use crate::types::statblock_types::StatBlock;

#[derive(Serialize, Deserialize, Debug)]
#[typeshare]
pub struct Player {
    pub name: String,
    pub level: u32,
}

#[derive(Serialize, Deserialize, Debug)]
#[typeshare]
pub struct Encounter {
    pub name: String,
    pub creatures: Vec<StatBlock>,
    pub players: Vec<Player>,
    pub last_modified: DateTime<Utc>,
}
