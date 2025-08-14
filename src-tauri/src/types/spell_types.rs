use serde::{Deserialize, Serialize};
use typeshare::typeshare;

#[derive(Debug, Copy, Clone, PartialEq, Eq, Serialize, Deserialize)]
#[typeshare]
pub enum SpellcastingAbility {
    Intelligence,
    Wisdom,
    Charisma,
}

#[derive(Debug, Clone, PartialEq, Eq, Serialize, Deserialize)]
#[typeshare]
pub struct Spells {
    pub ability: SpellcastingAbility,
    pub save_dc: u8,
    pub attack_bonus: u8,
    pub spells: std::collections::HashMap<String, String>,
}

#[derive(Serialize, Deserialize, Debug, Clone)]
pub struct SpellsDB {
    pub statblock_id: i64,
    pub name: String,
    pub spell_list: String,
}

#[derive(Serialize, Deserialize, Debug, Clone)]
pub struct SpellsFromJoin {
    pub name: String,
    pub spell_list: String,
}
