import { Box, Checkbox, Divider, FormControl, FormControlLabel, InputLabel, MenuItem, Select, TextField, Typography } from "@mui/material";
import { Dispatch, SetStateAction } from "react";
import { Ability, Alignment, CR_VALUES, ProficiencyLevel, Score, Size, StatBlock, Stats } from "../types/statBlock";
import { getModifier, getProficiencyBonus, modifierToString } from "../utils/abilityUtils";

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
						onChange={(e) => updateField("cr", e.target.value)}
					>
						{
							CR_VALUES.map(cr => <MenuItem key={cr} value={cr}>
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
							<Box 
								key={score}
								sx={{
									display: 'flex',
									flexDirection: 'column',
									justifyContent: 'center',
									alignItems: 'center',
									border: "1px solid white",
									borderRadius: '5%'
								}}
							>
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
								<Typography>{modifierToString(getModifier(statBlock.stats[key]))}</Typography>
								<FormControl fullWidth sx={{
									display: 'flex',
									flexDirection: 'row',
									borderTop: '1px solid white',
									alignItems: 'center',
									justifyContent: 'center'
								}}>
									<FormControlLabel control={<Checkbox
										onChange={(e) => {
											if (e.target.checked) {
												updateField("saves", 
												[...statBlock.saves.filter((s) => s.score !== score),
													{ score, level: "proficient" }
												]);
											} else {
												updateField("saves",
													statBlock.saves.filter((s) => s.score !== score)
												);
											}
										}}
										icon={
											<Box
												sx={{
													width: 20,
													height: 20,
													borderRadius: '50%',
													border: '2px solid',
													borderColor: 'text.secondary',
												}}
											/>
										}
										checkedIcon={
											<Box
												sx={{
													width: 20,
													height: 20,
													borderRadius: '50%',
													backgroundColor: 'primary.main',
													border: '2px solid',
													borderColor: 'primary.main',
												}}
											/>
										}
									/>} label="Save" />
								</FormControl>
								<Typography>{
									modifierToString(statBlock.saves.find(save => save.score === score)?.level === "proficient"
										? getModifier(statBlock.stats[key] + getProficiencyBonus(statBlock) * 2)
										: getModifier(statBlock.stats[key]))
								}</Typography>
							</Box>
						)
					})
				}
			</Box>
			<Divider sx={{ mt: '1rem', mb: '1rem' }} />
			<Box sx={{
				display: 'flex',
				flexDirection: 'row',
				width: '100%',
				justifyContent: 'center',
				alignItems: 'center',
			}}>
				<Box sx={{
					display: 'flex',
					flexDirection: 'column',
					flex: 1,
					justifyContent: 'center',
					alignItems: 'center',
				}}>
					{Object.values(Ability).map((ability) => {
						const current = statBlock.skill_saves.find((s) => s.ability === ability)?.level ?? "none";
						const displayName = ability.replace(/([a-z])([A-Z])/g, `$1 $2`);

						return (
							<Box
								key={ability}
								sx={{
									display: 'flex',
									alignItems: 'center',
									gap: 2,
									py: 1,
									px: 2,
									borderRadius: 1,
									'&:hover': {
										backgroundColor: 'action.hover',
									},
									transition: 'background-color 0.2s ease'
								}}
							>
								<Typography
									variant="body2"
									sx={{
										minWidth: 140,
										fontWeight: current !== 'none' ? 600 : 400,
										color: current !== 'none' ? 'primary.main' : 'text.secondary'
									}}
								>
									{displayName}
								</Typography>
								<FormControl
									variant="outlined"
									size="small"
									sx={{
										minWidth: 150,
										'& .MuiOutlinedInput-root': {
											'&.Mui-focused fieldset': {
												borderColor: current === 'expertise' ? 'warning.main' :
													current === 'proficient' ? 'success.main' : 'primary.main'
											}
										}
									}}
								>
									<Select
										value={current}
										onChange={(e) => {
											const newLevel = e.target.value as ProficiencyLevel;
											updateField("skill_saves", [
												...statBlock.skill_saves.filter((s) => s.ability !== ability),
												{ ability, level: newLevel }
											]);
										}}
										MenuProps={{
											PaperProps: {
												sx: {
													minWidth: 150,
												}
											}
										}}
										sx={{
											'& .MuiSelect-select': {
												color: current === 'expertise' ? 'warning.main' :
													current === 'proficient' ? 'success.main' : 'text.primary',
												fontWeight: current !== 'none' ? 600 : 400
											}
										}}
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
						)
					})}
				</Box>
				<Box sx={{
					display: 'flex',
					flexDirection: 'column',
					flex: 1,
					justifyContent: 'center',
					alignItems: 'center',
				}}>

				</Box>
			</Box>
		</Box>
	)
}

export default StatBlockForm;