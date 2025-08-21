import { CircularProgress } from '@mui/material';
import Button from '@mui/material/Button';
import Card from '@mui/material/Card';
import CardActions from '@mui/material/CardActions';
import CardContent from '@mui/material/CardContent';
import Typography from '@mui/material/Typography';
import { invoke } from '@tauri-apps/api/core';
import { useEffect, useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { Encounter, EncounterPlayer, PlayableStatBlock } from '../types/encounter';

interface FetchPlayableStatBlocksForEncounterResponse {
	playable_stat_blocks: PlayableStatBlock[];
	status: number;
	message: string;
}

interface FetchEncounterPlayersForEncounterResponse {
	encounter_players: EncounterPlayer[];
	status: number;
	message: string;
}

interface EncounterCardProps {
	encounter: Encounter;
	handleEdit: (playableStatBlocks: PlayableStatBlock[], encounterPlayers: EncounterPlayer[]) => void;
	informative?: boolean;
	refreshTrigger: number
}

export default function EncounterCard({ encounter, informative = false, handleEdit, refreshTrigger }: EncounterCardProps) {
	const [loading, setLoading] = useState<boolean>(true);
	const [playableStatBlocks, setPlayableStatBlocks] = useState<PlayableStatBlock[]>([]);
	const [encounterPlayers, setEncounterPlayers] = useState<EncounterPlayer[]>([]);

	const { name, last_modified } = encounter;
	const { getAccessToken } = useAuth();

	useEffect(() => {
		const fetchPlayableStatBlocks = async () => {
			if (!encounter.id) return;
			const accessToken = await getAccessToken();

			const playableStatBlockResponse = await invoke<FetchPlayableStatBlocksForEncounterResponse>(
				"fetch_playable_statblocks_for_encounter",
				{
					encounterId: encounter.id,
					accessToken
				}
			);
			
			if (playableStatBlockResponse.status !== 200) {
				console.error(playableStatBlockResponse.message);
			}
			
			setPlayableStatBlocks(playableStatBlockResponse.playable_stat_blocks);
			
			const encounterPlayersResponse = await invoke<FetchEncounterPlayersForEncounterResponse>(
				"fetch_encounter_players_for_encounter",
				{
					encounterId: encounter.id,
					accessToken
				}
			);
			
			if (encounterPlayersResponse.status !== 200) {
				console.error(encounterPlayersResponse.message);
			}
			
			setEncounterPlayers(encounterPlayersResponse.encounter_players);
			setLoading(false);
		}

		fetchPlayableStatBlocks();
	}, [refreshTrigger]);

	return (
		<Card variant="outlined" sx={{ width: "100%" }}>
			<CardContent>
				<Typography variant="h5" component="div">
					{name}
				</Typography>
				<Typography sx={{ color: 'text.secondary' }}>
					{new Date(last_modified).toLocaleString()}
				</Typography>
				{loading && <CircularProgress />}
				{!loading && informative ? (
					<>
						<Typography variant="body2">
							Creatures: {playableStatBlocks.length}
						</Typography>
						<Typography variant="body2">
							Players: {encounterPlayers.length}
						</Typography>
					</>
				): (
					<></>
				)}
			</CardContent>
			<CardActions>
				<Button
					size="small"
					onClick={() => handleEdit(playableStatBlocks, encounterPlayers)}
				>
					Edit
				</Button>
				<Button size="small">Run</Button>
				<Button size="small">Delete</Button>
			</CardActions>
		</Card>
	);
}