import { ArrowBack, Save } from "@mui/icons-material";
import { Box, Button, CircularProgress, Collapse, Divider, TextField, Typography, useTheme } from "@mui/material";
import { invoke } from "@tauri-apps/api/core";
import { Dispatch, SetStateAction, useCallback, useEffect, useMemo, useState } from "react";
import { useAuth } from "../context/AuthContext";
import { useEncounter } from "../context/CreateEncounterContext";
import { PlayableStatBlock } from "../types/encounter";
import { FetchStatBlockResponse, StatBlock } from "../types/statBlock";
import { calcEncounterDifficulty, calcEncounterXP, generateEmptyEncounter } from "../utils/encounterUtils";
import EncounterFormCreatureSection from "./encounterForm/EncounterFormCreatureSection";
import EncounterFormPlayerSection from "./encounterForm/EncounterFormPlayerSection";

interface EncounterFormProps {
	setOpen: Dispatch<SetStateAction<boolean>>;
	onSave: () => void;
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

function EncounterForm({ setOpen, onSave }: EncounterFormProps) {
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
	const [openCreatureSelection, setOpenCreatureSelection] = useState<boolean>(false);
	const [openPlayerCreation, setOpenPlayerCreation] = useState<boolean>(false);
	const [statBlocks, setStatBlocks] = useState<StatBlock[]>([]);
	const [loading, setLoading] = useState<boolean>(true);
	const theme = useTheme();

	const { user, getAccessToken } = useAuth();

	useEffect(() => {
		const fetchStatBlocks = async () => {
			try {
				const accessToken = await getAccessToken();
				const response = await invoke<FetchStatBlockResponse>("fetch_statblocks_with_joins", { accessToken });
	
				setStatBlocks(response.statblocks);
				setLoading(false);
			} catch(e: any) {
				console.error(e);
			}
		};

		fetchStatBlocks();
	}, []);

	const handleSaveEncounter = async () => {
		if (!user) return;
		const newErrors: Record<string, string> = {};
		if (encounter.name === "") newErrors["name"] = "Encounter name is required";
		if (!playableStatBlocks.length) newErrors["playableStatBlocks"] = "Encounters require at least one creature statblock";
		if (!encounterPlayers.length) newErrors["encounterPlayers"] = "Encounters require at least one player character";

		setErrors(newErrors);

		if (Object.keys(newErrors).length) return;

		// Save Encounter

		setLoading(true);

		const accessToken = await getAccessToken();

		encounter.last_modified = new Date().toISOString();
		encounter.user_id = user.uuid;

		const encounterResponse = await invoke<SaveEncounterResponse>("save_encounter", { encounter, accessToken });

		if (encounterResponse.status === 500) return;

		playableStatBlocks.forEach(statBlock => statBlock.encounter_id = encounterResponse.id);
		encounterPlayers.forEach(player => player.encounter_id = encounterResponse.id);

		await invoke<SavePlayableStatBlocksResponse>("save_playable_statblocks", { playableStatBlocks, accessToken });
		await invoke<SaveEncounterPlayersResponse>("save_encounter_players", { encounterPlayers, accessToken });

		// Reset state
		setPlayableStatBlocks([]);
		setEncounterPlayers([]);
		setEncounter(generateEmptyEncounter());

		setLoading(false);
		setOpen(false);
		onSave();
	}

	const getMatchingStatBlocks = useCallback(() => {
		if (!playableStatBlocks?.length || !statBlocks?.length) {
			return [];
		}

		return playableStatBlocks.map(playableStatBlock => {
			const matchingStatBlock = statBlocks.find(
				statBlock => statBlock.id === playableStatBlock.statblock_id
			);

			if (matchingStatBlock) {
				return {
					playableStatBlock,
					statBlock: matchingStatBlock
				};
			}

			console.warn(`StatBlock not found for statblock_id: ${playableStatBlock.statblock_id}`);
			return null;
		})
		.filter(Boolean) as { playableStatBlock: PlayableStatBlock, statBlock: StatBlock }[];
	}, [playableStatBlocks, statBlocks]);

	const calculateEncounterXP = useMemo(() => {
		const matchingStatBlocks = getMatchingStatBlocks();
		const statBlocksOnly = matchingStatBlocks
			.map(match => match.statBlock)
			.filter(statBlock => statBlock);
		
			return calcEncounterXP(statBlocksOnly);
	}, [playableStatBlocks, statBlocks]);

	if (loading) return (
		<Box sx={{
			display: 'flex',
			flexDirection: 'row',
			height: '700px',
			width: '700px',
			alignItems: 'center',
			justifyContent: 'center'
		}}>
			<CircularProgress size="5rem" />
		</Box>
	)

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
			maxWidth: '700px',
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
				<EncounterFormCreatureSection
					openCreatureSelection={openCreatureSelection}
					setOpenCreatureSelection={setOpenCreatureSelection}
					setOpenPlayerCreation={setOpenPlayerCreation}
					statBlocks={statBlocks}
					getMatchingStatBlocks={getMatchingStatBlocks}
				/>
				<Divider sx={{ margin: '1rem 0' }} />
				<EncounterFormPlayerSection
					openPlayerCreation={openPlayerCreation}
					setOpenPlayerCreation={setOpenPlayerCreation}
					setOpenCreatureSelection={setOpenCreatureSelection}
				/>
			</Box>
			<Divider />
			<Collapse in={!!playableStatBlocks.length && !!encounterPlayers.length}>
				<Box sx={{
					display: 'flex',
					flexDirection: 'column',
					gap: '1rem',
					alignItems: 'center',
					justifyContent: 'center',
					mb: '1rem'
				}}>
						<Typography variant="body1">
							Total XP: {calculateEncounterXP}
						</Typography>
						<Typography variant="body1">
							Encounter Difficulty: {calcEncounterDifficulty(getMatchingStatBlocks().map(pair => pair.statBlock), encounterPlayers)}
						</Typography>
				</Box>
				<Divider />
			</Collapse>
			<Box sx={{
				display: 'flex',
				flexDirection: 'row',
				alignItems: 'center',
				justifyContent: 'center',
				gap: '1rem'
			}}>
				<Button variant="contained" endIcon={<ArrowBack />} onClick={() => {
					setOpen(false);
					setPlayableStatBlocks([]);
					setEncounterPlayers([]);
					setEncounter(generateEmptyEncounter());
				}}>Cancel</Button>
				<Button
					variant="contained"
					endIcon={<Save />}
					onClick={handleSaveEncounter}
					disabled={loading}
				>
					Save
				</Button>
			</Box>
		</Box>
	)
}

export default EncounterForm;