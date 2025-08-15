import { Add, Search } from "@mui/icons-material";
import { Box, Button, CircularProgress, TextField, Typography } from "@mui/material";
import { invoke } from "@tauri-apps/api/core";
import { Dispatch, SetStateAction, useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import StatBlockCard from "../components/StatblockCard";
import { useAuth } from "../context/AuthContext";
import { StatBlock } from "../types/statBlock";

interface StatBlockHeaderProps {
	search: string;
	setSearch: Dispatch<SetStateAction<string>>;
}

function StatBlockHeader({ search, setSearch }: StatBlockHeaderProps) {
	const navigate = useNavigate();

	return (
		<Box sx={{
			borderBottom: '1px solid blue',
			display: 'flex',
			flexDirection: 'row',
			alignItems: 'center',
			justifyContent: 'space-between',
			gap: '1rem',
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
				onClick={() => navigate("/create_statblock")}
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

interface FetchStatBlockResponse {
	statblocks: StatBlock[];
	status: number;
	message: string; 
}

function StatBlockSearch() {
	const [search, setSearch] = useState<string>("");
	const [statBlocks, setStatBlocks] = useState<StatBlock[]>([]);
	const [loading, setLoading] = useState<boolean>(true);

	const { getAccessToken } = useAuth();
	const navigate = useNavigate();

	useEffect(() => {
		const fetchStatBlocks = async () => {
			const accessToken = await getAccessToken();
			const response = await invoke<FetchStatBlockResponse>("fetch_statblocks_with_joins", { accessToken });

			setStatBlocks(response.statblocks);
			setLoading(false);
		};

		fetchStatBlocks();
	}, []);

	const handleDelete = async (statBlock: StatBlock) => {
		const accessToken = await getAccessToken();

		const res = await invoke<string>("delete_statblock", { statblock: statBlock, accessToken: accessToken });

		setStatBlocks(prev => prev.filter(sb => sb.id !== statBlock.id));
		console.log(res);
	}

	return (
		<>
			<StatBlockHeader search={search} setSearch={setSearch} />
			{ loading && (
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
					{statBlocks
						.filter(statBlock => statBlock.name.includes(search))
						.map(statBlock => <StatBlockCard
							key={statBlock.id}
							statBlock={statBlock}
							handleEdit={() => navigate("/create_statblock", {
								state: { statBlock: statBlock }
							})}
							handleDelete={handleDelete}
							informative
						/>)
					}
				</Box>
			)}	
		</>
	)
}

export default StatBlockSearch;