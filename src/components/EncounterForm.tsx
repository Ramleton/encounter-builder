import { Add, ArrowBack, Delete, Favorite, Save } from "@mui/icons-material";
import { Box, Button, Divider, List, ListItem, TextField, Typography, useTheme } from "@mui/material";
import { invoke } from "@tauri-apps/api/core";
import { Dispatch, ReactNode, SetStateAction, useEffect, useState } from "react";
import { useAuth } from "../context/AuthContext";
import { useEncounter } from "../context/CreateEncounterContext";
import { PlayableStatBlock } from "../types/encounter";
import { FetchStatBlockResponse, StatBlock } from "../types/statBlock";
import { calcEncounterXP } from "../utils/encounterUtils";
import EncounterFormCreatureSelection from "./EncounterFormCreatureSelection";

interface EncounterFormProps {
	setOpen: Dispatch<SetStateAction<boolean>>;
}

function EncounterForm({ setOpen }: EncounterFormProps) {
	const {
		encounter,
		setEncounter,
		playableStatBlocks,
		setPlayableStatBlocks,
		encounterPlayers,
		setEncounterPlayers,
		errors
	} = useEncounter();
	const [statBlocks, setStatBlocks] = useState<StatBlock[]>([]);
	const [openCreatureSelection, setOpenCreatureSelection] = useState<boolean>(false);
	const [playerCreation, setPlayerCreation] = useState<number>(0);
	const theme = useTheme();
	const { getAccessToken } = useAuth();

	const handleSaveEncounter = () => {
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
				borderTopLeftRadius: '0.75rem',
				borderBottomLeftRadius: '0.75rem',
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
							variant="contained"
							endIcon={<Delete />}
							onClick={() => setPlayableStatBlocks(prev => prev.filter((_, idx) => idx !== i))}
						>Remove</Button>
					</ListItem>
				))}
			</List>
		)
	}

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
			mb: '1rem'
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
						onClick={() => setOpenCreatureSelection(true)}
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
				<Box sx={{
					display: 'flex',
					flexDirection: 'row',
					alignItems: 'center',
					justifyContent: 'space-between',
					gap: '1rem',
					padding: '0 1rem'
				}}>
					<Typography variant="h6">Players</Typography>
					<Button variant="contained" endIcon={<Add />}>Add</Button>
				</Box>
			</Box>
			<Box sx={{
				display: 'flex',
				flexDirection: 'row'
			}}>
				<Typography variant="body1">
					Total XP: {calcEncounterXP(getMatchingStatBlocks().map(pair => pair.statBlock))}
				</Typography>
			</Box>
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