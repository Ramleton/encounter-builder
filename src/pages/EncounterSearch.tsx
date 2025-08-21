import { Add, Search } from "@mui/icons-material";
import { Backdrop, Box, Button, CircularProgress, TextField, Typography } from "@mui/material";
import { invoke } from "@tauri-apps/api/core";
import { Dispatch, SetStateAction, useEffect, useState } from "react";
import EncounterCard from "../components/EncounterCard";
import { useAuth } from "../context/AuthContext";
import { Encounter, EncounterPlayer, PlayableStatBlock } from "../types/encounter";
import CreateEncounter from "./CreateEncounter";

interface EncounterSearchHeaderProps {
	search: string;
	setSearch: Dispatch<SetStateAction<string>>;
	setOpen: Dispatch<SetStateAction<boolean>>;
}

interface FetchEncountersResponse {
	encounters: Encounter[];
	status: number;
	message: string;
}

interface EditEncounter {
	encounter: Encounter;
	playableStatBlocks: PlayableStatBlock[];
	encounterPlayers: EncounterPlayer[];
}

function EncounterSearchHeader({ search, setSearch, setOpen }: EncounterSearchHeaderProps) {
	return (
		<Box sx={{
			display: 'flex',
			flexDirection: 'row',
			borderBottom: '1px solid blue',
			alignItems: 'center',
			justifyContent: 'space-between',
			gap: '1rem',
			width: '100%'
		}}>
			<Typography variant="h3">Encounters</Typography>
			<TextField
				id="outlined-search"
				label="Search"
				type="search"
				value={search}
				onChange={(e) => setSearch(e.target.value)}
				slotProps={{
					input: {
						startAdornment: <Search sx={{ marginRight: '0.5rem' }}/>
					}
				}}
				sx={{
					minWidth: '33%'
				}}
			/>
			<Button
				variant="contained"
				startIcon={<Add />}
				onClick={() => setOpen(true)}
				sx={{
					marginBottom: '1rem',
					marginTop: '1rem'
				}}
			>
				Create
			</Button>
		</Box>
	)
}

function EncounterSearch() {
	const [search, setSearch] = useState<string>("");
	const [encounters, setEncounters] = useState<Encounter[]>([]);
	const [editEncounter, setEditEncounter] = useState<EditEncounter>();
	const [loading, setLoading] = useState<boolean>(true);
	const [open, setOpen] = useState<boolean>(false);

	const { getAccessToken } = useAuth();

	useEffect(() => {
		const fetchEncounters = async () => {
			const accessToken = await getAccessToken();

			const response = await invoke<FetchEncountersResponse>("fetch_encounters", { accessToken });

			if (response.status !== 200) console.log(response.message);

			setEncounters(response.encounters);
			setLoading(false);
		};
		fetchEncounters();
	}, []);

	return (
		<>
			<EncounterSearchHeader search={search} setSearch={setSearch} setOpen={setOpen} />
			<Backdrop open={open} sx={{
				display: 'flex',
				alignItems: 'center',
				justifyContent: 'center'
			}}>
				<CreateEncounter
					setOpen={setOpen}
					editEncounter={editEncounter?.encounter}
					editEncounterPlayers={editEncounter?.encounterPlayers}
					editPlayableStatBlocks={editEncounter?.playableStatBlocks}
				/>
			</Backdrop>
			{ loading && 
				(
					<Box sx={{
						display: 'flex',
						flexDirection: 'column',
						alignItems: 'center',
						justifyContent: 'center',
						height: '100%'
					}}>
						<CircularProgress color="secondary" />
					</Box>
				)
			}
			{ !loading && (
				<Box sx={{
					display: 'grid',
					gridTemplateColumns: 'repeat(4, 1fr)',
					width: '100%',
					margin: '1rem 0',
					gap: '1rem'
				}}>
					{encounters
						.filter(encounter => encounter.name.includes(search))
						.map(encounter => <EncounterCard
							key={encounter.id}
							encounter={encounter}
							informative
							handleEdit={(playableStatBlocks: PlayableStatBlock[], encounterPlayers: EncounterPlayer[]) => {
								setEditEncounter({
									encounter,
									encounterPlayers,
									playableStatBlocks
								});
								setOpen(true);
							}}
						/>)
					}
				</Box>
			)}	
		</>
	)
}

export default EncounterSearch;