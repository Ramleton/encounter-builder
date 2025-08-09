import { Box, Divider, Typography, useTheme } from "@mui/material";
import { useStatBlock } from "../../context/StatBlockContext";
import { Trait } from "../../types/statBlock";

interface TraitSectionProps {
	trait: Trait
}

function TraitSection({ trait }: TraitSectionProps) {
	const theme = useTheme();

	return (
		<Box sx={{
			display: 'flex',
			flexDirection: 'row',
			alignItems: "baseline",
			gap: 0.5
		}}>
			<Typography variant="body1" sx={{
				fontStyle: 'italic'
			}}>{trait.name}.</Typography>
			<Typography variant="body2" sx={{ color: theme.palette.primary.contrastText }}>
				{trait.description}
			</Typography>
		</Box>
	)
}

function StatBlockViewTraitSection() {
	const { statBlock } = useStatBlock();

	return (
		<Box sx={{
			display: 'flex',
			flexDirection: 'column'
		}}>
			<Typography variant="h5">Traits</Typography>
			<Divider sx={{ borderBottomWidth: 2, mb: 1 }} />
			{statBlock.traits.map(trait => <TraitSection trait={trait} />)}
		</Box>
	)
}

export default StatBlockViewTraitSection;