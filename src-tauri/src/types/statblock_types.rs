use std::collections::HashMap;

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
    pub attack_bonus: u8,
    pub spells: std::collections::HashMap<String, String>,
}

#[derive(Serialize, Deserialize, Debug)]
#[typeshare]
pub struct StatBlock {
    pub id: Option<i64>,
    pub name: String,
    pub size: Size,
    pub type_: String,
    #[serde(skip_serializing_if = "Option::is_none")]
    pub subtype: Option<String>,
    pub alignment: Alignment,
    pub ac: u8,
    pub hp: u8,
    pub initiative: ProficiencyLevel,
    pub hit_dice: String,
    pub speed: String,
    pub stats: Stats,
    pub saves: Vec<SaveProficiency>,
    pub skill_saves: Vec<SkillProficiency>,
    #[serde(skip_serializing_if = "Option::is_none")]
    pub senses: Option<String>,
    #[serde(skip_serializing_if = "Option::is_none")]
    pub languages: Option<String>,
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
    #[serde(skip_serializing_if = "Option::is_none")]
    pub legendary_description: Option<String>,
    pub bonus_actions: Vec<Action>,
    pub reactions: Vec<Action>,
    pub last_modified: String,
    pub user_id: String,
}

#[derive(Serialize, Deserialize, Debug)]
pub struct StatBlockToDB {
    name: String,
    size: Size,
    creature_type: String,
    subtype: Option<String>,
    alignment: Alignment,
    ac: u8,
    hp: u8,
    initiative: ProficiencyLevel,
    hit_dice: String,
    speed: String,
    senses: Option<String>,
    languages: Option<String>,
    strength: u8,
    dexterity: u8,
    constitution: u8,
    intelligence: u8,
    wisdom: u8,
    charisma: u8,
    cr: String,
    last_modified: String,
    legendary_description: Option<String>,
    user_id: String,
    spellcasting_ability: Option<Score>,
    save_dc: Option<u8>,
    spell_attack_bonus: Option<u8>,
}

#[derive(Serialize, Deserialize, Debug)]
pub struct StatBlockFromDB {
    id: i64,
    name: String,
    size: Size,
    creature_type: String,
    subtype: Option<String>,
    alignment: Alignment,
    ac: u8,
    hp: u8,
    initiative: ProficiencyLevel,
    hit_dice: String,
    speed: String,
    senses: Option<String>,
    languages: Option<String>,
    strength: u8,
    dexterity: u8,
    constitution: u8,
    intelligence: u8,
    wisdom: u8,
    charisma: u8,
    cr: String,
    last_modified: String,
    legendary_description: Option<String>,
    user_id: String,
    spellcasting_ability: Option<Score>,
    save_dc: Option<u8>,
    spell_attack_bonus: Option<u8>,
}

#[derive(Serialize, Deserialize, Debug, Copy, Clone)]
pub struct ActionDB<'a> {
    pub statblock_id: i64,
    pub name: &'a str,
    pub description: &'a str,
}

impl StatBlock {
    pub fn statblock_to_db(&self) -> StatBlockToDB {
        StatBlockToDB {
            name: self.name.clone(),
            size: self.size,
            creature_type: self.type_.clone(),
            subtype: self.subtype.clone(),
            alignment: self.alignment,
            ac: self.ac,
            hp: self.hp,
            initiative: self.initiative,
            hit_dice: self.hit_dice.clone(),
            speed: self.speed.clone(),
            senses: self.senses.clone(),
            languages: self.languages.clone(),
            strength: self.stats.strength,
            dexterity: self.stats.dexterity,
            constitution: self.stats.constitution,
            intelligence: self.stats.intelligence,
            wisdom: self.stats.wisdom,
            charisma: self.stats.charisma,
            cr: self.cr.clone(),
            last_modified: self.last_modified.clone(),
            legendary_description: self.legendary_description.clone(),
            user_id: self.user_id.clone(),
            spellcasting_ability: self.spells.as_ref().map(|s| match s.ability {
                SpellcastingAbility::Charisma => Score::Charisma,
                SpellcastingAbility::Intelligence => Score::Intelligence,
                SpellcastingAbility::Wisdom => Score::Wisdom,
            }),
            save_dc: self.spells.as_ref().map(|s| s.save_dc),
            spell_attack_bonus: self.spells.as_ref().map(|s| s.attack_bonus),
        }
    }

    pub fn statblock_from_db(db: &StatBlockFromDB) -> Self {
        StatBlock {
            id: Some(db.id),
            name: db.name.clone(),
            size: db.size,
            type_: db.creature_type.clone(),
            subtype: db.subtype.clone(),
            alignment: db.alignment,
            ac: db.ac,
            hp: db.hp,
            initiative: db.initiative,
            hit_dice: db.hit_dice.clone(),
            speed: db.speed.clone(),
            stats: Stats {
                strength: db.strength,
                dexterity: db.dexterity,
                constitution: db.constitution,
                intelligence: db.intelligence,
                wisdom: db.wisdom,
                charisma: db.charisma,
            },
            saves: Vec::new(),
            skill_saves: Vec::new(),
            senses: db.senses.clone(),
            languages: db.languages.clone(),
            damage_vulnerabilities: Vec::new(),
            damage_resistances: Vec::new(),
            damage_immunities: Vec::new(),
            condition_immunities: Vec::new(),
            cr: db.cr.clone(),
            traits: Vec::new(),
            spells: None,
            actions: Vec::new(),
            legendary_actions: Vec::new(),
            legendary_description: db.legendary_description.clone(),
            bonus_actions: Vec::new(),
            reactions: Vec::new(),
            last_modified: db.last_modified.clone(),
            user_id: db.user_id.clone(),
        }
    }

    pub fn actions_to_db<'a>(&'a self) -> Result<HashMap<&'a str, Vec<ActionDB<'a>>>, String> {
        if let Some(statblock_id) = self.id {
            let mut map: HashMap<&str, Vec<ActionDB<'_>>> = HashMap::new();

            map.insert(
                "Action",
                self.actions
                    .iter()
                    .map(|action| ActionDB {
                        statblock_id,
                        name: &action.name,
                        description: &action.description,
                    })
                    .collect(),
            );

            map.insert(
                "BonusAction",
                self.bonus_actions
                    .iter()
                    .map(|bonus_action| ActionDB {
                        statblock_id,
                        name: &bonus_action.name,
                        description: &bonus_action.description,
                    })
                    .collect(),
            );

            map.insert(
                "Reaction",
                self.reactions
                    .iter()
                    .map(|reaction| ActionDB {
                        statblock_id,
                        name: &reaction.name,
                        description: &reaction.description,
                    })
                    .collect(),
            );

            map.insert(
                "LegendaryAction",
                self.legendary_actions
                    .iter()
                    .map(|legendary_actions| ActionDB {
                        statblock_id,
                        name: &legendary_actions.name,
                        description: &legendary_actions.description,
                    })
                    .collect(),
            );

            return Ok(map);
        }
        Err("No StatBlock ID".to_string())
    }
}
