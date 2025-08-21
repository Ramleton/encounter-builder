import { Add, ArrowBack } from "@mui/icons-material";
import { Box, Button, Collapse, TextField } from "@mui/material";
import { Dispatch, SetStateAction, useState } from "react";
import { useEncounter } from "../../context/CreateEncounterContext";
import { EncounterPlayer, Level } from "../../types/encounter";

interface EncounterFormPlayerFormProps {
	open: boolean;
	setOpen: Dispatch<SetStateAction<boolean>>;
	handleAddPlayer: (player: EncounterPlayer) => void;
}

function EncounterFormPlayerForm({ open, setOpen, handleAddPlayer }: EncounterFormPlayerFormProps) {
	const [playerName, setPlayerName] = useState<string>("");
	const [playerLevel, setPlayerLevel] = useState<Level | null>(null);
	const [playerHP, setPlayerHP] = useState<number | null>(null);
	const [playerCurrHP, setPlayerCurrHP] = useState<number | null>(null);
	const [playerTempHP, setPlayerTempHP] = useState<number | null>(null);
	const [errors, setErrors] = useState<Record<string, string>>({});

	const { encounterPlayers } = useEncounter();

	const updateIntegerField = (value: string, updateField: Dispatch<SetStateAction<number | null>>) => {
		if (value === "") updateField(null);

		const parsedValue = Number.parseInt(value);
		if (isNaN(parsedValue)) return;

		updateField(parsedValue);
	}

	const handleSubmit = () => {
		const currentErrors: Record<string, string> = {};
		
		if (playerName === "") currentErrors["name"] = "Player Name is required";
		if (encounterPlayers.filter(player => player.name === playerName).length) currentErrors["name"] = "Duplicate player name in encounter";
		if (!playerLevel) currentErrors["level"] = "Player Level is required";
		if (playerHP === null) currentErrors["hp"] = "Player HP is required";
		if (playerHP !== null && playerHP <= 0) currentErrors["hp"] = "Player HP must be positive";
		if (playerCurrHP !== null) {
			if (playerCurrHP < 0) currentErrors["curr_hp"] = "Player Current HP must be nonnegative";
			if (playerHP !== null && playerCurrHP > playerHP) currentErrors["curr_hp"] = "Player Current HP must be between 0 and Player HP";
		}
		if (playerTempHP !== null && playerTempHP < 0) currentErrors["temp_hp"] = "Player Temporary HP must be nonnegative";

		setErrors(currentErrors);

		if (Object.keys(currentErrors).length !== 0) return;

		const newEncounterPlayer: EncounterPlayer = {
			name: playerName,
			hp: playerHP || 1,
			current_hp: playerCurrHP || playerHP || 1,
			temporary_hp: playerTempHP || 0,
			level: playerLevel || 1
		}

		setPlayerName("");
		setPlayerLevel(null);
		setPlayerHP(null);
		setPlayerCurrHP(null);
		setPlayerTempHP(null);

		handleAddPlayer(newEncounterPlayer);
		setOpen(false);
	}

	const handleCancel = () => {
		setPlayerName("");
		setPlayerLevel(null);
		setPlayerHP(null);
		setPlayerCurrHP(null);
		setPlayerTempHP(null);
		setErrors({});
		setOpen(false);
	}

	return (
		<Collapse
			in={open}
		>
			<Box sx={{
				display: 'flex',
				flexDirection: 'column',
				alignItems: 'center',
				justifyContent: 'center',
				gap: '1rem'
			}}>
				<Box sx={{
					display: 'flex',
					flexDirection: 'row',
					alignItems: 'center',
					justifyContent: 'center',
					gap: '1rem'
				}}>	 
					<TextField
						required
						id="encounter_player_name"
						label="Name"
						type="text"
						value={playerName}
						error={!!errors["name"]}
						helperText={errors["name"] || ""}
						onChange={(e) => setPlayerName(e.target.value)}
						variant="standard"
					/>
					<TextField
						required
						id="encounter_player_level"
						label="Level"
						type="text"
						value={playerLevel !== null ? playerLevel.toString() : ""}
						error={!!errors["level"]}
						helperText={errors["level"] || ""}
						onChange={(e) => {
							if (e.target.value === "") setPlayerLevel(null);
							const parsedValue = Number.parseInt(e.target.value);
							if (isNaN(parsedValue)) return;
							if (parsedValue < 1 || parsedValue > 20) return;

							setPlayerLevel(parsedValue as Level);
						}}
						variant="standard"
					/>
				</Box>
				<Box sx={{
					display: 'flex',
					flexDirection: 'row',
					alignItems: 'center',
					justifyContent: 'center',
					gap: '1rem'
				}}>	 
					<TextField
						required
						id="encounter_player_hp"
						label="HP"
						type="text"
						value={playerHP !== null ? playerHP.toString() : ""}
						error={!!errors["hp"]}
						helperText={errors["hp"] || ""}
						onChange={(e) => updateIntegerField(e.target.value, setPlayerHP)}
						variant="standard"
					/>
					<TextField
						id="encounter_player_curr_hp"
						label="Current HP"
						type="text"
						value={playerCurrHP !== null ? playerCurrHP.toString() : ""}
						error={!!errors["curr_hp"]}
						helperText={errors["curr_hp"] || ""}
						onChange={(e) => updateIntegerField(e.target.value, setPlayerCurrHP)}
						variant="standard"
					/>
					<TextField
						id="encounter_player_temp_hp"
						label="Temporary HP"
						type="text"
						value={playerTempHP !== null ? playerTempHP.toString() : ""}
						error={!!errors["temp_hp"]}
						helperText={errors["temp_hp"] || ""}
						onChange={(e) => updateIntegerField(e.target.value, setPlayerTempHP)}
						variant="standard"
					/>
				</Box>
				<Box sx={{
					display: 'flex',
					flexDirection: 'row',
					alignItems: 'center',
					justifyContent: 'center',
					gap: '1rem'
				}}>
					<Button
						variant="contained"
						endIcon={<ArrowBack />}
						onClick={handleCancel}
					>
						Cancel
					</Button>
					<Button
						variant="contained"
						endIcon={<Add />}
						onClick={handleSubmit}
					>
						Add
					</Button>
				</Box>
			</Box>
		</Collapse>
	)
}

export default EncounterFormPlayerForm;