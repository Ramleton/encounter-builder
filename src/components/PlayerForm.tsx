import { useState } from "react";
import { Level, Player } from "../types/player";

interface PlayerFormProps {
	onSubmit: (player: Player) => void;
	onCancel: () => void;
	editPlayer?: Player;
}

const createDefaultPlayer = (): Player => {
	return {
		name: "",
		level: 1
	};
}

function PlayerForm({ onSubmit, onCancel, editPlayer }: PlayerFormProps) {
	const [player, setPlayer] = useState<Player>(
		editPlayer ? editPlayer : createDefaultPlayer()
	);

	const updateField = <K extends keyof Player>(key: K, value: Player[K]) => {
		setPlayer(prev => ({
			...prev,
			[key]: value
		}))
	}

	const handleSubmit = (e: React.FormEvent) => {
		e.preventDefault();
		if (!player.name || player.level < 1 || player.level > 20) return;
		onSubmit(player);
	};

	return (
		<form onSubmit={handleSubmit} className="player-form">
			<h2>Add Player</h2>
			<label>
				Name:
				<input value={player.name} onChange={e => updateField("name", e.target.value)} />
			</label>
			<label>
				Level:
				<input
				type="number"
				value={player.level}
				min={1}
				max={20}
				onChange={e => updateField("level", Number(e.target.value) as Level)}
				/>
			</label>
			<div>
				<button type="submit">{editPlayer ? "Edit" : "Add"}</button>
				<button type="button" onClick={onCancel}>Cancel</button>
			</div>
		</form>
	)
}

export default PlayerForm;