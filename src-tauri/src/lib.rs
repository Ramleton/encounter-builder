use serde::{Deserialize, Serialize};
use typeshare::typeshare;

#[derive(Serialize, Deserialize, Debug)]
#[typeshare]
#[serde(rename_all = "PascalCase")]
enum Alignment {
    LawfulGood,
    NeutralGood,
    ChaoticGood,
    LawfulNeutral,
    TrueNeutral,
    ChaoticNeutral,
    LawfulEvil,
    NeutralEvil,
    ChaoticEvil,
}

#[derive(Serialize, Deserialize, Debug)]
#[typeshare]
enum Size {
    Tiny,
    Small,
    Medium,
    Large,
    Huge,
    Gargantuan,
}

#[derive(Serialize, Deserialize, Debug)]
#[typeshare]
enum ConditionType {
    Blinded,
    Charmed,
    Deafened,
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

#[derive(Serialize, Deserialize, Debug)]
#[typeshare]
enum DamageType {
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
}

#[derive(Serialize, Deserialize, Debug)]
#[typeshare]
enum Ability {
    Acrobatics,
    AnimalHandling,
    Arcana,
    Athletics,
    Deception,
    History,
    Insight,
    Intimidation,
    Investigation,
    Medicine,
    Nature,
    Perception,
    Performance,
    Persuasion,
    Religion,
    SleightOfHand,
    Stealth,
    Survival,
}

#[derive(Serialize, Deserialize, Debug)]
#[typeshare]
struct Action {
    name: String,
    description: String,
}

#[derive(Serialize, Deserialize, Debug)]
#[typeshare]
struct Trait {
    name: String,
    description: String,
}

#[derive(Serialize, Deserialize, Debug)]
#[typeshare]
struct Stats {
    strength: u32,
    dexterity: u32,
    constitution: u32,
    intelligence: u32,
    wisdom: u32,
    charisma: u32,
}

#[derive(Serialize, Deserialize, Debug)]
#[typeshare]
struct StatBlock {
    name: String,
    size: Size,
    type_: String,
    subtype: String,
    alignment: Alignment,
    ac: u32,
    hp: u32,
    hit_dice: String,
    speed: String,
    stats: Stats,
    saves: Vec<Ability>,
    skill_saves: Vec<Ability>,
    senses: String,
    languages: String,
    damage_vulnerabilities: Vec<DamageType>,
    damage_resistances: Vec<DamageType>,
    damage_immunities: Vec<DamageType>,
    condition_immunities: Vec<ConditionType>,
    cr: u32, /* TODO Change this to String later */
    traits: Vec<Trait>,
    actions: Vec<Action>,
    legendary_actions: Vec<Action>,
    bonus_actions: Vec<Action>,
    reactions: Vec<Action>,
}

#[tauri::command]
fn recv_statblock(statblock: StatBlock) -> String {
    println!("Received StatBlock: {:?}", statblock);
    format!("StatBlock for {} received successfully!", statblock.name)
}

#[cfg_attr(mobile, tauri::mobile_entry_point)]
pub fn run() {
    tauri::Builder::default()
        .plugin(tauri_plugin_opener::init())
        .invoke_handler(tauri::generate_handler![recv_statblock])
        .run(tauri::generate_context!())
        .expect("error while running tauri application");
}
