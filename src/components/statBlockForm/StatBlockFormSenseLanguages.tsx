import { Box, TextField } from "@mui/material";
import { useCreateStatBlock } from "../../context/CreateStatBlockContext";
import { updateField } from "../../utils/statBlockUtils";

function StatBlockFormSenseLanguages() {
	const { statBlock, setStatBlock } = useCreateStatBlock();

	return (
		<Box sx={{
				display: 'flex',
				flexDirection: 'column',
				justifyContent: 'start',
				width: '100%',
				gap: '0.5rem',
				paddingTop: '1rem',
				paddingBottom: '1rem',
				paddingLeft: '1rem'
			}}
		>
			<TextField
				id="standard"
				label="Languages"
				type="text"
				value={statBlock.languages}
				onChange={(e) => updateField("languages", e.target.value, setStatBlock)}
				sx={{ flex: 2 }}
				variant="standard"
			/>
			<TextField
				id="standard"
				label="Senses"
				type="text"
				value={statBlock.senses}
				onChange={(e) => updateField("senses", e.target.value, setStatBlock)}
				sx={{ flex: 2 }}
				variant="standard"
			/>
		</Box>
	)
}

export default StatBlockFormSenseLanguages;