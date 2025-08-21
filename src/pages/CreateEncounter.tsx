import { Box } from "@mui/material";
import { Dispatch, SetStateAction } from "react";
import EncounterForm from "../components/EncounterForm";
import { CreateEncounterProvider } from "../context/CreateEncounterContext";
import { Encounter, EncounterPlayer, PlayableStatBlock } from "../types/encounter";

interface CreateEncounterProps {
	setOpen: Dispatch<SetStateAction<boolean>>;
	editEncounter?: Encounter;
	editPlayableStatBlocks?: PlayableStatBlock[];
	editEncounterPlayers?: EncounterPlayer[];
	onSave: () => void;
}

function CreateEncounter({
	setOpen,
	editEncounter,
	editPlayableStatBlocks,
	editEncounterPlayers,
	onSave,
}: CreateEncounterProps) {
	const encounter = editEncounter;
	const playableStatBlocks = editPlayableStatBlocks || [];
	const encounterPlayers = editEncounterPlayers || [];

	const providerKey = editEncounter
		? `edit-${editEncounter.id}-${Date.now()}`
		: `create-${Date.now()}`;

	return (
		<Box sx={{
			display: 'flex',
			flexDirection: 'row',
			width: '600px',
			gap: '4rem'
		}}>
			<CreateEncounterProvider
				key={providerKey}
				initialEncounter={encounter}
				initialPlayableStatBlocks={playableStatBlocks}
				initialEncounterPlayers={encounterPlayers}
			>
				<EncounterForm setOpen={setOpen} onSave={onSave} />
			</CreateEncounterProvider>
		</Box>
	)
}

export default CreateEncounter;