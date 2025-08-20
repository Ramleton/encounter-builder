import { Box } from "@mui/material";
import { Dispatch, SetStateAction } from "react";
import { useLocation } from "react-router-dom";
import EncounterForm from "../components/EncounterForm";
import { CreateEncounterProvider } from "../context/CreateEncounterContext";

interface CreateEncounterProps {
	setOpen: Dispatch<SetStateAction<boolean>>;
}

function CreateEncounter({ setOpen }: CreateEncounterProps) {
	const location = useLocation();
	const { encounter = null, playableStatBlocks = [], encounterPlayers = [] } = location.state || {};

	return (
		<Box sx={{
			display: 'flex',
			flexDirection: 'row',
			width: '600px',
			gap: '4rem'
		}}>
			<CreateEncounterProvider
				initialEncounter={encounter}
				initialPlayableStatBlocks={playableStatBlocks}
				initialEncounterPlayers={encounterPlayers}
			>
				<EncounterForm setOpen={setOpen} />
			</CreateEncounterProvider>
		</Box>
	)
}

export default CreateEncounter;