import { Favorite, Leaderboard, Shield } from '@mui/icons-material';
import { Box } from '@mui/material';
import Button from '@mui/material/Button';
import Card from '@mui/material/Card';
import CardActions from '@mui/material/CardActions';
import CardContent from '@mui/material/CardContent';
import Typography from '@mui/material/Typography';
import { StatBlock } from '../types/statBlock';

interface StatBlockCardProps {
	statBlock: StatBlock;
	handleEdit: () => void;
	handleDelete: (statBlock: StatBlock) => Promise<void>;
	informative?: boolean;
}

function StatBlockCard({ statBlock, informative = false, handleEdit, handleDelete }: StatBlockCardProps) {

	return (
		<Card variant="outlined" sx={{ width: "100%" }}>
			<CardContent sx={{
				display: "flex",
				flexDirection: "column",
				gap: "0.5rem"
			}}>
				<Typography variant="h5" component="div">
					{statBlock.name}
				</Typography>
				{informative ? (
					<Box sx={{
						display: "flex",
						flexDirection: "row",
						alignItems: "center",
						justifyContent: "space-evenly"
					}}>
						<Box sx={{
							display: "flex",
							flexDirection: "row",
							alignItems: 'center',
							gap: "0.25rem"
						}}>
							<Favorite sx={{ color: "red" }} />
							<Typography variant="body2">
								HP {statBlock.hp}
							</Typography>
						</Box>
						<Box sx={{
							display: "flex",
							flexDirection: "row",
							alignItems: 'center',
							gap: "0.25rem"
						}}>
							<Shield sx={{ color: "#2b7ce6ff" }} />
							<Typography variant="body2">
								AC {statBlock.ac}
							</Typography>
						</Box>
						<Box sx={{
							display: "flex",
							flexDirection: "row",
							alignItems: 'center',
							gap: "0.25rem"
						}}>
							<Leaderboard sx={{ color: "#a3e22dff" }} />
							<Typography variant="body2">
								CR {statBlock.cr}
							</Typography>
						</Box>
					</Box>
				): (
					<></>
				)}
				<Typography sx={{ color: 'text.secondary' }}>
					Last Modified: {new Date(statBlock.last_modified).toLocaleString()}
				</Typography>
			</CardContent>
			<CardActions>
				<Button size="small" onClick={handleEdit}>Edit</Button>
				<Button size="small" onClick={() => handleDelete(statBlock)}>Delete</Button>
			</CardActions>
		</Card>
	);
}

export default StatBlockCard;