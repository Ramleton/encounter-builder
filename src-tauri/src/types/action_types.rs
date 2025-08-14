use serde::{Deserialize, Serialize};
use typeshare::typeshare;

#[derive(Serialize, Deserialize, Debug, Clone)]
#[typeshare]
pub struct Action {
    pub name: String,
    pub description: String,
}

#[derive(Serialize, Deserialize, Debug)]
pub struct ActionDB {
    pub statblock_id: i64,
    pub name: String,
    pub description: String,
}
