import { Save } from "@mui/icons-material";
import { Box, Button, FormControl, InputLabel, MenuItem, Select, TextField } from "@mui/material";
import { invoke } from "@tauri-apps/api/core";
import { useAuth } from "../../context/AuthContext";
import { useCreateStatBlock } from "../../context/CreateStatBlockContext";
import { Alignment, CR_VALUES, Size } from "../../types/statBlock";
import { updateField, updateIntegerField } from "../../utils/statBlockUtils";

function UpperStatBlockForm() {
	const { statBlock, setStatBlock, errors, setErrors } = useCreateStatBlock();
	const { user, getAccessToken } = useAuth();

	const handleSave = async () => {
		if (!user) return;
		// Input Validation
		const newErrors: Record<string, string> = {};

		if (!statBlock.name) newErrors["name"] = "Name field must be filled out.";
		if (!statBlock.type_) newErrors["type"] = "Type field must be filled out.";
		// TODO: Properly validate formatting of hit_dice field
		if (!statBlock.hit_dice) newErrors["hit_dice"] = "Hit Dice field must be filled out.";
		if (!statBlock.speed) newErrors["speed"] = "Speed field must be filled out.";
		if (!statBlock.hp) newErrors["hp"] = "HP cannot be 0.";
		
		setErrors(newErrors);

		if (Object.keys(newErrors).length) return;

		// Handle save
		console.log('Valid statblock');

		const updatedStatBlock = {
			...statBlock,
			last_modified: new Date().toISOString(),
			user_id: user.uuid
		};

		const accessToken = await getAccessToken();

		setStatBlock(updatedStatBlock);
		await invoke<string>("save_statblock", { stat_block: updatedStatBlock, access_token: accessToken });
	};

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
					error={!!errors["name"]}
					helperText={errors["name"] || ""}
					onChange={(e) => updateField("name", e.target.value, setStatBlock)}
					sx={{ flex: 2 }}
					variant="standard"
				/>
				<TextField
					required
					id="standard-required"
					label="Type"
					type="text"
					error={!!errors["type"]}
					helperText={errors["type"] || ""}
					value={statBlock.type_}
					onChange={(e) => updateField("type_", e.target.value, setStatBlock)}
					variant="standard"
					sx={{ flex: 1 }}
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
				<Button
					variant="contained"
					endIcon={<Save />}
					onClick={handleSave}
				>
					Save
				</Button>
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
					id="standard"
					label="Subtype"
					type="text"
					value={statBlock.subtype}
					onChange={(e) => updateField("subtype", e.target.value, setStatBlock)}
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
					error={!!errors["hp"]}
					helperText={errors["hp"] || ""}
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
					error={!!errors["hit_dice"]}
					helperText={errors["hit_dice"] || ""}
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
					error={!!errors["speed"]}
					helperText={errors["speed"] || ""}
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