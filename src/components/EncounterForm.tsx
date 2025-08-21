import { Add, ArrowBack, Delete, Favorite, Save } from "@mui/icons-material";
import { Box, Button, Divider, List, ListItem, TextField, Typography, useTheme } from "@mui/material";
import { invoke } from "@tauri-apps/api/core";
import { Dispatch, ReactNode, SetStateAction, useEffect, useState } from "react";
import { useAuth } from "../context/AuthContext";
import { useEncounter } from "../context/CreateEncounterContext";
import { PlayableStatBlock } from "../types/encounter";
import { FetchStatBlockResponse, StatBlock } from "../types/statBlock";
import { calcEncounterDifficulty, calcEncounterXP } from "../utils/encounterUtils";
import EncounterFormCreatureSelection from "./encounterForm/EncounterFormCreatureSelection";
import EncounterFormPlayerSection from "./encounterForm/EncounterFormPlayerSection";

interface EncounterFormProps {
	setOpen: Dispatch<SetStateAction<boolean>>;
}

interface SaveEncounterResponse {
	id: number,
    status: number,
    message: string,
    was_updated: boolean,
}

interface SavePlayableStatBlocksResponse {
	message: string;
}

interface SaveEncounterPlayersResponse {
	message: string;
}

function EncounterForm({ setOpen }: EncounterFormProps) {
	const {
		encounter,
		setEncounter,
		playableStatBlocks,
		setPlayableStatBlocks,
		encounterPlayers,
		setEncounterPlayers,
		errors,
		setErrors
	} = useEncounter();
	const [statBlocks, setStatBlocks] = useState<StatBlock[]>([]);
	const [openCreatureSelection, setOpenCreatureSelection] = useState<boolean>(false);
	const [openPlayerCreation, setOpenPlayerCreation] = useState<boolean>(false);
	const theme = useTheme();
	const { user, getAccessToken } = useAuth();

	const handleSaveEncounter = async () => {
		if (!user) return;
		const newErrors: Record<string, string> = {};
		if (encounter.name === "") newErrors["name"] = "Encounter name is required";
		if (!playableStatBlocks.length) newErrors["playableStatBlocks"] = "Encounters require at least one creature statblock";
		if (!encounterPlayers.length) newErrors["encounterPlayers"] = "Encounters require at least one player character";

		setErrors(newErrors);

		if (Object.keys(newErrors).length) return;

		// Save Encounter

		const accessToken = await getAccessToken();

		encounter.last_modified = new Date().toISOString();
		encounter.user_id = user.uuid;

		const encounterResponse = await invoke<SaveEncounterResponse>("save_encounter", { encounter, accessToken });

		console.log(encounterResponse);

		if (encounterResponse.status === 500) return;

		playableStatBlocks.forEach(statBlock => statBlock.encounter_id = encounterResponse.id);
		encounterPlayers.forEach(player => player.encounter_id = encounterResponse.id);

		const statblockResponse = await invoke<SavePlayableStatBlocksResponse>("save_playable_statblocks", { playableStatBlocks, accessToken });
		const playerResponse = await invoke<SaveEncounterPlayersResponse>("save_encounter_players", { encounterPlayers, accessToken });

		console.log(statblockResponse);
		console.log(playerResponse);

		setOpen(false);
	}

	const handleAddPlayableStatBlock = (statBlock: StatBlock) => {
		if (!statBlock.id) return;
		
		const newPlayableStatBlock: PlayableStatBlock = {
			current_hp: statBlock.hp,
			temporary_hp: 0,
			statblock_id: statBlock.id
		};

		setPlayableStatBlocks(prev => [...prev, newPlayableStatBlock]);
	}
	
	useEffect(() => {
		const fetchStatBlocks = async () => {
			try {
				const accessToken = await getAccessToken();
				const response = await invoke<FetchStatBlockResponse>("fetch_statblocks_with_joins", { accessToken });
	
				setStatBlocks(response.statblocks);
			} catch(e: any) {
				console.error(e);
			}
		};

		fetchStatBlocks();
	}, []);

	const getMatchingStatBlocks = () => playableStatBlocks.map(playableSB => ({
		playableStatBlock: playableSB,
		statBlock: statBlocks.filter(statBlock => statBlock.id === playableSB.statblock_id)[0]
	}));

	const listEncounterCreatures = (): ReactNode => {
		const matchingStatBlocks = getMatchingStatBlocks();
		return (
			<List sx={{
				maxHeight: '150px',
				overflowY: 'auto',
				border: `1px solid ${theme.palette.secondary.main}`,
				mt: '1rem'
			}}>	
				{matchingStatBlocks.map((matchingStatBlock, i) => (
					<ListItem
						key={i} 
						sx={{
							display: 'flex',
							flexDirection: 'row',
							padding: '0.25rem 1rem',
						}}
					>
						<Typography variant="body1" textAlign="center" sx={{ flex: 1 }}>
							{matchingStatBlock.statBlock.name}
						</Typography>
						<Box sx={{ display: 'flex', flexDirection: 'row', flex: 1, gap: '0.5rem' }}>
							<Favorite sx={{ color: 'red' }} />
							<Typography variant="body1" textAlign="center">
								{matchingStatBlock.playableStatBlock.current_hp}/{matchingStatBlock.statBlock.hp} HP
							</Typography>
						</Box>
						<Typography variant="body1" textAlign="center" sx={{ flex: 1 }}>
							{matchingStatBlock.statBlock.cr} CR
						</Typography>
						<Button
							sx={{
								backgroundColor: 'red'
							}}
							variant="contained"
							endIcon={<Delete />}
							onClick={() => setPlayableStatBlocks(prev => prev.filter((_, idx) => idx !== i))}
						>Remove</Button>
					</ListItem>
				))}
			</List>
		)
	};

	return (
		<Box sx={{
			flex: 1,
			display: 'flex',
			flexDirection: 'column',
			border: '1px solid',
			borderColor: theme.palette.secondary.main,
			borderRadius: '1rem',
			padding: '1rem 2rem',
			gap: '1rem',
			mb: '1rem',
			maxHeight: '700px',
			overflowY: 'auto'
		}}>
			<TextField
				required
				id="encounter_name"
				label="Encounter Name"
				type="text"
				value={encounter.name}
				error={!!errors["name"]}
				helperText={errors["name"] || ""}
				onChange={(e) => setEncounter((prev) => (
					{...prev, name: e.target.value }
				))}
				variant="standard"
			/>
			<Box sx={{
				display: 'flex',
				flexDirection: 'column',
			}}>
				<Typography
					variant="h5"
					sx={{
						padding: '0 1rem',
						borderBottom: `1px solid ${theme.palette.primary.main}`,
						mb: '1rem'
					}}
				>
					Encounter Participants
				</Typography>
				<Box sx={{
					display: 'flex',
					flexDirection: 'row',
					alignItems: 'center',
					justifyContent: 'space-between',
					gap: '1rem',
					padding: '0 1rem'
				}}>
					<Typography variant="h6">Creatures</Typography>
					<Button
						variant="contained"
						endIcon={<Add />}
						disabled={openCreatureSelection}
						onClick={() => {
							setOpenCreatureSelection(true);
							setOpenPlayerCreation(false);
						}}
					>
						Add
					</Button>
				</Box>
				<EncounterFormCreatureSelection
					open={openCreatureSelection}
					setOpen={setOpenCreatureSelection}
					statBlocks={statBlocks}
					handleAddCreature={handleAddPlayableStatBlock}
				/>
				{!!playableStatBlocks.length && listEncounterCreatures()}
				<Divider sx={{ margin: '1rem 0' }} />
				<EncounterFormPlayerSection
					encounterPlayers={encounterPlayers}
					setEncounterPlayers={setEncounterPlayers}
					openPlayerCreation={openPlayerCreation}
					setOpenPlayerCreation={setOpenPlayerCreation}
					setOpenCreatureSelection={setOpenCreatureSelection}
				/>
			</Box>
			<Divider />
			<Box sx={{
				display: 'flex',
				flexDirection: 'column',
				gap: '1rem',
				alignItems: 'center',
				justifyContent: 'center'
			}}>
				<Typography variant="body1">
					Total XP: {calcEncounterXP(getMatchingStatBlocks().map(pair => pair.statBlock))}
				</Typography>
				<Typography variant="body1">
					Encounter Difficulty: {calcEncounterDifficulty(getMatchingStatBlocks().map(pair => pair.statBlock), encounterPlayers)}
				</Typography>
			</Box>
			<Divider />
			<Box sx={{
				display: 'flex',
				flexDirection: 'row',
				alignItems: 'center',
				justifyContent: 'center',
				gap: '1rem'
			}}>
				<Button variant="outlined" endIcon={<ArrowBack />} onClick={() => {
					setOpen(false);
					setPlayableStatBlocks([]);
					setEncounterPlayers([]);
				}}>Cancel</Button>
				<Button variant="outlined" endIcon={<Save />} onClick={handleSaveEncounter}>Save</Button>
			</Box>
		</Box>
	)
}

export default EncounterForm;