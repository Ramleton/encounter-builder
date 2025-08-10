import { Box, FormControl, InputLabel, MenuItem, Select, TextField } from "@mui/material";
import { useStatBlock } from "../../context/StatBlockContext";
import { Alignment, CR_VALUES, Size } from "../../types/statBlock";
import { updateField, updateIntegerField } from "../../utils/statBlockUtils";

function UpperStatBlockForm() {
	const { statBlock, setStatBlock } = useStatBlock();

	return (
		<>
			<Box sx={{
					display: 'flex',
					flexDirection: 'row',
					width: '100%',
					justifyContent: 'center',
					alignItems: 'center',
					gap: '2rem',
					padding: '1rem 0'
				}}
			>
				<TextField
					required
					id="standard-required"
					label="Name"
					type="text"
					value={statBlock.name}
					onChange={(e) => updateField("name", e.target.value, setStatBlock)}
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
						onChange={(e) => updateField("size", e.target.value, setStatBlock)}
					>
						{
							Object.values(Size).map(size => <MenuItem key={size} value={size}>{size}</MenuItem>)
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
					onChange={(e) => updateField("type_", e.target.value, setStatBlock)}
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
						onChange={(e) => updateField("alignment", e.target.value, setStatBlock)}
					>
						{
							Object.values(Alignment).map(alignment => <MenuItem key={alignment} value={alignment}>
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
						onChange={(e) => updateField("cr", e.target.value, setStatBlock)}
					>
						{
							CR_VALUES.map(cr => <MenuItem key={cr} value={cr}>
								{cr.toString()}
							</MenuItem>)
						}
					</Select>
				</FormControl>
				<FormControl fullWidth sx={{ flex: 1 }}>
					<InputLabel id="initiative-select-label" sx={{ color: 'secondary.main' }}>Initiative</InputLabel>
					<Select
						required
						labelId="initiative-select-label"
						id="initiative-select"
						value={statBlock.initiative}
						label="Initiative"
						onChange={(e) => updateField("initiative", e.target.value, setStatBlock)}
					>
						<MenuItem value="none">
							<Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
								<Box
									sx={{
										width: 8,
										height: 8,
										borderRadius: '50%',
										backgroundColor: 'grey.400',
									}}
								/>
								None
							</Box>
						</MenuItem>
						<MenuItem value="proficient">
							<Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
								<Box
									sx={{
										width: 8,
										height: 8,
										borderRadius: '50%',
										backgroundColor: 'success.main',
									}}
								/>
								Proficient
							</Box>
						</MenuItem>
						<MenuItem value="expertise">
							<Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
								<Box
									sx={{
										width: 8,
										height: 8,
										borderRadius: '50%',
										backgroundColor: 'warning.main',
									}}
								/>
								Expertise
							</Box>
						</MenuItem>
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
					onChange={(e) => updateIntegerField("hp", e.target.value, setStatBlock)}
					variant="standard"
					sx={{ flex: 1 }}
				/>
				<TextField
					required
					id="standard-required"
					label="Hit Dice"
					type="text"
					value={statBlock.hit_dice}
					onChange={(e) => updateField("hit_dice", e.target.value, setStatBlock)}
					variant="standard"
					sx={{ flex: 1 }}
				/>
				<TextField
					required
					id="standard-required"
					label="Armor Class"
					type="text"
					value={typeof statBlock.ac === 'number' ? statBlock.ac : ""}
					onChange={(e) => updateIntegerField("ac", e.target.value, setStatBlock)}
					variant="standard"
					sx={{ flex: 1 }}
				/>
				<TextField
					required
					id="standard-required"
					label="Speed"
					type="text"
					value={statBlock.speed}
					onChange={(e) => updateField("speed", e.target.value, setStatBlock)}
					variant="standard"
					sx={{ flex: 2 }}
				/>
			</Box>
		</>
	)
}

export default UpperStatBlockForm;