import { invoke } from "@tauri-apps/api/core";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Encounter } from "../types/encounter";
import "./EncounterLoadPage.css";

function EncounterLoadPage() {
	const [encounters, setEncounters] = useState<Encounter[]>([]);
	const navigate = useNavigate();

	useEffect(() => {

		const fetchEncounters = async () => {
			try {
				const data = await invoke<Encounter[]>("load_encounters")
				setEncounters(data);
			} catch (error) {
				console.error("Failed to load encounters:", error);
			}
		};

		fetchEncounters();
	}, []);

	const onLoad = (encounter: Encounter) => {
		navigate("/editor", { state: { encounter } });
	}

	const onDelete = async (encounter: Encounter) => {
		try {
			await invoke<String>("delete_encounter", { encounter });
			setEncounters(prev => prev.filter(e => e !== encounter));
		} catch (error) {
			console.error("Failed to delete encounter:", error);
		}
	}

	return (
		<div className="encounter-grid-container">
			<h1 className="encounter-grid-title">
				Saved Encounters
			</h1>
			<div className="encounter-grid">
				{encounters.map((encounter) => (
					<div key={encounter.name} className="encounter-card">
						<h2 className="encounter-name">{encounter.name}</h2>
						<p className="encounter-details">
							{encounter.creatures.length + ` ${encounter.creatures.length === 1
								? "Creature"
								: "Creatures"
							}`} | {encounter.players.length + ` ${encounter.players.length === 1
								? "Player"
								: "Players"
							}`}
						</p>
						<p className="encounter-modified">
							Last modified: {new Date(encounter.last_modified).toLocaleString()}
						</p>
						<div className="encounter-buttons">
							<button
								className="load-button"
								onClick={() => onLoad(encounter)}
							>
								Load
							</button>
							<button
								className="delete-button"
								onClick={() => onDelete(encounter)}
							>
								Delete
							</button>
						</div>
					</div>
				))}
				<button
					className="empty-encounter-card"
					onClick={() => navigate("/editor")}
				>
					<h2 className="encounter-name">Add New Encounter</h2>
				</button>
			</div>
		</div>
	)
}

export default EncounterLoadPage;