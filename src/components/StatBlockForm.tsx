import { Box, Divider, useTheme } from "@mui/material";
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
	const theme = useTheme();

	return (
		<Box sx={{
			flex: 1,
			display: 'flex',
			flexDirection: 'column',
			border: '1px solid',
			borderColor: theme.palette.secondary.main,
			padding: '1rem 2rem',
			height: '120vh',
		}}>
			<Box sx={{ flexShrink: 0 }}>
				<UpperStatBlockForm statBlock={statBlock} setStatBlock={setStatBlock} />
				<Divider sx={{ mt: '1rem', mb: '1rem' }} />
				<StatBlockFormStatSection statBlock={statBlock} setStatBlock={setStatBlock} />
				<Divider sx={{ mt: '1rem', mb: '1rem' }} />
			</Box>
			<Box sx={{
				display: 'flex',
				flexDirection: 'row',
				flexGrow: 1,
				overflow: 'auto',
				width: '100%',
				justifyContent: 'center',
				alignItems: 'stretch',
				height: '100%',
				minHeight: 0,
			}}>
				<StatBlockFormAbilitySection statBlock={statBlock} setStatBlock={setStatBlock} />
				<Divider orientation="vertical" />
				<Box sx={{
					display: 'flex',
					flexDirection: 'column',
					flex: 1,
					minHeight: 0,
				}}>
					<StatBlockFormSenseLanguages statBlock={statBlock} setStatBlock={setStatBlock} />
					<Divider />
					<StatBlockFormDamageConditionSection statBlock={statBlock} setStatBlock={setStatBlock} />
					<Divider />
					<StatBlockFormTraitsSection statBlock={statBlock} setStatBlock={setStatBlock} />
				</Box>
			</Box>
			<Divider />
		</Box>
	)
}

export default StatBlockForm;