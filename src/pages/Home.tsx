import { Box, Button, Divider, List, ListItem, Stack, Typography } from "@mui/material";
import { useNavigate } from "react-router-dom";
import EncounterCard from "../components/EncounterCard";
import StatBlockCard from "../components/StatblockCard";
import { useEncounters } from "../context/EncounterContext";
import { useStatBlocks } from "../context/StatBlockContext";

function Home() {
	const { encounters, refreshEncounters } = useEncounters();
	const { statBlocks, refreshStatBlocks } = useStatBlocks();
	const navigate = useNavigate();

	return (
		<Box
			sx={{
				display: "flex",
				flexDirection: "column",
				justifyContent: "center",
				alignItems: "center"
			}}
		>
			<Typography variant="h1" gutterBottom textAlign="center">
				Welcome to EncounterArchitect
			</Typography>

			<Typography variant="h5" gutterBottom>
				Create, manage, and run your D&D combat encounters in one place.
			</Typography>

			<Stack direction="row" spacing={2} sx={{ mt: 4 }}>
				<Button
					variant="contained"
					color="primary"
					onClick={() => navigate("/editor")}
				>
					New Encounter
				</Button>
				<Button
					variant="contained"
					color="primary"
					onClick={() => navigate("/")}
				>
					Load Encounter
				</Button>
			</Stack>
			<Divider />
			<Stack direction="column" spacing={2} sx={{ mt: 4 }}>
				<Button
					variant="contained"
					color="primary"
					onClick={() => navigate("/")}
				>
					Register
				</Button>
				<Button
					variant="contained"
					color="primary"
					onClick={() => navigate("/")}
				>
					Login
				</Button>
			</Stack>
			<Stack direction="row" spacing={5} sx={{ mt: 4 }}>
				<Box sx={{
					display: "flex",
					flexDirection: "column"
				}}>
					<Typography variant="h6" textAlign="center">Recent Encounters</Typography>
					<List>
						{encounters
							.sort((a, b) => {
								const dateA = new Date(a.last_modified);
								const dateB = new Date(b.last_modified);
								return dateA.getUTCSeconds() - dateB.getUTCSeconds();
							})
							.map(encounter => (
							<ListItem key={encounter.name}><EncounterCard encounter={encounter} /></ListItem>
						))}
					</List>
				</Box>
				<Box sx={{
					display: "flex",
					flexDirection: "column"
				}}>
					<Typography variant="h6" textAlign="center">Recent Statblocks</Typography>
					<List>
						{statBlocks
							.sort((a, b) => {
								const dateA = new Date(a.last_modified);
								const dateB = new Date(b.last_modified);
								return dateA.getUTCSeconds() - dateB.getUTCSeconds();
							})
							.map(statBlock => (
							<ListItem key={statBlock.name}><StatBlockCard statblock={statBlock} /></ListItem>
						))}
					</List>
				</Box>
			</Stack>
		</Box>
	)
}

export default Home;