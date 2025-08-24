use serde::{Deserialize, Serialize};
use typeshare::typeshare;

#[derive(Serialize, Deserialize, Debug, Copy, Clone)]
#[typeshare]
pub enum DamageType {
    Acid,
    Bludgeoning,
    Cold,
    Fire,
    Force,
    Lightning,
    Necrotic,
    Piercing,
    Poison,
    Psychic,
    Radiant,
    Slashing,
    Thunder,
}

#[derive(Serialize, Deserialize, Debug)]
pub struct DamageTypeDB {
    pub statblock_id: i64,
    pub damage_type: DamageType,
}

#[derive(Serialize, Deserialize, Debug, Clone)]
pub struct DamageTypeFromJoin {
    pub damage_type: DamageType,
}
