import { Add } from "@mui/icons-material";
import { Box, Button, ButtonGroup, TextField, Typography, useTheme } from "@mui/material";
import { Dispatch, SetStateAction, useState } from "react";
import { StatBlock, Trait } from "../../types/statBlock";

interface StatBlockFormTraitsSectionProps {
	statBlock: StatBlock;
	setStatBlock: Dispatch<SetStateAction<StatBlock>>;
}

function StatBlockFormTraitsSection({ statBlock, setStatBlock }: StatBlockFormTraitsSectionProps) {
	const theme = useTheme();
	const [addingTrait, setAddingTrait] = useState<Trait | null>(null);

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

	return (
		<Box
			sx={{
				display: 'flex',
				flexDirection: 'column',
				paddingLeft: '1rem',
				paddingTop: '1rem'
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
								onClick={handleCreatingTrait}
							>
								Create
							</Button>
							<Button
								variant="contained"
								onClick={() => setAddingTrait(null)}
							>
								Cancel
							</Button>
						</ButtonGroup>
					</Box>
				</Box>
			)}
			{statBlock.traits.map((trait, idx) => 
				
				(
					<Box
						key={idx}
						sx={{
							display: 'flex',
							flexDirection: 'column',
							border: '1px solid',
							borderColor: theme.palette.secondary.main,
							borderRadius: '0.5rem',
							padding: '1rem'
						}}
					>
						<Box sx={{
							display: 'flex',
							flexDirection: 'row',
							alignItems: 'center',
							justifyContent: 'left',
							gap: '0.5rem'
						}}>
							<Typography variant="body1" fontStyle="oblique">Name:</Typography>
							<Typography variant="body1">{trait.name}</Typography>
						</Box>
						<Box sx={{
							display: 'flex',
							flexDirection: 'row',
							alignItems: 'center',
							justifyContent: 'left',
							gap: '0.5rem'
						}}>
							<Typography variant="body1" fontStyle="oblique">Description:</Typography>
							<Typography variant="body1">{trait.description}</Typography>
						</Box>
					</Box>
				)
			)

			}
		</Box>
	)
}

export default StatBlockFormTraitsSection;