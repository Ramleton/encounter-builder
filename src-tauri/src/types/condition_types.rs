use serde::{Deserialize, Serialize};
use typeshare::typeshare;

#[derive(Serialize, Deserialize, Debug, Copy, Clone)]
#[typeshare]
pub enum ConditionType {
    Blinded,
    Charmed,
    Deafened,
    Exhaustion,
    Frightened,
    Grappled,
    Incapacitated,
    Invisible,
    Paralyzed,
    Petrified,
    Poisoned,
    Prone,
    Restrained,
    Stunned,
    Unconscious,
}

#[derive(Serialize, Deserialize, Debug, Clone)]
pub struct ConditionImmunityDB {
    pub statblock_id: i64,
    pub condition_type: ConditionType,
}

#[derive(Serialize, Deserialize, Debug, Clone)]
pub struct ConditionTypeFromJoin {
    pub condition_type: ConditionType,
}
