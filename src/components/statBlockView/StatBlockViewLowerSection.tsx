import { Box, Typography, useTheme } from "@mui/material";
import { useCreateStatBlock } from "../../context/CreateStatBlockContext";
import { Ability, ConditionType, DamageType, SkillProficiency, Stats } from "../../types/statBlock";
import { abilityToScore, getModifier, getProficiencyBonus, modifierToString } from "../../utils/abilityUtils";

interface DamageTypeSectionProps {
	label: string;
	damageTypes: (DamageType | ConditionType)[];
}

function TypeSection({ label, damageTypes }: DamageTypeSectionProps) {
	const theme = useTheme();

	return (
		<Typography variant="body1" sx={{ display: 'flex', flexDirection: 'row', whiteSpace: 'pre', alignItems: "baseline" }}>
			{`${label} `}
			<Typography variant="body2" sx={{ color: theme.palette.primary.contrastText }}>
				{damageTypes.map((type, i) => i !== damageTypes.length - 1
					? `${type}, `
					: `${type}`
				)}
			</Typography>
		</Typography>
	)
}

function StatBlockViewLowerSection() {
	const { statBlock } = useCreateStatBlock();
	const theme = useTheme();

	const calcSkillSave = (skill: SkillProficiency) => {
		const score = abilityToScore(skill.ability);
		const multiplier = ["none", "proficient", "expertise"].findIndex(
			value => value === skill.level
		);
		const statMod = getModifier(statBlock.stats[score.toString().toLowerCase() as keyof Stats]);
		return modifierToString(statMod + multiplier * getProficiencyBonus(statBlock));
	};

	const generateSenseText = (): string => {
		const multiplier = ["none", "proficient", "expertise"].findIndex(
			value => value === statBlock.skill_saves.filter(skill => skill.ability === Ability.Perception)[0]?.level
		);
		const passivePerception = 10 + getModifier(statBlock.stats.wisdom) + (multiplier !== -1 ? multiplier * getProficiencyBonus(statBlock) : 0);

		return statBlock.senses
			? `${statBlock.senses}, Passive Perception ${passivePerception}`
			: `Passive Perception ${passivePerception}`;
	};

	const upgradedSkillSaves = statBlock.skill_saves.filter(skill => skill.level !== "none");
	const immunities = [...statBlock.damage_immunities, ...statBlock.condition_immunities];

	return (
		<Box sx={{
			display: 'flex',
			flexDirection: 'column',
			margin: '0.5rem 0'
		}}>
			{statBlock.skill_saves.length !== 0 &&
				<Typography variant="body1" sx={{ display: 'flex', flexDirection: 'row', whiteSpace: 'pre', alignItems: "baseline" }}>
					Skills{" "}
					<Typography variant="body2" sx={{ color: theme.palette.primary.contrastText, whiteSpace: "collapse" }}>{
					upgradedSkillSaves
						.map((skill, i) => `${skill.ability.replace(/([a-z])([A-Z])/g, `$1 $2`)} ${calcSkillSave(skill)}${i !== upgradedSkillSaves.length - 1 ? ', ' : ''}`)
					}
					</Typography>
				</Typography>
			}
			{statBlock.damage_resistances.length !== 0 && <TypeSection
				label={"Resistances"}
				damageTypes={statBlock.damage_resistances}
			/>}
			{statBlock.damage_immunities.length !== 0 && <TypeSection
				label={"Immunities"}
				damageTypes={immunities}
			/>}
			{statBlock.damage_vulnerabilities.length !== 0 && <TypeSection
				label={"Vulnerabilities"}
				damageTypes={statBlock.damage_vulnerabilities}
			/>}
			{<Typography variant="body1" sx={{ display: 'flex', flexDirection: 'row', alignItems: "baseline", whiteSpace: 'pre' }}>
				Senses{" "}
				<Typography variant="body2" sx={{ color: theme.palette.primary.contrastText, whiteSpace: "collapse"}}>
					{generateSenseText()}
				</Typography>
			</Typography>}
			<Typography variant="body1" sx={{ display: 'flex', flexDirection: 'row', alignItems: "baseline", whiteSpace: 'pre' }}>
				Languages{" "}
				<Typography variant="body2" sx={{ color: theme.palette.primary.contrastText, whiteSpace: "collapse"}}>
					{statBlock.languages ? statBlock.languages : "None"}
				</Typography>
			</Typography>
		</Box>
	)
}

export default StatBlockViewLowerSection;