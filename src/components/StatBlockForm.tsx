import { Box, Divider } from "@mui/material";
import { Dispatch, SetStateAction } from "react";
import { StatBlock } from "../types/statBlock";
import StatBlockFormAbilitySection from "./statBlockForm/StatBlockFormAbilitySection";
import StatBlockFormStatSection from "./statBlockForm/StatBlockFormStatSection";
import UpperStatBlockForm from "./statBlockForm/UpperStatBlockForm";

interface StatBlockFormProps {
	statBlock: StatBlock;
	setStatBlock: Dispatch<SetStateAction<StatBlock>>;
}

function StatBlockForm({ statBlock, setStatBlock }: StatBlockFormProps) {

	return (
		<Box sx={{
			flex: 1,
			display: 'flex',
			flexDirection: 'column',
			border: '1px solid white',
			padding: '1rem 2rem'
		}}>
			<UpperStatBlockForm statBlock={statBlock} setStatBlock={setStatBlock} />
			<Divider sx={{ mt: '1rem', mb: '1rem' }} />
			<StatBlockFormStatSection statBlock={statBlock} setStatBlock={setStatBlock} />
			<Divider sx={{ mt: '1rem', mb: '1rem' }} />
			<Box sx={{
				display: 'flex',
				flexDirection: 'row',
				width: '100%',
				justifyContent: 'center',
				alignItems: 'center',
			}}>
				<StatBlockFormAbilitySection statBlock={statBlock} setStatBlock={setStatBlock} />
				<Box sx={{
					display: 'flex',
					flexDirection: 'column',
					flex: 1,
					justifyContent: 'center',
					alignItems: 'center',
				}}>

				</Box>
			</Box>
		</Box>
	)
}

export default StatBlockForm;