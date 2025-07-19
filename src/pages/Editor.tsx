import { useState } from "react";
import EnemyForm from "../components/EnemyForm";
import PlayerForm from "../components/PlayerForm";
import { Player } from "../types/player";
import { StatBlock } from "../types/statblock";
import { calcEncounterDifficulty, calcEncounterXP } from "../utils/encounterUtils";
import "./Editor.css";

function Editor() {
	const [enemies, setEnemies] = useState<StatBlock[]>([]);
	const [players, setPlayers] = useState<Player[]>([]);
	const [showForm, setShowForm] = useState(false);
	const [showPlayerForm, setShowPlayerForm] = useState<boolean>(false);
	const [editIndex, setEditIndex] = useState<number | null>(null);

	const handleSubmit = (enemy: StatBlock) => {
		if (editIndex !== null) {
			setEnemies(prev => prev.map((e, i) => (i === editIndex ? enemy : e)));
		} else {
			setEnemies(prev => [...prev, enemy]);
		}
		setShowForm(false);
		setEditIndex(null);
	}

	const handleEditEnemy = (index: number) => {
		setEditIndex(index);
		setShowForm(true);
	}

	const handleDuplicateCreature = (index: number) => {
		setEnemies(prev => [...prev, prev[index]])
	}

	const handleDeleteEnemy = (index: number) => {
		setEnemies(prev => prev.filter((_, i) => i !== index));
	}
	
	const handleAddPlayer = () => {
		setShowPlayerForm(true);
	}

	const handleEditPlayer = (index: number) => {
		setEditIndex(index);
		setShowPlayerForm(true);
	}

	const handleDeletePlayer = (index: number) => {
		setPlayers(prev => prev.filter((_, i) => i !== index));
	}

	const handlePlayerSubmit = (player: Player) => {
		if (editIndex !== null) {
			setPlayers(prev => prev.map((p, i) => (i === editIndex ? player : p)));
		} else {
			setPlayers(prev => [...prev, player]);
		}
		setShowPlayerForm(false);
		setEditIndex(null);
	}

	return (
		<div className="editor-container">
			<h1>Encounter Editor</h1>
			<div className="editor-content">
				<div className="enemy-list-panel">
					<div className="panel-title">
						<h2>Creatures</h2>
						<button onClick={() => {
							setEditIndex(null);
							setShowForm(true);
						}}>Add Creature</button>
					</div>
					<ul>
						{enemies.map((enemy, index) => (
							<li key={index} className="enemy-item">
								<span><strong>{enemy.name}</strong> (CR {enemy.cr})</span>
								<div className="enemy-buttons">
									<button
										className="enemy-button"
										onClick={() => handleEditEnemy(index)}
									>
										Edit
									</button>
									<button
										className="enemy-button"
										onClick={() => handleDuplicateCreature(index)}
									>
										Duplicate
									</button>
									<button
										className="enemy-button"
										onClick={() => handleDeleteEnemy(index)}
									>
										Delete
									</button>
								</div>
							</li>
						))}
					</ul>
					<div className="player-container">
						<div className="panel-title">
							<h2>Players</h2>
							<button onClick={handleAddPlayer}>Add Player</button>
						</div>
						<ul>
							{players.map((player, index) => (
								<li key={index} className="enemy-item">
									<span><strong>{player.name}</strong> (Level {player.level})</span>
										<div className="enemy-buttons">
										<button
											className="enemy-button"
											onClick={() => handleEditPlayer(index)}
										>
											Edit
										</button>
										<button
											className="enemy-button"
											onClick={() => handleDeletePlayer(index)}
										>
											Delete
										</button>
									</div>
								</li>
							))}
						</ul>
					</div>
					<div className="difficulty-container">
						<h3>Encounter Difficulty</h3>
						<span className="encounter-row">
							<strong>Total XP:</strong>{calcEncounterXP(enemies)}
						</span>
						<span className="encounter-row">
							<strong>Total Players:</strong>{players.length.toString()}
						</span>
						<span className="encounter-row">
							<strong>Encounter Difficulty:</strong>{calcEncounterDifficulty(enemies, players)}
						</span>
					</div>
				</div>
				<div className="enemy-form-panel">
					{showForm ? (
						<EnemyForm
							onSubmit={handleSubmit}
							onCancel={() => setShowForm(false)}
							editStatblock={editIndex !== null ? enemies[editIndex] : undefined}
						/>
					) : showPlayerForm ? (
						<PlayerForm
							onSubmit={handlePlayerSubmit}
							onCancel={() => setShowPlayerForm(false)}
							editPlayer={editIndex !== null ? players[editIndex] : undefined}
						/>
					) : (
						<p>Select a creature or add a player to get started.</p>
					)}
				</div>
			</div>
		</div>
	)
}

export default Editor;