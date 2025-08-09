import { Box, Typography } from "@mui/material";
import { useStatBlock } from "../../context/StatBlockContext";
import { Score, Stats } from "../../types/statBlock";
import { getModifier, getProficiencyBonus, modifierToString } from "../../utils/abilityUtils";

interface StatSectionProps {
	score: Score
}

function StatSection({ score }: StatSectionProps) {
	const { statBlock } = useStatBlock();

	const calcSaveMod = (score: Score): string => {
		if (statBlock.saves.filter(save => save.score == score)[0]?.level === "proficient") {
			return modifierToString(getModifier(statBlock.stats[score.toString().toLowerCase() as keyof Stats] + 2 * getProficiencyBonus(statBlock)));
		}
		return modifierToString(getModifier(statBlock.stats[score.toString().toLowerCase() as keyof Stats]));
	}

	return (
		<Box sx={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)' }}>
			<Typography textAlign="center" sx={{ flex: 1 }}>{score.toString().slice(0, 3)}</Typography>
			<Typography textAlign="center" sx={{ flex: 1, whiteSpace: "pre" }}>
				{modifierToString(getModifier(statBlock.stats[score.toString().toLowerCase() as keyof Stats]))}
			</Typography>
			<Typography textAlign="center" sx={{ flex: 1, whiteSpace: "pre" }}>{calcSaveMod(score)}</Typography>
		</Box>
	)
}

function StatBlockViewStatSection() {
	return (
		<Box sx={{
			display: 'grid',
			gridTemplateColumns: 'repeat(3, 1fr)',
			gap: 2,
			margin: '0 0.25rem',
			justifyContent: 'center',
			alignItems: 'center',
			backgroundColor: '#3f3b31ff',
		}}>
			{Object.values(Score).reduce<[Score, Score][]>((acc, _, i, arr) => {
				if (i % 2 === 0) acc.push([arr[i], arr[i + 1]]);
				return acc;
			}, []).map(score => 
				<Box sx={{ display: 'grid', gridTemplateRows: 'repeat(2, 1fr)' }}>
					<Box sx={{ display: 'flex', flexDirection: 'row', gap: 2 }}>
						<Box sx={{ flex: 1 }}></Box>
						<Typography textAlign="center" sx={{ flex: 1 }}>Mod</Typography>
						<Typography textAlign="center" sx={{ flex: 1 }}>Save</Typography>
					</Box>
					<StatSection score={score[0]} />
					<StatSection score={score[1]} />
				</Box>
			)}
		</Box>
	)
}

export default StatBlockViewStatSection;