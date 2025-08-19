import { Box, List, TextField, Typography, useTheme } from "@mui/material";
import { useEncounter } from "../context/CreateEncounterContext";

function EncounterForm() {
	const { encounter, setEncounter, errors } = useEncounter(); 
	const theme = useTheme();

	return (
		<Box sx={{
			flex: 1,
			display: 'flex',
			flexDirection: 'column',
			border: '1px solid',
			borderColor: theme.palette.secondary.main,
			padding: '1rem 2rem',
			gap: '1rem',
			mb: '1rem'
		}}>
			<TextField
				required
				id="encounter_name"
				label="Encounter Name"
				type="text"
				value={encounter.name}
				error={!!errors["name"]}
				helperText={errors["name"] || ""}
				onChange={(e) => setEncounter((prev) => (
					{...prev, name: e.target.value }
				))}
				variant="standard"
			/>
			<Box sx={{
				display: 'flex',
				flexDirection: 'row',
			}}>
				<Box sx={{
					flex: 1,
					display: 'flex',
					flexDirection: 'column'
				}}>
					<Typography variant="h5">Encounter Participants</Typography>
					<Typography variant="h6">Creatures</Typography>
					<List>
						
					</List>
					<Typography variant="h6">Players</Typography>
				</Box>
			</Box>
		</Box>
	)
}

export default EncounterForm;