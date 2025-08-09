import { Box, Divider, Typography } from "@mui/material";
import { useStatBlock } from "../../context/StatBlockContext";
import { getModifier, getProficiencyBonus, modifierToString } from "../../utils/abilityUtils";

function StatBlockViewTopSection() {
	const { statBlock } = useStatBlock();

	const creatureSizeTypeAlignmentText = `
		${statBlock.size}
		${statBlock.type_},
		${statBlock.alignment.toString().replace(/([a-z])([A-Z])/g, `$1 $2`)}
	`

	const creatureInitiative = () => {
		console.log(getProficiencyBonus(statBlock));
		const multiplier = ["none", "proficient", "expertise"].findIndex(
			value => value === statBlock.initiative.toString()
		);

		const bonus = getModifier(statBlock.stats.dexterity + 2 * multiplier * getProficiencyBonus(statBlock));

		return `${modifierToString(bonus)} (${bonus + 10})`;
	}

	return (
		<Box
			sx={{
				display: 'flex',
				flexDirection: 'column',
				pb: '0.5rem'
			}}
		>
			{statBlock.name && (
				<>
					<Typography variant="h4">{statBlock.name}</Typography>
					<Divider sx={{ borderBottomWidth: 4, mb: '0.5rem' }} />
				</>
			)}
			<Typography variant="body1">{creatureSizeTypeAlignmentText}</Typography>
			<Box sx={{
				display: 'flex',
				flexDirection: 'row',
				justifyContent: 'space-between'
			}}>
				<Typography variant="body1">AC {statBlock.ac}</Typography>
				<Typography variant="body1">CR {statBlock.cr}</Typography>
			</Box>
			<Box sx={{
				display: 'flex',
				flexDirection: 'row',
				justifyContent: 'space-between'
			}}>
				<Typography variant="body1">HP {statBlock.hp}</Typography>
				{statBlock.initiative && <Typography variant="body1">Initiative {creatureInitiative()}</Typography>}
			</Box>
			{statBlock.speed && <Typography variant="body1">Speed {statBlock.speed}</Typography>}
		</Box>
	)
}

export default StatBlockViewTopSection;