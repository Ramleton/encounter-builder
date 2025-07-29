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
		bonus_actions: [],
		reactions: [],
		last_modified: ""
	}
}