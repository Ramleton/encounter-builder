use serde::{Deserialize, Serialize};

// Learn more about Tauri commands at https://tauri.app/develop/calling-rust/
#[tauri::command]
fn greet(name: &str) -> String {
    format!("Hello, {}! You've been greeted from Rust!", name)
}

#[derive(Serialize, Deserialize, Debug)]
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
enum Size {
    Tiny,
    Small,
    Medium,
    Large,
    Huge,
    Gargantuan,
}

#[derive(Serialize, Deserialize, Debug)]
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
enum Abilities {
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
struct Action {
    name: String,
    description: String,
}

#[derive(Serialize, Deserialize, Debug)]
struct Trait {
    name: String,
    description: String,
}

#[derive(Serialize, Deserialize, Debug)]
struct Stats {
    strength: u64,
    dexterity: u64,
    constitution: u64,
    intelligence: u64,
    wisdom: u64,
    charisma: u64,
}

#[derive(Serialize, Deserialize, Debug)]
struct StatBlock {
    name: String,
    size: String,
    type_: String,
    subtype: String,
    alignment: String,
    ac: u64,
    hp: u64,
    hit_dice: String,
    speed: String,
    stats: Stats,
    saves: Vec<Abilities>,
    skill_saves: Vec<Abilities>,
    senses: String,
    languages: Vec<String>,
    damage_vulnerabilities: Vec<DamageType>,
    damage_resistances: Vec<DamageType>,
    damage_immunities: Vec<DamageType>,
    condition_immunities: Vec<ConditionType>,
    cr: u64,
    traits: Vec<Trait>,
    actions: Vec<Action>,
    legendary_actions: Vec<Action>,
    bonus_actions: Vec<Action>,
    reactions: Vec<Action>,
}

#[cfg_attr(mobile, tauri::mobile_entry_point)]
pub fn run() {
    tauri::Builder::default()
        .plugin(tauri_plugin_opener::init())
        .invoke_handler(tauri::generate_handler![greet])
        .run(tauri::generate_context!())
        .expect("error while running tauri application");
}
