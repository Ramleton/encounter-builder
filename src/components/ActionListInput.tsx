import { ReactNode } from "react";
import { Action } from "../types/statblock";
import "./ActionListInput.css";

interface ActionListInputProps {
	label: string;
	actions: Action[];
	onChange: (updated: Action[]) => void;
}

function ActionListInput({ label, actions, onChange }: ActionListInputProps): ReactNode {
	const updateAction = (index: number, field: keyof Action, value: string) => {
		const updated = [...actions];
		updated[index] = { ...updated[index], [field]: value };
		onChange(updated);
	};

	const addAction = () => {
		onChange([...actions, { name: "", description: "" }])
	};

	const removeAction = (index: number) => {
		const updated = actions.filter((_, i) => i !== index);
		onChange(updated);
	}

	return (
		<div className="action-list-section">
			<h3>{label}</h3>
			{actions.map((action, index) => (
				<div key={index} className="action-item">
					<input
						type="text"
						placeholder="Name"
						value={action.name}
						onChange={(e) => updateAction(index, "name", e.target.value)}
					/>
					<textarea
						placeholder="description"
						value={action.description}
						onChange={(e) => updateAction(index, "description", e.target.value)}
					/>
					<button
						type="button"
						className="remove-button"
						onClick={() => removeAction(index)}>
						Remove
					</button>
				</div>
			))}
			<button
				type="button"
				className="add-button"
				onClick={addAction}>
					Add {label.slice(0, -1)}
			</button>
		</div>
	)
}

export default ActionListInput;