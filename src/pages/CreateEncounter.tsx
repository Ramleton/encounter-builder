import { Box } from "@mui/material";
import { useLocation } from "react-router-dom";
import EncounterForm from "../components/EncounterForm";
import { CreateEncounterProvider } from "../context/CreateEncounterContext";

function CreateEncounter() {
	const location = useLocation();
	const { encounter = null, playableStatBlocks, encounterPlayers } = location.state || {};

	return (
		<Box sx={{
			display: 'flex',
			flexDirection: 'row',
			width: '100%',
			minHeight: '100%',
			gap: '4rem'
		}}>
			<CreateEncounterProvider
				initialEncounter={encounter}
				initialPlayableStatBlocks={playableStatBlocks}
				initialEncounterPlayers={encounterPlayers}
			>
				<EncounterForm />
			</CreateEncounterProvider>
		</Box>
	)
}

export default CreateEncounter;