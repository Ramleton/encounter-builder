import { Box, Divider } from "@mui/material";
import { Dispatch, SetStateAction } from "react";
import { StatBlock } from "../types/statBlock";
import StatBlockFormAbilitySection from "./statBlockForm/StatBlockFormAbilitySection";
import StatBlockFormDamageConditionSection from "./statBlockForm/StatBlockFormDamageConditionSection";
import StatBlockFormSenseLanguages from "./statBlockForm/StatBlockFormSenseLanguages";
import StatBlockFormStatSection from "./statBlockForm/StatBlockFormStatSection";
import StatBlockFormTraitsSection from "./statBlockForm/StatBlockFormTraitsSection";
import UpperStatBlockForm from "./statBlockForm/UpperStatBlockForm";

interface StatBlockFormProps {
	statBlock: StatBlock;
	setStatBlock: Dispatch<SetStateAction<StatBlock>>;
}

// TODO: Add stat block context to avoid constant prop drilling

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
				<Divider orientation="vertical" />
				<Box sx={{
					display: 'flex',
					flexDirection: 'column',
					flex: 2,
					height: '100%'
				}}>
					<StatBlockFormSenseLanguages statBlock={statBlock} setStatBlock={setStatBlock} />
					<Divider />
					<StatBlockFormDamageConditionSection statBlock={statBlock} setStatBlock={setStatBlock} />
					<Divider />
					<StatBlockFormTraitsSection statBlock={statBlock} setStatBlock={setStatBlock} />
				</Box>
			</Box>
		</Box>
	)
}

export default StatBlockForm;