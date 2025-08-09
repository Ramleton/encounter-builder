import { Box, Typography } from "@mui/material";
import { useStatBlock } from "../../context/StatBlockContext";
import { Score, Stats } from "../../types/statBlock";
import { getModifier, getProficiencyBonus, modifierToString } from "../../utils/abilityUtils";

function StatBlockViewStatSection() {
	const { statBlock } = useStatBlock();

	const calcSaveMod = (score: Score): string => {
		if (statBlock.saves.filter(save => save.score == score)[0]?.level === "proficient") {
			return modifierToString(getModifier(statBlock.stats[score.toString().toLowerCase() as keyof Stats] + 2 * getProficiencyBonus(statBlock)));
		}
		return modifierToString(getModifier(statBlock.stats[score.toString().toLowerCase() as keyof Stats]));
	}

	return (
		<Box sx={{
			display: 'grid',
			gridTemplateColumns: 'repeat(3, 1fr)',
			gap: 2,
			margin: '0.5rem 0',
			justifyContent: 'center',
			alignItems: 'center',
			backgroundColor: '#3f3b31ff',
			borderRadius: '1rem'
		}}>
			{Object.values(Score).reduce<[Score, Score][]>((acc, _, i, arr) => {
				if (i % 2 === 0) acc.push([arr[i], arr[i + 1]]);
				return acc;
			}, []).map(score => 
				<Box sx={{ display: 'grid', gridTemplateRows: 'repeat(2, 1fr)' }}>
					<Box sx={{ display: 'flex', flexDirection: 'row', gap: 2 }}>
						<Box sx={{ flex: 1 }}></Box>
						<Typography textAlign="center" sx={{ flex: 1 }}>Modifier</Typography>
						<Typography textAlign="center" sx={{ flex: 1 }}>Save</Typography>
					</Box>
					<Box sx={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)' }}>
						<Typography textAlign="center" sx={{ flex: 1 }}>{score[0].toString().slice(0, 3)}</Typography>
						<Typography textAlign="center" sx={{ flex: 1, whiteSpace: "pre" }}>
							{modifierToString(getModifier(statBlock.stats[score[0].toString().toLowerCase() as keyof Stats]))}
						</Typography>
						<Typography textAlign="center" sx={{ flex: 1, whiteSpace: "pre" }}>{calcSaveMod(score[0])}</Typography>
					</Box>
					<Box sx={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)' }}>
						<Typography textAlign="center">{score[1].toString().slice(0, 3)}</Typography>
						<Typography textAlign="center" sx={{ flex: 1, whiteSpace: "pre" }}>
							{modifierToString(getModifier(statBlock.stats[score[1].toString().toLowerCase() as keyof Stats]))}
						</Typography>
						<Typography textAlign="center" sx={{ flex: 1, whiteSpace: "pre" }}>{calcSaveMod(score[1])}</Typography>
					</Box>
				</Box>
			)}
		</Box>
	)
}

export default StatBlockViewStatSection;