import { Box, Divider, Typography, useTheme } from "@mui/material";
import { useCreateStatBlock } from "../../context/CreateStatBlockContext";
import { Trait } from "../../types/statBlock";

interface TraitSectionProps {
	trait: Trait
}

function TraitSection({ trait }: TraitSectionProps) {
	const theme = useTheme();

	return (
		<Typography variant="body1" sx={{
			fontStyle: 'oblique',
		}}>{trait.name}.{" "}
			<Typography
				variant="body2"
				component="span"
				sx={{
					color: theme.palette.primary.contrastText,
					fontStyle: 'normal'
				}}
			>
				{trait.description}
			</Typography>
		</Typography>
	)
}

function StatBlockViewTraitSection() {
	const { statBlock } = useCreateStatBlock();

	return (
		<Box sx={{
			display: 'flex',
			flexDirection: 'column'
		}}>
			<Typography variant="h5">Traits</Typography>
			<Divider sx={{ borderBottomWidth: 2, mb: 1 }} />
			{statBlock.traits.map(trait => <TraitSection key={trait.name} trait={trait} />)}
		</Box>
	)
}

export default StatBlockViewTraitSection;