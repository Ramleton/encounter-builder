import { Add } from "@mui/icons-material";
import { Box, Button, ButtonGroup, TextField, Typography, useTheme } from "@mui/material";
import { Dispatch, SetStateAction, useState } from "react";
import { StatBlock, Trait } from "../../types/statBlock";
import StatBlockFormActionCard from "./StatBlockFormActionCard";

interface StatBlockFormTraitsSectionProps {
	statBlock: StatBlock;
	setStatBlock: Dispatch<SetStateAction<StatBlock>>;
}

function StatBlockFormTraitsSection({ statBlock, setStatBlock }: StatBlockFormTraitsSectionProps) {
	const theme = useTheme();
	const [addingTrait, setAddingTrait] = useState<Trait | null>(null);
	const [editIndex, setEditIndex] = useState<number | null>(null);

	const handleUpdateAddingTrait = (key: keyof Trait, value: string) => {
		setAddingTrait(prev => prev ? { ...prev, [key]: value } : null)
	}

	const handleCreatingTrait = () => {
		if (addingTrait) {
			setStatBlock(prev => ({
				...prev,
				"traits": [ ...prev.traits, addingTrait ]
			}));
		}
		setAddingTrait(null);
	}

	const handleEditTrait = () => {
		if (editIndex === null || !addingTrait) return;

		setStatBlock(prev => {
			const newTraits = [...prev.traits];
			newTraits[editIndex] = addingTrait;
			return {
				...prev,
				"traits": newTraits
			};
		});
		setAddingTrait(null);
		setEditIndex(null);
	}

	const handleEditingTrait = (idx: number) => {
		setEditIndex(idx);
		setAddingTrait(statBlock.traits[idx])
	}

	const handleRemoveTrait = (idx: number) => {
		setStatBlock(prev => ({
			...prev,
			"traits": prev.traits.filter((_, index) => index !== idx)
		}));
	}

	const handleCancel = () => {
		setAddingTrait(null);
		setEditIndex(null);
	}

	return (
		<Box
			sx={{
				display: 'flex',
				flexDirection: 'column',
				padding: '1rem',
				marginRight: '0.5rem',
				marginTop: '1rem',
				marginBottom: '1rem',
				overflowY: 'auto',
				gap: '1rem'
			}}
		>
			<Box sx={{
				display: 'flex',
				flexDirection: 'row',
				alignItems: 'center',
				justifyContent: 'space-between',
				padding: '0.5rem 0.25rem'
			}}>
				<Typography variant="h6">Traits</Typography>
				<Button
					variant="contained"
					endIcon={<Add />}
					onClick={() => setAddingTrait({ name: "", description: "" })}
				>
					Add
				</Button>
			</Box>
			{addingTrait && (
				<Box sx={{
					display: 'flex',
					flexDirection: 'column',
					border: '1px solid',
					borderColor: theme.palette.secondary.main,
					paddingLeft: '1rem',
					paddingRight: '1rem',
					paddingBottom: '1.5rem',
					marginBottom: '0.5rem',
					borderRadius: '0.5rem',
					gap: '1rem'
				}}>
					<TextField
						required
						id="standard-required"
						label="Trait Name"
						type="text"
						value={addingTrait.name}
						onChange={(e) => handleUpdateAddingTrait("name", e.target.value)}
						sx={{ flex: 2 }}
						variant="standard"
					/>
					<TextField
						required
						id="standard-required"
						label="Trait Description"
						type="text"
						multiline
						value={addingTrait.description}
						onChange={(e) => handleUpdateAddingTrait("description", e.target.value)}
						sx={{ flex: 2 }}
						variant="standard"
					/>
					<Box sx={{
						display: 'flex',
						flexDirection: 'row',
						alignItems: 'center',
						justifyContent: 'center',
					}}>
						<ButtonGroup variant="contained">
							<Button
								variant="contained"
								onClick={editIndex !== null
									? handleEditTrait
									: handleCreatingTrait
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
			{statBlock.traits.map((trait, idx) => <StatBlockFormActionCard
				key={idx}
				value={trait}
				idx={idx}
				handleEdit={handleEditTrait}
				handleRemove={handleRemoveTrait}
			/>)}
		</Box>
	)
}

export default StatBlockFormTraitsSection;