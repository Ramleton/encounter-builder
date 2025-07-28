import { Add, Search } from "@mui/icons-material";
import { Box, Button, TextField, Typography } from "@mui/material";
import { useState } from "react";
import StatBlockCard from "../components/StatblockCard";
import { useStatBlocks } from "../context/StatBlockContext";

interface StatBlockHeaderProps {
	search: string;
	setSearch: (s: string) => void;
}

function StatBlockHeader({ search, setSearch }: StatBlockHeaderProps) {
	return (
		<Box sx={{
			borderBottom: '1px solid blue',
			display: 'flex',
			flexDirection: 'row',
			alignItems: 'center',
			justifyContent: 'space-between',
			width: '100%',
		}}>
			<Typography variant="h3">StatBlocks</Typography>
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

function StatBlockSearch() {
	const [search, setSearch] = useState<string>("");

	const { statBlocks, refreshStatBlocks } = useStatBlocks();

	return (
		<>
			<StatBlockHeader search={search} setSearch={setSearch} />
			<Box sx={{
				display: 'grid',
				gridTemplateColumns: 'repeat(4, 1fr)',
				width: '100%'
			}}>
				{statBlocks
					.filter(statBlock => statBlock.name.includes(search))
					.map(statBlock => <StatBlockCard statblock={statBlock} />)
				}
			</Box>
		</>
	)
}

export default StatBlockSearch;