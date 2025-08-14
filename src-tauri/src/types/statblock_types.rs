use std::collections::HashMap;

use serde::{Deserialize, Serialize};
use typeshare::typeshare;

use crate::types::{
    action_types::{Action, ActionDB},
    condition_types::{ConditionImmunityDB, ConditionType, ConditionTypeFromJoin},
    damage_types::{DamageType, DamageTypeDB, DamageTypeFromJoin},
    proficiency_types::{
        ProficiencyLevel, SaveProficiency, SaveProficiencyDB, SkillProficiency, SkillProficiencyDB,
    },
    spell_types::{SpellcastingAbility, Spells, SpellsDB, SpellsFromJoin},
    trait_types::{Trait, TraitDB},
};

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

#[derive(Serialize, Deserialize, Debug, Copy, Clone)]
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
    pub hp: u16,
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
    hp: u16,
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
    pub id: i64,
    name: String,
    size: Size,
    creature_type: String,
    subtype: Option<String>,
    alignment: Alignment,
    ac: u8,
    hp: u16,
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
    #[serde(rename = "SaveProficiency")]
    pub saves: Option<Vec<SaveProficiency>>,
    #[serde(rename = "SkillProficiency")]
    pub skill_saves: Option<Vec<SkillProficiency>>,
    #[serde(rename = "DamageVulnerability")]
    damage_vulnerabilities: Option<Vec<DamageTypeFromJoin>>,
    #[serde(rename = "DamageResistance")]
    damage_resistances: Option<Vec<DamageTypeFromJoin>>,
    #[serde(rename = "DamageImmunity")]
    damage_immunities: Option<Vec<DamageTypeFromJoin>>,
    #[serde(rename = "ConditionImmunity")]
    condition_immunities: Option<Vec<ConditionTypeFromJoin>>,
    cr: String,
    last_modified: String,
    #[serde(rename = "Trait")]
    traits: Option<Vec<Trait>>,
    #[serde(rename = "Action")]
    actions: Option<Vec<Action>>,
    #[serde(rename = "LegendaryAction")]
    legendary_actions: Option<Vec<Action>>,
    legendary_description: Option<String>,
    #[serde(rename = "BonusAction")]
    bonus_actions: Option<Vec<Action>>,
    #[serde(rename = "Reaction")]
    reactions: Option<Vec<Action>>,
    user_id: String,
    spellcasting_ability: Option<Score>,
    save_dc: Option<u8>,
    spell_attack_bonus: Option<u8>,
    #[serde(rename = "Spells")]
    spells: Option<Vec<SpellsFromJoin>>,
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
            size: db.size.clone(),
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
            saves: if let Some(saves) = &db.saves {
                saves.to_vec()
            } else {
                Vec::new()
            },
            skill_saves: if let Some(skills) = &db.skill_saves {
                skills.to_vec()
            } else {
                Vec::new()
            },
            senses: db.senses.clone(),
            languages: db.languages.clone(),
            damage_vulnerabilities: if let Some(vulnerabilities) = &db.damage_vulnerabilities {
                vulnerabilities
                    .to_vec()
                    .iter()
                    .map(|vulnerability| vulnerability.damage_type)
                    .collect()
            } else {
                Vec::new()
            },
            damage_resistances: if let Some(resistances) = &db.damage_resistances {
                resistances
                    .to_vec()
                    .iter()
                    .map(|resistance| resistance.damage_type)
                    .collect()
            } else {
                Vec::new()
            },
            damage_immunities: if let Some(immunities) = &db.damage_immunities {
                immunities
                    .to_vec()
                    .iter()
                    .map(|immunity| immunity.damage_type)
                    .collect()
            } else {
                Vec::new()
            },
            condition_immunities: if let Some(immunities) = &db.condition_immunities {
                immunities
                    .to_vec()
                    .iter()
                    .map(|immunity| immunity.condition_type)
                    .collect()
            } else {
                Vec::new()
            },
            cr: db.cr.clone(),
            traits: if let Some(traits) = &db.traits {
                traits.to_vec()
            } else {
                Vec::new()
            },
            spells: if let Some(spellcasting_ability) = &db.spellcasting_ability {
                let ability = match spellcasting_ability {
                    Score::Wisdom => SpellcastingAbility::Wisdom,
                    Score::Charisma => SpellcastingAbility::Charisma,
                    _ => SpellcastingAbility::Intelligence,
                };

                Some(Spells {
                    ability,
                    save_dc: if let Some(save_dc) = db.save_dc {
                        save_dc
                    } else {
                        0
                    },
                    attack_bonus: if let Some(attack_bonus) = db.spell_attack_bonus {
                        attack_bonus
                    } else {
                        0
                    },
                    spells: if let Some(spells) = &db.spells {
                        let mut map = HashMap::new();
                        for spell in spells {
                            map.insert(spell.name.clone(), spell.spell_list.clone());
                        }
                        map
                    } else {
                        HashMap::new()
                    },
                })
            } else {
                None
            },
            actions: if let Some(actions) = &db.actions {
                actions.to_vec()
            } else {
                Vec::new()
            },
            legendary_actions: if let Some(legendary_actions) = &db.legendary_actions {
                legendary_actions.to_vec()
            } else {
                Vec::new()
            },
            legendary_description: db.legendary_description.clone(),
            bonus_actions: if let Some(bonus_actions) = &db.bonus_actions {
                bonus_actions.to_vec()
            } else {
                Vec::new()
            },
            reactions: if let Some(reactions) = &db.reactions {
                reactions.to_vec()
            } else {
                Vec::new()
            },
            last_modified: db.last_modified.clone(),
            user_id: db.user_id.clone(),
        }
    }

    pub fn spells_to_db(&self) -> Result<Vec<SpellsDB>, String> {
        if let Some(statblock_id) = self.id {
            if let Some(statblock_spells) = &self.spells {
                return Ok(statblock_spells
                    .spells
                    .iter()
                    .map(|spell_entries| SpellsDB {
                        statblock_id,
                        name: spell_entries.0.to_string(),
                        spell_list: spell_entries.1.to_string(),
                    })
                    .collect());
            }
        }
        Err("No StatBlock ID".to_string())
    }

    pub fn condition_immunities_to_db(&self) -> Result<Vec<ConditionImmunityDB>, String> {
        if let Some(statblock_id) = self.id {
            return Ok(self
                .condition_immunities
                .iter()
                .map(|condition_type| ConditionImmunityDB {
                    statblock_id,
                    condition_type: condition_type.clone(),
                })
                .collect());
        }
        Err("No StatBlock ID".to_string())
    }

    pub fn save_proficiencies_to_db(&self) -> Result<Vec<SaveProficiencyDB>, String> {
        if let Some(statblock_id) = self.id {
            return Ok(self
                .saves
                .iter()
                .map(|save| SaveProficiencyDB {
                    statblock_id,
                    score: save.score.clone(),
                    level: save.level.clone(),
                })
                .collect());
        }
        Err("No StatBlock ID".to_string())
    }

    pub fn skill_proficiencies_to_db(&self) -> Result<Vec<SkillProficiencyDB>, String> {
        if let Some(statblock_id) = self.id {
            return Ok(self
                .skill_saves
                .iter()
                .map(|skill| SkillProficiencyDB {
                    statblock_id,
                    ability: skill.ability.clone(),
                    level: skill.level.clone(),
                })
                .collect());
        }
        Err("No StatBlock ID".to_string())
    }

    pub fn damage_types_to_db(&self) -> Result<HashMap<String, Vec<DamageTypeDB>>, String> {
        if let Some(statblock_id) = self.id {
            let mut map: HashMap<String, Vec<DamageTypeDB>> = HashMap::new();

            map.insert(
                "DamageResistance".to_string(),
                self.damage_resistances
                    .iter()
                    .map(|resistance| DamageTypeDB {
                        statblock_id,
                        damage_type: resistance.clone(),
                    })
                    .collect(),
            );

            map.insert(
                "DamageImmunity".to_string(),
                self.damage_immunities
                    .iter()
                    .map(|immunity| DamageTypeDB {
                        statblock_id,
                        damage_type: immunity.clone(),
                    })
                    .collect(),
            );

            map.insert(
                "DamageVulnerability".to_string(),
                self.damage_vulnerabilities
                    .iter()
                    .map(|vulnerability| DamageTypeDB {
                        statblock_id,
                        damage_type: vulnerability.clone(),
                    })
                    .collect(),
            );

            return Ok(map);
        }
        Err("No StatBlock ID".to_string())
    }

    pub fn traits_to_db(&self) -> Result<Vec<TraitDB>, String> {
        if let Some(statblock_id) = self.id {
            return Ok(self
                .traits
                .iter()
                .map(|statblock_trait| TraitDB {
                    statblock_id,
                    name: statblock_trait.name.clone(),
                    description: statblock_trait.description.clone(),
                })
                .collect());
        }
        Err("No StatBlock ID".to_string())
    }

    pub fn actions_to_db(&self) -> Result<HashMap<String, Vec<ActionDB>>, String> {
        if let Some(statblock_id) = self.id {
            let mut map: HashMap<String, Vec<ActionDB>> = HashMap::new();

            map.insert(
                "Action".to_string(),
                self.actions
                    .iter()
                    .map(|action| ActionDB {
                        statblock_id,
                        name: action.name.clone(),
                        description: action.description.clone(),
                    })
                    .collect(),
            );

            map.insert(
                "BonusAction".to_string(),
                self.bonus_actions
                    .iter()
                    .map(|bonus_action| ActionDB {
                        statblock_id,
                        name: bonus_action.name.clone(),
                        description: bonus_action.description.clone(),
                    })
                    .collect(),
            );

            map.insert(
                "Reaction".to_string(),
                self.reactions
                    .iter()
                    .map(|reaction| ActionDB {
                        statblock_id,
                        name: reaction.name.clone(),
                        description: reaction.description.clone(),
                    })
                    .collect(),
            );

            map.insert(
                "LegendaryAction".to_string(),
                self.legendary_actions
                    .iter()
                    .map(|legendary_actions| ActionDB {
                        statblock_id,
                        name: legendary_actions.name.clone(),
                        description: legendary_actions.description.clone(),
                    })
                    .collect(),
            );

            return Ok(map);
        }
        Err("No StatBlock ID".to_string())
    }
}
