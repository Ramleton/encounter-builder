import { Ability, Score, StatBlock } from "../types/statBlock";


export function modifierToString(modifier: number): string {
	if (modifier > 0) return "+" + modifier;
	if (modifier < 0) return "" + modifier;
	return " " + modifier;
}

export function getModifier(score: number): number {
	return Math.floor((score - 10) / 2);
}

export function getProficiencyBonus(statBlock: StatBlock) {
	if (isNaN(Number.parseInt(statBlock.cr))) {
		return 2;
	}
	return Math.max(Math.floor((Number.parseInt(statBlock.cr) - 1) / 4) + 2, 2);
}

export function abilityToScore(label: Ability): Score {
	switch(label) {
		case Ability.Athletics:
			return Score.Strength;
		case Ability.Acrobatics:
		case Ability.SleightOfHand:
		case Ability.Stealth:
			return Score.Dexterity;
		case Ability.Arcana:
		case Ability.Investigation:
		case Ability.History:
		case Ability.Nature:
		case Ability.Religion:
			return Score.Intelligence;
		case Ability.AnimalHandling:
		case Ability.Insight:
		case Ability.Medicine:
		case Ability.Survival:
		case Ability.Perception:
			return Score.Wisdom
		case Ability.Performance:
		case Ability.Persuasion:
		case Ability.Intimidation:
		case Ability.Deception:
			return Score.Charisma;
	}
}