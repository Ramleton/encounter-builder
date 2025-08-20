import { Add, ArrowBack, Save } from "@mui/icons-material";
import { Box, Button, Divider, TextField, Typography, useTheme } from "@mui/material";
import { Dispatch, SetStateAction, useEffect, useState } from "react";
import { useEncounter } from "../context/CreateEncounterContext";
import { PlayableStatBlock } from "../types/encounter";
import { StatBlock } from "../types/statBlock";
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
		// TODO: Fetch StatBlocks matching PlayableStatBlocks
	}, [playableStatBlocks]);

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
					handleAddCreature={handleAddPlayableStatBlock}
				/>
				{!!playableStatBlocks.length && playableStatBlocks.map(statBlock => 
					<Box sx={{
						display: 'flex',
						flexDirection: 'row'
					}}>
						<Typography />
					</Box>
				)}
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
				flexDirection: 'row',
				alignItems: 'center',
				justifyContent: 'center',
				gap: '1rem'
			}}>
				<Button variant="outlined" endIcon={<ArrowBack />} onClick={() => setOpen(false)}>Cancel</Button>
				<Button variant="outlined" endIcon={<Save />} onClick={handleSaveEncounter}>Create</Button>
			</Box>
		</Box>
	)
}

export default EncounterForm;