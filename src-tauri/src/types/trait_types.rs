use serde::{Deserialize, Serialize};
use typeshare::typeshare;

#[derive(Serialize, Deserialize, Debug, Clone)]
#[typeshare]
pub struct Trait {
    pub name: String,
    pub description: String,
}

#[derive(Serialize, Deserialize, Debug)]
pub struct TraitDB {
    pub statblock_id: i64,
    pub name: String,
    pub description: String,
}
