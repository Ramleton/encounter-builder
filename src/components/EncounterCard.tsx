import Button from '@mui/material/Button';
import Card from '@mui/material/Card';
import CardActions from '@mui/material/CardActions';
import CardContent from '@mui/material/CardContent';
import Typography from '@mui/material/Typography';
import { Encounter } from '../types/encounter';

interface EncounterCardProps {
	encounter: Encounter;
	informative?: boolean;
}

export default function EncounterCard({ encounter, informative = false }: EncounterCardProps) {
	const { name, last_modified, creatures, players } = encounter;

	return (
		<Card variant="outlined" sx={{ width: "100%" }}>
			<CardContent>
				<Typography variant="h5" component="div">
					{name}
				</Typography>
				<Typography sx={{ color: 'text.secondary' }}>
					{new Date(last_modified).toLocaleString()}
				</Typography>
				{informative ? (
					<>
						<Typography variant="body2">
							Creatures: {creatures.length}
						</Typography>
						<Typography variant="body2">
							Players: {players.length}
						</Typography>
					</>
				): (
					<></>
				)}
			</CardContent>
			<CardActions>
				<Button size="small">Edit</Button>
				<Button size="small">Run</Button>
			</CardActions>
		</Card>
	);
}