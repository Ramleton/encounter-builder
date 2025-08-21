import { Add, Delete, Favorite } from "@mui/icons-material";
import { Box, Button, List, ListItem, Typography, useTheme } from "@mui/material";
import { Dispatch, ReactNode, SetStateAction } from "react";
import { PlayableStatBlock } from "../../types/encounter";
import { StatBlock } from "../../types/statBlock";
import EncounterFormCreatureSelection from "./EncounterFormCreatureForm";

interface EncounterFormCreatureSectionProps {
	playableStatBlocks: PlayableStatBlock[];
	setPlayableStatBlocks: Dispatch<SetStateAction<PlayableStatBlock[]>>;
	openCreatureSelection: boolean;
	setOpenCreatureSelection: Dispatch<SetStateAction<boolean>>;
	setOpenPlayerCreation: Dispatch<SetStateAction<boolean>>;
	statBlocks: StatBlock[];
	getMatchingStatBlocks: () => { playableStatBlock: PlayableStatBlock, statBlock: StatBlock }[];
};

function EncounterFormCreatureSection({
	playableStatBlocks,
	setPlayableStatBlocks,
	openCreatureSelection,
	setOpenCreatureSelection,
	setOpenPlayerCreation,
	statBlocks,
	getMatchingStatBlocks
}: EncounterFormCreatureSectionProps) {
	const theme = useTheme();

	const handleAddPlayableStatBlock = (statBlock: StatBlock) => {
		if (!statBlock.id) return;
		
		const newPlayableStatBlock: PlayableStatBlock = {
			current_hp: statBlock.hp,
			temporary_hp: 0,
			statblock_id: statBlock.id
		};

		setPlayableStatBlocks(prev => [...prev, newPlayableStatBlock]);
	}

	const listEncounterCreatures = (): ReactNode => {
		const matchingStatBlocks = getMatchingStatBlocks();
		return (
			<List sx={{
				maxHeight: '150px',
				overflowY: 'auto',
				border: `1px solid ${theme.palette.secondary.main}`,
				mt: '1rem'
			}}>	
				{matchingStatBlocks.map((matchingStatBlock, i) => (
					<ListItem
						key={i} 
						sx={{
							display: 'flex',
							flexDirection: 'row',
							padding: '0.25rem 1rem',
						}}
					>
						<Typography variant="body1" textAlign="center" sx={{ flex: 1 }}>
							{matchingStatBlock.statBlock.name}
						</Typography>
						<Box sx={{ display: 'flex', flexDirection: 'row', flex: 1, gap: '0.5rem' }}>
							<Favorite sx={{ color: 'red' }} />
							<Typography variant="body1" textAlign="center">
								{matchingStatBlock.playableStatBlock.current_hp}/{matchingStatBlock.statBlock.hp} HP
							</Typography>
						</Box>
						<Typography variant="body1" textAlign="center" sx={{ flex: 1 }}>
							{matchingStatBlock.statBlock.cr} CR
						</Typography>
						<Button
							sx={{
								backgroundColor: 'red'
							}}
							variant="contained"
							endIcon={<Delete />}
							onClick={() => setPlayableStatBlocks(prev => prev.filter((_, idx) => idx !== i))}
						>Remove</Button>
					</ListItem>
				))}
			</List>
		)
	};

	return (
		<>
			<Box sx={{
					display: 'flex',
					flexDirection: 'row',
					alignItems: 'center',
					justifyContent: 'space-between',
					gap: '1rem',
					padding: '0 1rem'
				}}>
					<Typography variant="h6">Creatures</Typography>
					<Button
						variant="contained"
						endIcon={<Add />}
						disabled={openCreatureSelection}
						onClick={() => {
							setOpenCreatureSelection(true);
							setOpenPlayerCreation(false);
						}}
					>
						Add
					</Button>
				</Box>
				<EncounterFormCreatureSelection
					open={openCreatureSelection}
					setOpen={setOpenCreatureSelection}
					statBlocks={statBlocks}
					handleAddCreature={handleAddPlayableStatBlock}
				/>
				{!!playableStatBlocks.length && listEncounterCreatures()}
		</>
	)
}

export default EncounterFormCreatureSection;