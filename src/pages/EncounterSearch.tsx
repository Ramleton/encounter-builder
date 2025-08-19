import { Add, Search } from "@mui/icons-material";
import { Box, Button, CircularProgress, TextField, Typography } from "@mui/material";
import { Dispatch, SetStateAction, useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import EncounterCard from "../components/EncounterCard";
import { Encounter } from "../types/encounter";

interface EncounterSearchHeaderProps {
	search: string;
	setSearch: Dispatch<SetStateAction<string>>;
}

function EncounterSearchHeader({ search, setSearch }: EncounterSearchHeaderProps) {
	const navigate = useNavigate();

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
				onClick={() => navigate("/statblocks/create")}
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
	const [loading, setLoading] = useState<boolean>(true);

	useEffect(() => {
		setLoading(false);	
	});

	return (
		<>
			<EncounterSearchHeader search={search} setSearch={setSearch} />
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
						.map(encounter => <EncounterCard encounter={encounter} />)
					}
				</Box>
			)}	
		</>
	)
}

export default EncounterSearch;