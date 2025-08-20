
export interface Action {
	name: string;
	description: string;
}

export enum Size {
	Tiny = "Tiny",
	Small = "Small",
	Medium = "Medium",
	Large = "Large",
	Huge = "Huge",
	Gargantuan = "Gargantuan",
}

export enum Alignment {
	Unaligned = "Unaligned",
	LawfulGood = "LawfulGood",
	NeutralGood = "NeutralGood",
	ChaoticGood = "ChaoticGood",
	LawfulNeutral = "LawfulNeutral",
	TrueNeutral = "TrueNeutral",
	ChaoticNeutral = "ChaoticNeutral",
	LawfulEvil = "LawfulEvil",
	NeutralEvil = "NeutralEvil",
	ChaoticEvil = "ChaoticEvil",
}

export interface Stats {
	strength: number;
	dexterity: number;
	constitution: number;
	intelligence: number;
	wisdom: number;
	charisma: number;
}

export enum Score {
	Strength = "Strength",
	Dexterity = "Dexterity",
	Constitution = "Constitution",
	Intelligence = "Intelligence",
	Wisdom = "Wisdom",
	Charisma = "Charisma"
}

export enum Ability {
	Acrobatics = "Acrobatics",
	AnimalHandling = "AnimalHandling",
	Arcana = "Arcana",
	Athletics = "Athletics",
	Deception = "Deception",
	History = "History",
	Insight = "Insight",
	Intimidation = "Intimidation",
	Investigation = "Investigation",
	Medicine = "Medicine",
	Nature = "Nature",
	Perception = "Perception",
	Performance = "Performance",
	Persuasion = "Persuasion",
	Religion = "Religion",
	SleightOfHand = "SleightOfHand",
	Stealth = "Stealth",
	Survival = "Survival",
}

export type ProficiencyLevel = "none" | "proficient" | "expertise";

export type SkillProficiency = {
	ability: Ability;
	level: ProficiencyLevel;
}

export type SaveProficiency = {
	score: Score;
	level: ProficiencyLevel;
}

export enum DamageType {
	Acid = "Acid",
	Bludgeoning = "Bludgeoning",
	Cold = "Cold",
	Fire = "Fire",
	Force = "Force",
	Lightning = "Lightning",
	Necrotic = "Necrotic",
	Piercing = "Piercing",
	Poison = "Poison",
	Psychic = "Psychic",
	Radiant = "Radiant",
	Slashing = "Slashing",
}

export enum ConditionType {
	Blinded = "Blinded",
	Charmed = "Charmed",
	Deafened = "Deafened",
	Exhaustion = "Exhaustion",
	Frightened = "Frightened",
	Grappled = "Grappled",
	Incapacitated = "Incapacitated",
	Invisible = "Invisible",
	Paralyzed = "Paralyzed",
	Petrified = "Petrified",
	Poisoned = "Poisoned",
	Prone = "Prone",
	Restrained = "Restrained",
	Stunned = "Stunned",
	Unconscious = "Unconscious",
}

export interface Trait {
	name: string;
	description: string;
}

export const CR_VALUES = [
	"0", "1/8", "1/4", "1/2", ...Array.from({ length: 30 }, (_, i) => (i + 1) + "")
] as const;

export type CR = typeof CR_VALUES[number];


export enum SpellcastingAbility {
	Intelligence = "Intelligence",
	Wisdom = "Wisdom",
	Charisma = "Charisma",
}

export interface Spells {
	ability: SpellcastingAbility;
	save_dc: number;
	attack_bonus: number;
	spells: Record<string, string>;
}

export interface StatBlock {
	id?: number,
	name: string;
	size: Size;
	type_: string;
	subtype: string;
	alignment: Alignment;
	ac: number;
	hp: number;
	initiative: ProficiencyLevel;
	hit_dice: string;
	speed: string;
	stats: Stats;
	saves: SaveProficiency[];
	skill_saves: SkillProficiency[];
	senses: string;
	languages: string;
	damage_vulnerabilities: DamageType[];
	damage_resistances: DamageType[];
	damage_immunities: DamageType[];
	condition_immunities: ConditionType[];
	cr: CR;
	traits: Trait[];
	spells?: Spells;
	actions: Action[];
	legendary_actions: Action[];
	legendary_description: string;
	bonus_actions: Action[];
	reactions: Action[];
	last_modified: string;
	user_id: string;
}


export type ActionKeys<T> = {
    [K in keyof T]: K extends 'spells'
        ? never
        : T[K] extends Action[] | Trait[]
            ? K
            : never;
}[keyof T];

export type ActionOnlyKeys<T> = {
    [K in keyof T]: K extends 'spells'  | 'traits'
        ? never 
        : T[K] extends Action[] 
            ? K 
            : never;
}[keyof T];

export type TraitKeys<T> = {
    [K in keyof T]: T[K] extends Trait[] ? K : never;
}[keyof T];

export type StatBlockActionKey = 'actions' | 'legendary_actions' | 'bonus_actions' | 'reactions';

export const ACTION_KEY_LABELS: Record<StatBlockActionKey, string> = {
    actions: "Action",
    legendary_actions: "Legendary Action", 
    bonus_actions: "Bonus Action",
    reactions: "Reaction"
};

export interface FetchStatBlockResponse {
	statblocks: StatBlock[];
	status: number;
	message: string; 
}