import { Ability, Score } from "../types/statblock";

function abilityToScore(label: Ability): Score {
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

export default abilityToScore;