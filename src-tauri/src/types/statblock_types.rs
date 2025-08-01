use serde::{Deserialize, Serialize};
use typeshare::typeshare;

#[derive(Serialize, Deserialize, Debug)]
#[typeshare]
#[serde(rename_all = "PascalCase")]
pub enum Alignment {
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
pub enum Size {
    Tiny,
    Small,
    Medium,
    Large,
    Huge,
    Gargantuan,
}

#[derive(Serialize, Deserialize, Debug)]
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

#[derive(Serialize, Deserialize, Debug)]
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
}

#[derive(Serialize, Deserialize, Debug)]
#[typeshare]
pub enum Score {
    Strength,
    Dexterity,
    Constitution,
    Intelligence,
    Wisdom,
    Charisma,
}

#[derive(Serialize, Deserialize, Debug)]
#[typeshare]
pub enum Ability {
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
pub struct Action {
    name: String,
    description: String,
}

#[derive(Serialize, Deserialize, Debug)]
#[typeshare]
pub struct Trait {
    name: String,
    description: String,
}

#[derive(Serialize, Deserialize, Debug)]
#[typeshare]
pub struct Stats {
    strength: u32,
    dexterity: u32,
    constitution: u32,
    intelligence: u32,
    wisdom: u32,
    charisma: u32,
}

#[derive(Serialize, Deserialize, Debug)]
#[typeshare]
pub struct StatBlock {
    pub name: String,
    pub size: Size,
    pub type_: String,
    pub subtype: String,
    pub alignment: Alignment,
    pub ac: u32,
    pub hp: u32,
    pub hit_dice: String,
    pub speed: String,
    pub stats: Stats,
    pub saves: Vec<Score>,
    pub skill_saves: Vec<Ability>,
    pub senses: String,
    pub languages: String,
    pub damage_vulnerabilities: Vec<DamageType>,
    pub damage_resistances: Vec<DamageType>,
    pub damage_immunities: Vec<DamageType>,
    pub condition_immunities: Vec<ConditionType>,
    pub cr: String,
    pub traits: Vec<Trait>,
    pub actions: Vec<Action>,
    pub legendary_actions: Vec<Action>,
    pub legendary_description: String,
    pub bonus_actions: Vec<Action>,
    pub reactions: Vec<Action>,
}
