import { Box, Divider, FormControl, MenuItem, Select, Typography } from "@mui/material";
import { Dispatch, SetStateAction } from "react";
import { Ability, ProficiencyLevel, StatBlock } from "../types/statBlock";
import { updateField } from "../utils/statBlockUtils";
import StatBlockFormStatSection from "./statBlockForm/StatBlockFormStatSection";
import UpperStatBlockForm from "./statBlockForm/UpperStatBlockForm";

interface StatBlockFormProps {
	statBlock: StatBlock;
	setStatBlock: Dispatch<SetStateAction<StatBlock>>;
}

function StatBlockForm({ statBlock, setStatBlock }: StatBlockFormProps) {

	return (
		<Box sx={{
			flex: 1,
			display: 'flex',
			flexDirection: 'column',
			border: '1px solid white',
			padding: '1rem 2rem'
		}}>
			<UpperStatBlockForm statBlock={statBlock} setStatBlock={setStatBlock} />
			<Divider sx={{ mt: '1rem', mb: '1rem' }} />
			<StatBlockFormStatSection statBlock={statBlock} setStatBlock={setStatBlock} />
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
									py: 0.25,
									px: 0.5,
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
											updateField(
												"skill_saves",
												[
													...statBlock.skill_saves.filter((s) => s.ability !== ability),
													{ ability, level: newLevel }
												],
												setStatBlock
											);
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