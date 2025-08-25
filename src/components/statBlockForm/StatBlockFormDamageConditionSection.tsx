import { Box, FormControl, InputLabel, MenuItem, Select } from "@mui/material";
import { useCreateStatBlock } from "../../context/CreateStatBlockContext";
import { ConditionType, DamageType } from "../../types/statBlock";
import { updateField } from "../../utils/statBlockUtils";

function StatBlockFormDamageConditionSection() {
	const { statBlock, setStatBlock } = useCreateStatBlock();

	return (
		<Box
			sx={{
				display: 'flex',
				flexDirection: 'column',
				paddingLeft: '1rem',
				paddingBottom: '1rem',
				gap: '0.5rem'
			}}
		>
			<FormControl variant="standard" sx={{ flex: 1 }}>
				<InputLabel id="resistance-select-label" sx={{ color: 'secondary.main' }}>Damage Resistances</InputLabel>
				<Select
					required
					multiple
					labelId="resistance-select-label"
					id="resistance-select"
					value={statBlock.damage_resistances.sort()}
					onChange={(e) => updateField("damage_resistances", e.target.value as DamageType[], setStatBlock)}
					sx={{
						"& .MuiSelect-select": {
							display: 'block',
							overflow: 'hidden',
							textOverflow: 'ellipsis',
							whiteSpace: 'nowrap',
							maxWidth: '20rem'
						}
					}}
				>
					{
						Object.values(DamageType).map(dmgType => <MenuItem key={dmgType} value={dmgType}>{dmgType}</MenuItem>)
					}
				</Select>
			</FormControl>
			<FormControl variant="standard" sx={{ flex: 1 }}>
				<InputLabel id="immunity-select-label" sx={{ color: 'secondary.main' }}>Damage Immunities</InputLabel>
				<Select
					required
					multiple
					labelId="immunity-select-label"
					id="immunity-select"
					value={statBlock.damage_immunities.sort()}
					onChange={(e) => updateField("damage_immunities", e.target.value as DamageType[], setStatBlock)}
					sx={{
						"& .MuiSelect-select": {
							display: 'block',
							overflow: 'hidden',
							textOverflow: 'ellipsis',
							whiteSpace: 'nowrap',
							maxWidth: '20rem'
						}
					}}
				>
					{
						Object.values(DamageType).map(dmgType => <MenuItem key={dmgType} value={dmgType}>{dmgType}</MenuItem>)
					}
				</Select>
			</FormControl>
			<FormControl variant="standard" sx={{ flex: 1 }}>
				<InputLabel id="vulnerabilities-select-label" sx={{ color: 'secondary.main' }}>Damage Vulnerabilities</InputLabel>
				<Select
					required
					multiple
					labelId="vulnerabilities-select-label"
					id="vulnerabilities-select"
					value={statBlock.damage_vulnerabilities.sort()}
					onChange={(e) => updateField("damage_vulnerabilities", e.target.value as DamageType[], setStatBlock)}
					sx={{
						"& .MuiSelect-select": {
							display: 'block',
							overflow: 'hidden',
							textOverflow: 'ellipsis',
							whiteSpace: 'nowrap',
							maxWidth: '20rem'
						}
					}}
				>
					{
						Object.values(DamageType).map(dmgType => <MenuItem key={dmgType} value={dmgType}>{dmgType}</MenuItem>)
					}
				</Select>
			</FormControl>
			<FormControl variant="standard" sx={{ flex: 1 }}>
				<InputLabel id="condition-select-label" sx={{ color: 'secondary.main' }}>Condition Immunities</InputLabel>
				<Select
					required
					multiple
					labelId="condition-select-label"
					id="condition-select"
					value={statBlock.condition_immunities.sort()}
					onChange={(e) => updateField("condition_immunities", e.target.value as ConditionType[], setStatBlock)}
					sx={{
						"& .MuiSelect-select": {
							display: 'block',
							overflow: 'hidden',
							textOverflow: 'ellipsis',
							whiteSpace: 'nowrap',
							maxWidth: '20rem'
						}
					}}
				>
					{
						Object.values(ConditionType).map(conditionType => 
							<MenuItem
								key={conditionType}
								value={conditionType}
							>
								{conditionType}
							</MenuItem>
						)
					}
				</Select>
			</FormControl>
		</Box>
	)
}

export default StatBlockFormDamageConditionSection;