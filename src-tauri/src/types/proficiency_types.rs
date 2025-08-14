use serde::{Deserialize, Serialize};
use typeshare::typeshare;

use crate::types::statblock_types::{Ability, Score};

#[derive(Serialize, Deserialize, Debug, Copy, Clone)]
#[typeshare]
pub enum ProficiencyLevel {
    #[serde(rename = "none")]
    None,
    #[serde(rename = "proficient")]
    Proficient,
    #[serde(rename = "expertise")]
    Expertise,
}

#[derive(Serialize, Deserialize, Debug, Clone)]
#[typeshare]
pub struct SkillProficiency {
    pub ability: Ability,
    pub level: ProficiencyLevel,
}

#[derive(Serialize, Deserialize, Debug)]
#[typeshare]
pub struct SkillProficiencyDB {
    pub statblock_id: i64,
    pub ability: Ability,
    pub level: ProficiencyLevel,
}

#[derive(Serialize, Deserialize, Debug, Clone)]
#[typeshare]
pub struct SaveProficiency {
    pub score: Score,
    pub level: ProficiencyLevel,
}

#[derive(Serialize, Deserialize, Debug)]
#[typeshare]
pub struct SaveProficiencyDB {
    pub statblock_id: i64,
    pub score: Score,
    pub level: ProficiencyLevel,
}
