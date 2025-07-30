import { Box, TextField } from "@mui/material";
import { Dispatch, SetStateAction } from "react";
import { StatBlock } from "../../types/statBlock";
import { updateField } from "../../utils/statBlockUtils";

interface StatBlockFormSenseLanguagesProps {
	statBlock: StatBlock;
	setStatBlock: Dispatch<SetStateAction<StatBlock>>;
}

function StatBlockFormSenseLanguages(
	{ statBlock, setStatBlock }: StatBlockFormSenseLanguagesProps
) {
	return (
		<Box sx={{
				display: 'flex',
				flexDirection: 'column',
				justifyContent: 'start',
				width: '100%',
				gap: '0.5rem',
				paddingBottom: '1rem',
				paddingLeft: '1rem'
			}}
		>
			<TextField
				required
				id="standard-required"
				label="Languages"
				type="text"
				value={statBlock.languages}
				onChange={(e) => updateField("languages", e.target.value, setStatBlock)}
				sx={{ flex: 2 }}
				variant="standard"
			/>
			<TextField
				required
				id="standard-required"
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