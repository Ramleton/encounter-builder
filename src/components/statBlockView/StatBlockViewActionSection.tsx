import { Box, Divider, Typography, useTheme } from "@mui/material";
import { ReactNode } from "react";
import { useCreateStatBlock } from "../../context/CreateStatBlockContext";
import { Action } from "../../types/statBlock";

interface StatBlockViewActionSectionProps {
	label: string;
	actions: Action[];
	children?: ReactNode;
}

interface ActionSectionProps {
	action: Action
}

function ActionSection({ action }: ActionSectionProps) {
	const theme = useTheme();

	return (
		<Typography variant="body1" sx={{
			fontStyle: 'oblique',
		}}>{action.name}.{" "}
			<Typography
				variant="body2"
				component="span"
				sx={{
					color: theme.palette.primary.contrastText,
					fontStyle: 'normal'
				}}
			>
				{action.description}
			</Typography>
		</Typography>
	)
}

function StatBlockViewActionSection({ label, actions, children }: StatBlockViewActionSectionProps) {
	const { statBlock } = useCreateStatBlock();
	const theme = useTheme();

	return (
		<Box sx={{
			display: 'flex',
			flexDirection: 'column',
		}}>
			<Typography variant="h5">{label}</Typography>
			<Divider sx={{ borderBottomWidth: 2, mb: 1 }} />
			<Box sx={{
				display: 'inherit',
				flexDirection: 'inherit',
				gap: '0.25rem'
			}}>
				{label === "Legendary Actions" && (
					<Typography
						sx={{
							mb: '0.25rem',
							color: theme.palette.primary.contrastText,
						}}
					>{statBlock.legendary_description}</Typography>
				)}
				{actions.map((action, i) => <ActionSection key={i} action={action} />)}
				{children}
			</Box>
		</Box>
	)
}

export default StatBlockViewActionSection;