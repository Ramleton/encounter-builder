import { Add } from "@mui/icons-material";
import { Box, Button, ButtonGroup, Divider, TextField, Typography, useTheme } from "@mui/material";
import { Dispatch, SetStateAction, useState } from "react";
import { Action, ACTION_KEY_LABELS, StatBlock, StatBlockActionKey } from "../../types/statBlock";
import StatBlockFormActionCard from "./StatBlockFormActionCard";

const handleUpdateAction = (
	key: keyof Action,
	value: Action[keyof Action],
	setEditing: Dispatch<SetStateAction<Action | null>>
) => {
	setEditing(prev => {
		if (!prev) return null;
		return { ...prev, [key]: value }
	});
};

interface StatBlockFormActionsSectionProps {
	statBlock: StatBlock;
	setStatBlock: Dispatch<SetStateAction<StatBlock>>;
}

interface StatBlockFormActionSectionProps {
	statblockKey: StatBlockActionKey;
	statBlock: StatBlock;
	setStatBlock: Dispatch<SetStateAction<StatBlock>>;
}

function StatBlockFormActionSection({
	statblockKey,
	statBlock,
	setStatBlock
}: StatBlockFormActionSectionProps) {
	const [editing, setEditing] = useState<Action | null>(null);
	const [editIndex, setEditIndex] = useState<number | null>(null);
	const label = ACTION_KEY_LABELS[statblockKey];
	
	const theme = useTheme();

	const handleCreatingAction = () => {
		if (!editing) return;

		setStatBlock(prev => ({
			...prev,
			[statblockKey]: [...prev[statblockKey], editing]
		}));
		setEditing(null);
	};

	const handleEditingAction = () => {
		if (editIndex === null || !editing) return;

		setStatBlock(prev => {
			const newActions = [...prev[statblockKey]];
			newActions[editIndex] = editing;
			return {
				...prev,
				[statblockKey]: newActions
			};
		});
	};

	const handleEditAction = (idx: number) => {
		setEditIndex(idx);
		setEditing(statBlock[statblockKey][idx]);
	}

	const handleRemoveAction = (idx: number) => {
		setStatBlock(prev => ({
			...prev,
			[statblockKey]: prev[statblockKey].filter((_, index) => index !== idx)
		}));
	}

	const handleCancel = () => {
		setEditing(null);
		setEditIndex(null);
	}

	return (
		<Box sx={{
			display: 'flex',
			flexDirection: 'column',
			gap: '1rem'
		}}>
			<Box sx={{
				display: 'flex',
				flexDirection: 'row',
				justifyContent: 'space-between'
			}}>
				<Typography variant="h6">{`${label}s`}</Typography>
				<Button
					variant="contained"
					endIcon={<Add />}
					onClick={() => setEditing({ name: "", description: "" })}
				>
					Add
				</Button>
			</Box>
			{statblockKey === "legendary_actions" &&
				<TextField
					multiline
					variant="outlined"
					label={`${label} Description`}
				/>
			}
			{editing && (
				<Box sx={{
					display: 'flex',
					flexDirection: 'column',
					border: '1px solid',
					borderColor: theme.palette.secondary.main,
					p: '1rem'
				}}>
					<TextField
						required
						id="standard-required"
						label={`${label} Name`}
						type="text"
						value={editing.name}
						onChange={(e) => handleUpdateAction("name", e.target.value, setEditing)}
						sx={{ flex: 2 }}
						variant="standard"
					/>
					<TextField
						required
						id="standard-required"
						label={`${label} Description`}
						type="text"
						multiline
						value={editing.description}
						onChange={(e) => handleUpdateAction("description", e.target.value, setEditing)}
						sx={{ flex: 2 }}
						variant="standard"
					/>
					<Box sx={{
						display: 'flex',
						flexDirection: 'row',
						alignItems: 'center',
						justifyContent: 'center',
						pt: '1rem'
					}}>
						<ButtonGroup variant="contained">
							<Button
								variant="contained"
								onClick={editIndex !== null
									? handleEditingAction
									: handleCreatingAction
								}
							>
								{editIndex !== null ? "Edit" : "Create"}
							</Button>
							<Button
								variant="contained"
								onClick={handleCancel}
							>
								Cancel
							</Button>
						</ButtonGroup>
					</Box>
				</Box>
			)}
			{statBlock[statblockKey].map((action, idx) => <StatBlockFormActionCard
				value={action}
				idx={idx}
				handleEdit={handleEditAction}
				handleRemove={handleRemoveAction}
			/>)}
		</Box>
	)
}

function StatBlockFormActionsSection(
	{ statBlock, setStatBlock }: StatBlockFormActionsSectionProps
) {
	return (
		<Box sx={{
			display: 'flex',
			flexDirection: 'column',
			gap: '1rem',
			pt: '1rem',
		}}>
			<StatBlockFormActionSection
				statblockKey="legendary_actions"
				statBlock={statBlock}
				setStatBlock={setStatBlock}
			/>
			<Divider />
			<StatBlockFormActionSection
				statblockKey="actions"
				statBlock={statBlock}
				setStatBlock={setStatBlock}
			/>
			<Divider />
			<StatBlockFormActionSection
				statblockKey="bonus_actions"
				statBlock={statBlock}
				setStatBlock={setStatBlock}
			/>
			<Divider />
			<StatBlockFormActionSection
				statblockKey="reactions"
				statBlock={statBlock}
				setStatBlock={setStatBlock}
			/>
		</Box>
	)
}

export default StatBlockFormActionsSection;