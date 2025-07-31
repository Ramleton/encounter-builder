import { Box, Button, ButtonGroup, Typography, useTheme } from "@mui/material";
import { Action, Trait } from "../../types/statBlock";

interface StatBlockFormActionCardProps {
	value: Action | Trait;
	idx: number;
	handleEdit: (idx: number) => void;
	handleRemove: (idx: number) => void;
}

function StatBlockFormActionCard({ value, idx, handleEdit, handleRemove }: StatBlockFormActionCardProps) {
	const theme = useTheme();

	return (
		<Box
			sx={{
				display: 'flex',
				flexDirection: 'column',
				border: '1px solid',
				borderColor: theme.palette.secondary.main,
				borderRadius: '0.5rem',
				padding: '1rem',
				gap: 1
			}}
		>
			<Box sx={{
				display: 'flex',
				alignItems: 'baseline',
				gap: 2,
				flexWrap: 'wrap'
			}}>
				<Typography 
					variant="body2" 
					sx={{ 
						fontWeight: 700,
						color: 'text.secondary',
						textTransform: 'uppercase',
						fontSize: '0.75rem',
						letterSpacing: 0.5,
						minWidth: 'fit-content'
					}}
				>
					Name:
				</Typography>
				<Typography 
					variant="body1" 
					sx={{ 
						fontWeight: 500,
						color: 'primary.main',
						wordBreak: 'break-word',
						flex: 1
					}}
				>
					{value.name || <em style={{ color: 'text.secondary', fontWeight: 400 }}>Unnamed</em>}
				</Typography>
			</Box>
			<Box>
				<Typography 
					variant="body2" 
					sx={{ 
						fontWeight: 700,
						color: 'text.secondary',
						textTransform: 'uppercase',
						fontSize: '0.75rem',
						letterSpacing: 0.5,
						mb: 1
					}}
				>
					Description:
				</Typography>
				<Typography 
					variant="body2" 
					sx={{ 
						lineHeight: 1.6,
						wordBreak: 'break-word',
						whiteSpace: 'pre-wrap',
						color: value.description ? 'text.primary' : 'text.secondary',
						fontStyle: value.description ? 'normal' : 'italic',
						pl: 1,
						borderLeft: '3px solid',
						borderColor: 'primary.main',
						backgroundColor: 'rgba(255, 255, 255, 0.01)',
						py: 1,
						pr: 1
					}}
				>
					{value.description || 'No description provided'}
				</Typography>
			</Box>
			<ButtonGroup variant="contained" orientation="vertical">
				<Button
					variant="contained"
					onClick={() => handleEdit(idx)}
				>Edit</Button>
				<Button
					variant="contained"
					onClick={() => handleRemove(idx)}
				>Remove</Button>
			</ButtonGroup>
		</Box>
	)
}

export default StatBlockFormActionCard;