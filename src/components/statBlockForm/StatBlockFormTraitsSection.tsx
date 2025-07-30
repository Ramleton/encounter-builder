import { Add } from "@mui/icons-material";
import { Box, Button, TextField, Typography } from "@mui/material";
import { Dispatch, SetStateAction, useState } from "react";
import { StatBlock, Trait } from "../../types/statBlock";

interface StatBlockFormTraitsSectionProps {
	statBlock: StatBlock;
	setStatBlock: Dispatch<SetStateAction<StatBlock>>;
}

function StatBlockFormTraitsSection({ statBlock, setStatBlock }: StatBlockFormTraitsSectionProps) {
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
					border: '1px solid black',
					paddingLeft: '1rem',
					paddingRight: '1rem',
					paddingBottom: '1.5rem',
					borderRadius: '2%',
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
					<Button
						variant="contained"
						onClick={handleCreatingTrait}
					>
						Create
					</Button>
				</Box>
			)}
			{statBlock.traits.map((trait, idx) => 
				
				(
					<Box
						key={idx}
						sx={{
							display: 'flex',
							flexDirection: 'column'
						}}
					>
						<Box sx={{
							display: 'flex',
							flexDirection: 'row',
							alignItems: 'center',
							justifyContent: 'left',
							gap: '0.5rem'
						}}>
							<Typography variant="body1">Name:</Typography>
							<Typography variant="body1">{trait.name}</Typography>
						</Box>
						<Box sx={{
							display: 'flex',
							flexDirection: 'row',
							alignItems: 'center',
							justifyContent: 'left',
							gap: '0.5rem'
						}}>
							<Typography variant="body1">Description:</Typography>
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