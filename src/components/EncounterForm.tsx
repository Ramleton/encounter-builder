import { Box, useTheme } from "@mui/material";

function EncounterForm() {
	const theme = useTheme();

	return (
		<Box sx={{
			flex: 1,
			display: 'flex',
			flexDirection: 'column',
			border: '1px solid',
			borderColor: theme.palette.secondary.main,
			padding: '1rem 2rem',
			mb: '1rem'
		}}>
			
		</Box>
	)
}

export default EncounterForm;