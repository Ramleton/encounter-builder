import { Add, Delete } from "@mui/icons-material";
import { Box, Button, List, ListItem, Typography, useTheme } from "@mui/material";
import { Dispatch, SetStateAction } from "react";
import { useEncounter } from "../../context/CreateEncounterContext";
import { EncounterPlayer } from "../../types/encounter";
import EncounterFormPlayerForm from "./EncounterFormPlayerForm";

interface EncounterFormPlayerSectionProps {
	openPlayerCreation: boolean;
	setOpenPlayerCreation: Dispatch<SetStateAction<boolean>>;
	setOpenCreatureSelection: Dispatch<SetStateAction<boolean>>;
}

function EncounterFormPlayerSection({
	openPlayerCreation,
	setOpenPlayerCreation,
	setOpenCreatureSelection
}: EncounterFormPlayerSectionProps) {
	const theme = useTheme();

	const {
		encounterPlayers,
		setEncounterPlayers,
	} = useEncounter();

	const handleNewPlayer = (newPlayer: EncounterPlayer) => {
		setEncounterPlayers(prev => [...prev, newPlayer]);
	};

	const listEncounterPlayers = () => {
		return <List sx={{
			padding: '0 1rem',
			border: `1px solid ${theme.palette.secondary.main}`,
			maxHeight: '150px',
			overflowY: 'auto',
			mt: '1rem'
		}}>
			{encounterPlayers.map(player => 
				<ListItem key={player.name} sx={{ display: 'flex', flexDirection: 'row', pb: '0.5rem' }}>
					<Typography variant="body1" textAlign="center" sx={{ flex: 1 }}>{player.name}</Typography>
					<Typography variant="body1" textAlign="center" sx={{ flex: 1 }}>
						{
							player.temporary_hp
							? `${player.current_hp}/${player.hp} + ${player.temporary_hp}`
							: `${player.current_hp}/${player.hp}`
						} HP
					</Typography>
					<Typography variant="body1" textAlign="center" sx={{ flex: 1 }}>Level {player.level}</Typography>
					<Button
						sx={{
							backgroundColor: 'red'
						}}
						variant="contained"
						endIcon={<Delete />}
						onClick={() => setEncounterPlayers(prev => prev.filter(encounterPlayer => encounterPlayer.name !== player.name))}
					>
						Remove
					</Button>
				</ListItem>
			)}
		</List>
	}

	return (
		<>
			<Box sx={{
				display: 'flex',
				flexDirection: 'row',
				alignItems: 'center',
				justifyContent: 'space-between',
				gap: '1rem',
				padding: '0 1rem'
			}}>
				<Typography variant="h6">Players</Typography>
				<Button
					variant="contained"
					endIcon={<Add />}
					disabled={openPlayerCreation}
					onClick={() => {
						setOpenCreatureSelection(false);
						setOpenPlayerCreation(true);
					}}
				>
					Add
				</Button>
			</Box>
			<EncounterFormPlayerForm
				open={openPlayerCreation}
				setOpen={setOpenPlayerCreation}
				handleAddPlayer={handleNewPlayer}
			/>
			{!!encounterPlayers.length && listEncounterPlayers()}
		</>
	)
}

export default EncounterFormPlayerSection;