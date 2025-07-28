import { Alignment, Size, StatBlock } from "../types/statBlock"

export const generateEmptyStatBlock = (): StatBlock => {
	return {
		name: "",
		size: Size.Medium,
		type_: "",
		subtype: "",
		alignment: Alignment.LawfulGood,
		ac: 0,
		hp: 0,
		hit_dice: "",
		speed: "",
		stats: {
			strength: 0,
			dexterity: 0,
			constitution: 0,
			intelligence: 0,
			wisdom: 0,
			charisma: 0
		},
		saves: [],
		skill_saves: [],
		senses: "",
		languages: "",
		damage_vulnerabilities: [],
		damage_resistances: [],
		damage_immunities: [],
		condition_immunities: [],
		cr: "",
		traits: [],
		actions: [],
		legendary_actions: [],
		bonus_actions: [],
		reactions: [],
		last_modified: ""
	}
}