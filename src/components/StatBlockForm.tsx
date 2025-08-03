import { Box, Divider, useTheme } from "@mui/material";
import StatBlockFormAbilitySection from "./statBlockForm/StatBlockFormAbilitySection";
import StatBlockFormActionsSection from "./statBlockForm/StatBlockFormActionsSection";
import StatBlockFormDamageConditionSection from "./statBlockForm/StatBlockFormDamageConditionSection";
import StatBlockFormSenseLanguages from "./statBlockForm/StatBlockFormSenseLanguages";
import StatBlockFormSpellSection from "./statBlockForm/StatBlockFormSpellSection";
import StatBlockFormStatSection from "./statBlockForm/StatBlockFormStatSection";
import StatBlockFormTraitsSection from "./statBlockForm/StatBlockFormTraitsSection";
import UpperStatBlockForm from "./statBlockForm/UpperStatBlockForm";

function StatBlockForm() {
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
			<Box sx={{ flexShrink: 0 }}>
				<UpperStatBlockForm />
				<Divider sx={{ mt: '1rem', mb: '1rem' }} />
				<StatBlockFormStatSection />
				<Divider sx={{ mt: '1rem' }} />
			</Box>
			<Box sx={{
				display: 'flex',
				flexDirection: 'row',
				flexGrow: 1,
				overflow: 'auto',
				width: '100%',
				justifyContent: 'center',
				alignItems: 'stretch',
				height: '75vh',
				minHeight: 0,
			}}>
				<StatBlockFormAbilitySection />
				<Divider orientation="vertical" />
				<Box sx={{
					display: 'flex',
					flexDirection: 'column',
					flex: 1,
					minHeight: 0,
				}}>
					<StatBlockFormSenseLanguages />
					<Divider />
					<StatBlockFormDamageConditionSection />
					<Divider />
					<StatBlockFormTraitsSection />
				</Box>
			</Box>
			<Divider />
			<StatBlockFormSpellSection />
			<Divider />
			<StatBlockFormActionsSection />
		</Box>
	)
}

export default StatBlockForm;