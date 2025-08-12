use serde::{Deserialize, Serialize};
use typeshare::typeshare;

#[derive(Serialize, Deserialize, Debug, Copy, Clone)]
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

#[derive(Serialize, Deserialize, Debug, Copy, Clone)]
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

#[derive(Serialize, Deserialize, Debug, Copy, Clone)]
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

#[derive(Serialize, Deserialize, Debug, Copy, Clone)]
#[typeshare]
pub struct SkillProficiency {
    pub ability: Ability,
    pub level: ProficiencyLevel,
}

#[derive(Serialize, Deserialize, Debug)]
#[typeshare]
pub struct SaveProficiency {
    pub score: Score,
    pub level: ProficiencyLevel,
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
    strength: u8,
    dexterity: u8,
    constitution: u8,
    intelligence: u8,
    wisdom: u8,
    charisma: u8,
}

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
    pub attack_bonus: i8,
    pub spells: std::collections::HashMap<String, String>,
}

#[derive(Serialize, Deserialize, Debug)]
#[typeshare]
pub struct StatBlock {
    pub id: Option<i64>,
    pub name: String,
    pub size: Size,
    pub type_: String,
    pub subtype: String,
    pub alignment: Alignment,
    pub ac: u16,
    pub hp: u16,
    pub initiative: ProficiencyLevel,
    pub hit_dice: String,
    pub speed: String,
    pub stats: Stats,
    pub saves: Vec<SaveProficiency>,
    pub skill_saves: Vec<SkillProficiency>,
    pub senses: String,
    pub languages: String,
    pub damage_vulnerabilities: Vec<DamageType>,
    pub damage_resistances: Vec<DamageType>,
    pub damage_immunities: Vec<DamageType>,
    pub condition_immunities: Vec<ConditionType>,
    pub cr: String,
    pub traits: Vec<Trait>,
    #[serde(skip_serializing_if = "Option::is_none")]
    pub spells: Option<Spells>,
    pub actions: Vec<Action>,
    pub legendary_actions: Vec<Action>,
    pub legendary_description: String,
    pub bonus_actions: Vec<Action>,
    pub reactions: Vec<Action>,
    pub last_modified: String,
    pub user_id: String,
}

#[derive(Serialize, Deserialize, Debug)]
pub struct StatBlockDB<'a> {
    pub name: &'a str,
    pub size: Size,
    pub creature_type: &'a str,
    pub subtype: Option<&'a str>,
    pub alignment: Alignment,
    pub ac: u16,
    pub hp: u16,
    pub initiative: ProficiencyLevel,
    pub hit_dice: &'a str,
    pub speed: &'a str,
    pub senses: &'a str,
    pub languages: &'a str,
    pub strength: u8,
    pub dexterity: u8,
    pub constitution: u8,
    pub intelligence: u8,
    pub wisdom: u8,
    pub charisma: u8,
    pub cr: &'a str,
    pub last_modified: &'a str,
    pub legendary_description: Option<&'a str>,
    pub user_id: &'a str,
    pub spellcasting_ability: Option<SpellcastingAbility>,
    pub save_dc: Option<u8>,
    pub spell_attack_bonus: Option<i8>,
}

impl StatBlock {
    pub fn to_db<'a>(&'a self) -> StatBlockDB<'a> {
        StatBlockDB {
            name: &self.name,
            size: self.size,
            creature_type: &self.type_,
            subtype: if self.subtype.is_empty() {
                None
            } else {
                Some(&self.subtype)
            },
            alignment: self.alignment,
            ac: self.ac,
            hp: self.hp,
            initiative: self.initiative,
            hit_dice: &self.hit_dice,
            speed: &self.speed,
            senses: &self.senses,
            languages: &self.languages,
            strength: self.stats.strength,
            dexterity: self.stats.dexterity,
            constitution: self.stats.constitution,
            intelligence: self.stats.intelligence,
            wisdom: self.stats.wisdom,
            charisma: self.stats.charisma,
            cr: &self.cr,
            last_modified: &self.last_modified,
            legendary_description: if self.legendary_description.is_empty() {
                None
            } else {
                Some(&self.legendary_description)
            },
            user_id: &self.user_id,
            spellcasting_ability: self.spells.as_ref().map(|s| s.ability),
            save_dc: self.spells.as_ref().map(|s| s.save_dc),
            spell_attack_bonus: self.spells.as_ref().map(|s| s.attack_bonus),
        }
    }
}
