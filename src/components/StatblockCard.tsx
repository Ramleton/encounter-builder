import Button from '@mui/material/Button';
import Card from '@mui/material/Card';
import CardActions from '@mui/material/CardActions';
import CardContent from '@mui/material/CardContent';
import Typography from '@mui/material/Typography';
import { StatBlock } from '../types/statBlock';

interface StatBlockCardProps {
	statblock: StatBlock;
	informative?: boolean;
}

function StatBlockCard({ statblock, informative = false }: StatBlockCardProps) {
	return (
		<Card variant="outlined" sx={{ width: "100%" }}>
			<CardContent>
				<Typography variant="h5" component="div">
					{statblock.name}
				</Typography>
				<Typography sx={{ color: 'text.secondary' }}>
					{new Date(statblock.last_modified).toLocaleString()}
				</Typography>
				{informative ? (
					<>
						<Typography variant="body2">
							HP: {statblock.hp}
						</Typography>
						<Typography variant="body2">
							CR: {statblock.cr}
						</Typography>
					</>
				): (
					<></>
				)}
			</CardContent>
			<CardActions>
				<Button size="small">Edit</Button>
				<Button size="small">Delete</Button>
			</CardActions>
		</Card>
	);
}

export default StatBlockCard;