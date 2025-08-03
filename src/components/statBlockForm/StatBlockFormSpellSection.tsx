import { Box, Button, FormControl, InputLabel, MenuItem, Select, TextField, Typography } from "@mui/material";
import { Dispatch, SetStateAction, useEffect, useState } from "react";
import { SpellcastingAbility, Spells, StatBlock } from "../../types/statBlock";
import { updateField } from "../../utils/statBlockUtils";

interface StatBlockSpellSectionProps {
	statBlock: StatBlock;
	setStatBlock: Dispatch<SetStateAction<StatBlock>>;
}

function StatBlockFormSpellSection({ statBlock, setStatBlock }: StatBlockSpellSectionProps) {
	const [localSpells, setLocalSpells] = useState<Spells | undefined>(statBlock.spells);
	const [newSpellLevel, setNewSpellLevel] = useState<string>("");
	const [newSpellList, setNewSpellList] = useState<string>("");

	useEffect(() => {
		if (!localSpells) return;
		updateField("spells", localSpells, setStatBlock);
	}, [localSpells, setStatBlock]);

	const handleSpellcastingAbilityChange = (ability: SpellcastingAbility) => {
		setLocalSpells(prev => {
			if (!prev) {
				return {
					ability,
					spells: {}
				};
			}
			return {
				...prev,
				ability
			}
		});
	};

	const handleNumericSpellChange = (key: keyof Spells, value: string) => {
        const numericValue = value === "" ? undefined : parseInt(value, 10);
        setLocalSpells(prev => {
            if (!prev) {
                return {
                    ability: SpellcastingAbility.Intelligence,
                    [key]: numericValue,
                    spells: {}
                };
            }
            return {
                ...prev,
                [key]: numericValue
            };
        });
    };

	const addSpellLevel = () => {
		if (!newSpellLevel || !newSpellList) return;

		setLocalSpells(prev => {
			if (!prev) {
				return {
					ability: SpellcastingAbility.Intelligence,
					spells: { [newSpellLevel]: newSpellList }
				};
			}
			return {
				...prev,
				spells: {
					...prev.spells,
					[newSpellLevel]: newSpellList
				}
			};
		});

		setNewSpellLevel("");
		setNewSpellList("");
	};

	const removeSpellLevel = (level: string) => {
		setLocalSpells(prev => {
			if (!prev) return prev;
			const { [level]: removed, ...remainingSpells } = prev.spells;
			return {
				...prev,
				spells: remainingSpells
			};
		});
	};

	const updateSpellLevel = (level: string, spells: string) => {
		setLocalSpells(prev => {
			if (!prev) return prev;
			return {
				...prev,
				spells: {
					...prev.spells,
					[level]: spells
				}
			};
		});
	};

	const enableSpellcasting = () => {
		setLocalSpells({
			ability: SpellcastingAbility.Intelligence,
			spells: {}
		});
	};

	const disableSpellcasting = () => {
		setLocalSpells(undefined);
		updateField("spells", undefined, setStatBlock);
	}

	if (!localSpells) {
        return (
            <Box sx={{
                display: 'flex',
                flexDirection: 'row',
				alignItems: 'center',
				justifyContent: 'space-between',
                pt: '1rem',
                pb: '1rem'
            }}>
                <Typography variant="h6">Spellcasting</Typography>
                <Button 
                    variant="outlined" 
                    onClick={enableSpellcasting}
                    sx={{ alignSelf: 'flex-start' }}
                >
                    Add Spellcasting
                </Button>
            </Box>
        );
    }

	return (
		<Box sx={{
            display: 'flex',
            flexDirection: 'column',
            pt: '1rem',
            pb: '1rem',
            gap: 2
        }}>
            <Box sx={{
				display: 'flex',
				flexDirection: 'row',
				justifyContent: 'space-between'
			}}>
                <Typography variant="h6">Spellcasting</Typography>
                <Button 
                    variant="outlined" 
                    color="error" 
                    size="small"
                    onClick={disableSpellcasting}
                >
                    Remove Spellcasting
                </Button>
            </Box>
            
            <Box sx={{
				flex: 1,
				display: 'flex',
				flexDirection: 'row',
				gap: '1rem'
			}}>
				<FormControl fullWidth sx={{ flex: 1 }}>
					<InputLabel id="spell-ability-label">Spellcasting Ability</InputLabel>
					<Select
						labelId="spell-ability-label"
						id="spell-ability"
						label="Spellcasting Ability"
						value={localSpells.ability}
						onChange={(e) => handleSpellcastingAbilityChange(e.target.value as SpellcastingAbility)}
					>
						{Object.values(SpellcastingAbility).map(ability =>
							<MenuItem key={ability} value={ability}>{ability}</MenuItem>
						)}
					</Select>
				</FormControl>
                <Box sx={{
					display: 'flex',
					flexDirection: 'row',
					flex: 1,
					gap: '1rem'
				}}>
					<TextField
						id="spell-save-dc"
						label="Spell Save DC"
						type="number"
						value={localSpells.save_dc || ""}
						onChange={(e) => handleNumericSpellChange("save_dc", e.target.value)}
						variant="outlined"
					/>
					
					<TextField
						id="spell-attack-bonus"
						label="Spell Attack Bonus"
						type="number"
						value={localSpells.attack_bonus || ""}
						onChange={(e) => handleNumericSpellChange("attack_bonus", e.target.value)}
						variant="outlined"
					/>
				</Box>
            </Box>

            <Typography variant="subtitle1" sx={{ mt: 2 }}>Spell Lists</Typography>
            
            {Object.entries(localSpells.spells).map(([level, spells]) => (
                <Box key={level} sx={{ display: 'flex', gap: 1, alignItems: 'flex-start' }}>
                    <TextField
                        label="Spell Level"
                        value={level}
                        size="small"
                        sx={{ minWidth: 120 }}
                        disabled
                    />
                    <TextField
                        label="Spells"
                        value={spells}
                        onChange={(e) => updateSpellLevel(level, e.target.value)}
                        multiline
                        rows={2}
                        fullWidth
                        helperText="Enter spell names separated by commas"
                    />
                    <Button
                        variant="outlined"
                        color="error"
                        size="small"
                        onClick={() => removeSpellLevel(level)}
                        sx={{ mt: 0.5 }}
                    >
                        Remove
                    </Button>
                </Box>
            ))}

            <Box sx={{ display: 'flex', gap: 1, alignItems: 'flex-start' }}>
                <TextField
                    label="Spell Level"
                    value={newSpellLevel}
                    onChange={(e) => setNewSpellLevel(e.target.value)}
                    size="small"
                    sx={{ minWidth: 120 }}
                    helperText="e.g., '0', '1st', '2nd', 'Cantrips'"
                />
                <TextField
                    label="Spells"
                    value={newSpellList}
                    onChange={(e) => setNewSpellList(e.target.value)}
                    multiline
                    rows={2}
                    fullWidth
                    helperText="Enter spell names separated by commas"
                />
                <Button
                    variant="contained"
                    onClick={addSpellLevel}
                    disabled={!newSpellLevel || !newSpellList}
                    sx={{ mt: 0.5 }}
                >
                    Add
                </Button>
            </Box>
        </Box>
	)
}

export default StatBlockFormSpellSection;