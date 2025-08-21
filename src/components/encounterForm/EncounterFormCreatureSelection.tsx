import { ArrowBack, Search } from "@mui/icons-material";
import { Box, Button, CircularProgress, Collapse, List, ListItem, TextField, Typography, useTheme } from "@mui/material";
import { Dispatch, SetStateAction, useState } from "react";
import { StatBlock } from "../../types/statBlock";

interface EncounterFormCreatureSelectionProps {
	open: boolean;
	setOpen: Dispatch<SetStateAction<boolean>>;
	statBlocks: StatBlock[];
	handleAddCreature: (statBlock: StatBlock) => void;
}

function EncounterFormCreatureSelection({
	open,
	setOpen,
	statBlocks,
	handleAddCreature
}: EncounterFormCreatureSelectionProps) {
	const [search, setSearch] = useState<string>("");
	
	const theme = useTheme();

	return (
		<Collapse
			in={open}
			sx={{
				display: 'flex',
				flexDirection: 'column',
				alignItems: 'center',
			}}
		>
			<Box sx={{
				display: 'flex',
				flexDirection: 'column',
				alignItems: 'center',
				margin: '1rem 0',
				gap: '1rem'
			}}>
				<Box sx={{
					display: 'flex',
					flexDirection: 'row',
					alignItems: 'center',
					justifyContent: 'center',
					width: '100%',
					gap: '1rem'
				}}>
					<TextField
						id="statblock-search"
						label="Search"
						type="search"
						value={search}
						onChange={(e) => setSearch(e.target.value)}
						slotProps={{
							input: {
								startAdornment: <Search sx={{ marginRight: '0.5rem' }}/>
							}
						}}
					/>
					<Button
						variant="outlined"
						endIcon={<ArrowBack />}
						onClick={() => setOpen(false)}
					>
						Cancel
					</Button>
				</Box>
				{!statBlocks.length && <CircularProgress />}
				<List sx={{
					display: 'flex',
					flexDirection: 'column',
					alignItems: 'center',
					width: '100%',
					maxHeight: '150px',
					overflowY: 'auto',
				}}>
					{statBlocks
						.filter(statBlock => statBlock.name.toLowerCase().includes(search.toLowerCase()))
						.map(statBlock => (
						<ListItem key={statBlock.name}>
							<Button
								sx={{
									display: 'grid',
									justifyContent: 'space-between',
									gridTemplateColumns: 'repeat(4, 1fr)',
									width: '100%',
									padding: '0 1rem',
									minWidth: 0,
									borderBottom: `1px solid ${theme.palette.primary.main}`,
									borderTop: `1px solid ${theme.palette.primary.main}`,
									boxShadow: 'none',
									textTransform: 'none',
									'&:hover': {
										backgroundColor: 'rgba(0, 0, 0, 0.04)',
									},
									color: 'inherit',
									backgroundColor: 'transparent',
									'&:focus': {
										outline: 'none',
										backgroundColor: 'rgba(0, 0, 0, 0.08)'
									}
								}}
								onClick={() => {
									setOpen(false);
									handleAddCreature(statBlock);
								}}
							>
								<Typography
									variant="body1"
									textAlign="left"
								>
									{statBlock.name}
								</Typography>
								<Typography variant="body1" textAlign="center">HP {statBlock.hp}</Typography>
								<Typography variant="body1" textAlign="center">AC {statBlock.ac}</Typography>
								<Typography variant="body1" textAlign="center">CR {statBlock.cr}</Typography>
							</Button>
						</ListItem>
					))}
				</List>
			</Box>
		</Collapse>
	)
}

export default EncounterFormCreatureSelection;