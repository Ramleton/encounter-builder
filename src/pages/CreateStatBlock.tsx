import { Box, Divider, FormControl, InputLabel, MenuItem, Select, TextField, Typography } from "@mui/material";
import { Dispatch, SetStateAction, useState } from "react";
import { Alignment, CR_VALUES, Score, Size, StatBlock, Stats } from "../types/statBlock";
import { getModifier } from "../utils/abilityUtils";
import { generateEmptyStatBlock } from "../utils/statBlockUtils";

interface StatBlockFormProps {
	statBlock: StatBlock;
	setStatBlock: Dispatch<SetStateAction<StatBlock>>;
}

function StatBlockForm({ statBlock, setStatBlock }: StatBlockFormProps) {
	const updateField = <K extends keyof StatBlock>(key: K, value: StatBlock[K]) => {
		setStatBlock(prev => ({...prev, [key]: value }));
	}

	const updateStatField = <K extends keyof Stats>(key: K, value: Stats[K]) => {
		setStatBlock(prev => ({...prev, "stats": {...prev.stats, [key]: value }}));
	}

	const updateIntegerField = (key: keyof StatBlock, s: string): void => {
		const parsed = Number.parseInt(s, 10);
		updateField(key, isNaN(parsed) ? 0 : parsed);
	}

	return (
		<Box sx={{
			flex: 1,
			display: 'flex',
			flexDirection: 'column',
			border: '1px solid white',
			padding: '1rem 2rem'
		}}>
			<Box sx={{
				display: 'flex',
				flexDirection: 'row',
				width: '100%',
				justifyContent: 'center',
				alignItems: 'center',
				gap: '2rem',
				padding: '1rem 0'
			}}>
				<TextField
					required
					id="standard-required"
					label="Name"
					type="text"
					value={statBlock.name}
					onChange={(e) => updateField("name", e.target.value)}
					sx={{ flex: 2 }}
					variant="standard"
				/>
				<FormControl variant="standard" sx={{ flex: 1 }}>
					<InputLabel id="size-select-label" sx={{ color: 'secondary.main' }}>Size</InputLabel>
					<Select
						required
						labelId="size-select-label"
						id="size-select"
						value={statBlock.size}
						onChange={(e) => updateField("size", e.target.value)}
					>
						{
							Object.values(Size).map(size => <MenuItem value={size}>{size}</MenuItem>)
						}
					</Select>
				</FormControl>
				
			</Box>
			<Box sx={{
				display: 'flex',
				flexDirection: 'row',
				width: '100%',
				justifyContent: 'center',
				alignItems: 'center',
				gap: '2rem',
				padding: '1rem 0'
			}}>
				<TextField
					required
					id="standard-required"
					label="Type"
					type="text"
					value={statBlock.type_}
					onChange={(e) => updateField("type_", e.target.value)}
					variant="standard"
					sx={{ flex: 1 }}
				/>
				<FormControl variant="standard" sx={{ flex: 1 }}>
					<InputLabel id="alignment-select-label" sx={{ color: 'secondary.main' }}>Alignment</InputLabel>
					<Select
						required
						labelId="alignment-select-label"
						id="alignment-select"
						value={statBlock.alignment}
						onChange={(e) => updateField("alignment", e.target.value)}
					>
						{
							Object.values(Alignment).map(alignment => <MenuItem value={alignment}>
								{alignment.toString().replace(/([a-z])([A-Z])/g, `$1 $2`)}
							</MenuItem>)
						}
					</Select>
				</FormControl>
				<FormControl variant="standard" sx={{ flex: 1 }}>
					<InputLabel id="cr-select-label" sx={{ color: 'secondary.main' }}>CR</InputLabel>
					<Select
						required
						labelId="cr-select-label"
						id="cr-select"
						value={statBlock.cr}
						onChange={(e) => updateField("cr", e.target.value)}
					>
						{
							CR_VALUES.map(cr => <MenuItem value={cr}>
								{cr.toString()}
							</MenuItem>)
						}
					</Select>
				</FormControl>
			</Box>
			<Box sx={{
				display: 'flex',
				flexDirection: 'row',
				width: '100%',
				justifyContent: 'center',
				alignItems: 'center',
				gap: '2rem'
			}}>
				<TextField
					required
					id="standard-required"
					label="Hit Points"
					type="text"
					value={typeof statBlock.hp === 'number' ? statBlock.hp : ""}
					onChange={(e) => updateIntegerField("hp", e.target.value)}
					variant="standard"
					sx={{ flex: 1 }}
				/>
				<TextField
					required
					id="standard-required"
					label="Armor Class"
					type="text"
					value={typeof statBlock.ac === 'number' ? statBlock.ac : ""}
					onChange={(e) => updateIntegerField("ac", e.target.value)}
					variant="standard"
					sx={{ flex: 1 }}
				/>
				<TextField
					required
					id="standard-required"
					label="Speed"
					type="text"
					value={statBlock.speed}
					onChange={(e) => updateField("speed", e.target.value)}
					variant="standard"
					sx={{ flex: 2 }}
				/>
			</Box>
			<Divider sx={{ mt: '1rem', mb: '1rem' }} />
			<Box sx={{
				display: 'grid',
				gridTemplateColumns: 'repeat(6, 1fr)',
				width: '100%',
				justifyContent: 'center',
				alignItems: 'center',
				gap: '2rem'
			}}>
				{
					Object.values(Score).map(score => {
						const key = score.toLowerCase() as keyof Stats;
						return (
							<Box sx={{
								display: 'flex',
								flexDirection: 'column',
								justifyContent: 'center',
								alignItems: 'center',
								border: "1px solid white",
								borderRadius: '5%'
							}}>
								<Typography variant="body1" textAlign="center">{score}</Typography>
								<TextField
									required
									id="standard-required"
									type="text"
									value={typeof statBlock.stats[key] === 'number' ? statBlock.stats[key] : 10}
									onChange={(e) => {
										const parsed = Number.parseInt(e.target.value, 10);
										updateStatField(key, isNaN(parsed) ? 0 : parsed);
									}}
									variant="standard"
									sx={{
										'& input': {
											textAlign: 'center'
										}
									}}
								/>
								<Typography>{getModifier(statBlock.stats[key])}</Typography>
							</Box>
						)
					})
				}
			</Box>
			<Divider sx={{ mt: '1rem', mb: '1rem' }} />
		</Box>
	)
}

interface StatBlockPreviewProps {
	statBlock: StatBlock;
}

function StatBlockPreview({ statBlock }: StatBlockPreviewProps) {
	return (
		<Box
			sx={{
				flex: 1
			}}
		>
		</Box>
	)
}

function CreateStatBlock() {
	const [statBlock, setStatBlock] = useState<StatBlock>(generateEmptyStatBlock());	

	return (
		<Box sx={{
			display: 'flex',
			flexDirection: 'row',
			width: '100%',
			minHeight: '100%',
			gap: '4rem'
		}}>
			<StatBlockForm statBlock={statBlock} setStatBlock={setStatBlock}/>
			<StatBlockPreview statBlock={statBlock} />
		</Box>
	)
}

export default CreateStatBlock;