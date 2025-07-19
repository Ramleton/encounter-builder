import { useState } from "react";
import EnemyForm from "../components/EnemyForm";
import { StatBlock } from "../types/statblock";
import "./Editor.css";

function Editor() {
	const [enemies, setEnemies] = useState<StatBlock[]>([]);
	const [showForm, setShowForm] = useState(false);
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

	return (
		<div className="editor-container">
			<h1>Encounter Editor</h1>
			<div className="editor-content">
				<div className="enemy-list-panel">
					<h2>Creatures</h2>
					<button onClick={() => {
						setEditIndex(null);
						setShowForm(true);
					}}>Add Creature</button>
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
				</div>
				<div className="enemy-form-panel">
					{showForm ? (
						<EnemyForm
							onSubmit={handleSubmit}
							onCancel={() => setShowForm(false)}
							editStatblock={editIndex !== null ? enemies[editIndex] : undefined}
						/>
					) : (
						<p>Select a creature to edit or create a new one.</p>
					)}
				</div>
			</div>
		</div>
	)
}

export default Editor;