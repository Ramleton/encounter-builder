import { Box, Typography, useTheme } from "@mui/material";
import { useCreateStatBlock } from "../../context/CreateStatBlockContext";

function StatBlockViewSpellcastingSection() {
	const { statBlock } = useCreateStatBlock();
	
	const theme = useTheme();

	return (
		<Box sx={{
			display: 'flex',
			flexDirection: 'column'
		}}>
			<Typography variant="body1" sx={{
				fontStyle: "oblique",
				mb: '0.25rem'
			}}>
				Spellcasting.{" "}
				<Typography
					variant="body2"
					component="span"
					sx={{ color: theme.palette.primary.contrastText, fontStyle: "normal" }}
				>
					The {statBlock.name} casts one of the following spells, using {" "}
					{statBlock.spells?.ability} as the spellcasting ability
					(spell save DC {statBlock.spells?.save_dc}):
				</Typography>
			</Typography>
			{statBlock.spells && Object.entries(statBlock.spells.spells).map(value => 
				<Typography
					key={value[0]}
					variant="body2"
					sx={{
						color: theme.palette.primary.contrastText,
						textIndent: '-1em',
						pl: '1em'
					}}
				>
					{value[0]}: {value[1]}
				</Typography>
			)}
		</Box>
	)
}

export default StatBlockViewSpellcastingSection;