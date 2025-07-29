import { Box, Checkbox, FormControl, FormControlLabel, TextField, Typography } from "@mui/material";
import { Dispatch, SetStateAction } from "react";
import { Score, StatBlock, Stats } from "../../types/statBlock";
import { getModifier, getProficiencyBonus, modifierToString } from "../../utils/abilityUtils";
import { updateField, updateStatField } from "../../utils/statBlockUtils";

interface StatBlockFormStatSectionProps {
	statBlock: StatBlock;
	setStatBlock: Dispatch<SetStateAction<StatBlock>>;
}

function StatBlockFormStatSection({ statBlock, setStatBlock }: StatBlockFormStatSectionProps) {
	return (
		<>
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
								<Typography variant="body2" textAlign="center">{score}</Typography>
								<TextField
									required
									id="standard-required"
									type="text"
									value={typeof statBlock.stats[key] === 'number' ? statBlock.stats[key] : 10}
									onChange={(e) => {
										const parsed = Number.parseInt(e.target.value, 10);
										updateStatField(key, isNaN(parsed) ? 0 : parsed, setStatBlock);
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
												updateField(
													"saves", 
													[...statBlock.saves.filter((s) => s.score !== score),
														{ score, level: "proficient" }
													],
													setStatBlock
												);
											} else {
												updateField(
													"saves",
													statBlock.saves.filter((s) => s.score !== score),
													setStatBlock
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
		</>
	)
}

export default StatBlockFormStatSection;