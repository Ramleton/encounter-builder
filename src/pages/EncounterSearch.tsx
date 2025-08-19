import { Box } from "@mui/material";
import { useState } from "react";
import { Encounter } from "../types/encounter";

function EncounterSearch() {
	const [search, setSearch] = useState<string>("");
	const [encounters, setEncounters] = useState<Encounter[]>([]);
	const [loading, setLoading] = useState<boolean>();

	return (
		<Box>
			
		</Box>
	)
}

export default EncounterSearch;