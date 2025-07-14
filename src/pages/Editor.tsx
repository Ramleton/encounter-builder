import { useState } from "react";
import EnemyForm from "../components/EnemyForm";
import { StatBlock } from "../types/statblock";
import "./Editor.css";

function Editor() {
	const [enemies, setEnemies] = useState<StatBlock[]>([]);
	const [showForm, setShowForm] = useState(false);

	const handleAddEnemy = (enemy: StatBlock) => {
		setEnemies(prev => [...prev, enemy]);
		setShowForm(false);
	}

	const handleEditEnemy = (index: number) => {
		// TODO
	}

	const handleDeleteEnemy = (index: number) => {
		setEnemies(prev => prev.filter((_, i) => i !== index));
	}

	return (
		<div className="editor-container">
			<h1>Encounter Editor</h1>

			{enemies.length === 0 ? (
				<div className="empty-state">
					<p>No enemies in this encounter yet.</p>
					<button onClick={() => setShowForm(true)}>Add First Enemy</button>
				</div>
			) : (
				<>
					<button onClick={() => setShowForm(true)}>Add Enemy</button>
					<ul>
						{enemies.map((enemy, index) => (
							<li key={index} className="enemy-item">
								<strong>{enemy.name} </strong>
								(CR {enemy.cr})
								<button
									className="enemy-button"
									onClick={() => handleEditEnemy(index)}
								>
									Edit
								</button>
								<button
									className="enemy-button"
									onClick={() => handleDeleteEnemy(index)}
								>
									Delete
								</button>
							</li>
						))}
					</ul>
				</>
			)}

			{showForm && <EnemyForm onSubmit={handleAddEnemy} onCancel={() => setShowForm(false)} />}
		</div>
	)
}

export default Editor;