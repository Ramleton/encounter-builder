import { Dispatch, SetStateAction } from "react";
import { Alignment, Size, StatBlock, StatBlockActionKey, Stats } from "../types/statBlock";

export const generateEmptyStatBlock = (): StatBlock => {
	return {
		name: "",
		size: Size.Medium,
		type_: "",
		subtype: "",
		alignment: Alignment.LawfulGood,
		ac: 0,
		hp: 0,
		initiative: "none",
		hit_dice: "",
		speed: "",
		stats: {
			strength: 10,
			dexterity: 10,
			constitution: 10,
			intelligence: 10,
			wisdom: 10,
			charisma: 10
		},
		saves: [],
		skill_saves: [],
		senses: "",
		languages: "",
		damage_vulnerabilities: [],
		damage_resistances: [],
		damage_immunities: [],
		condition_immunities: [],
		cr: "0",
		traits: [],
		actions: [],
		legendary_actions: [],
		legendary_description: "",
		bonus_actions: [],
		reactions: [],
		last_modified: ""
	}
}

export const updateField = <K extends keyof StatBlock>(
	key: K,
	value: StatBlock[K],
	setStatBlock: Dispatch<SetStateAction<StatBlock>>
) => {
	setStatBlock(prev => ({...prev, [key]: value }));
}

export const updateStatField = <K extends keyof Stats>(
	key: K,
	value: Stats[K],
	setStatBlock: Dispatch<SetStateAction<StatBlock>>
) => {
	setStatBlock(prev => ({...prev, "stats": {...prev.stats, [key]: value }}));
}

export const updateIntegerField = (
	key: keyof StatBlock,
	s: string,
	setStatBlock: Dispatch<SetStateAction<StatBlock>>
): void => {
	const parsed = Number.parseInt(s, 10);
	updateField(key, isNaN(parsed) ? 0 : parsed, setStatBlock);
}

export const STATBLOCK_KEY_LABELS: Record<StatBlockActionKey, string> = {
    actions: "Actions",
    legendary_actions: "Legendary Actions", 
    bonus_actions: "Bonus Actions",
    reactions: "Reactions"
};