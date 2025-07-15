import { useState } from "react";
import "./MultiSelectDropdown.css";

interface MultiSelectDropdownProps<T extends string> {
	label: string;
	options: T[];
	selected: T[];
	onChange: (selected: T[]) => void;
	getLabel?: (value: T) => string;
}

function MultiSelectDropdown<T extends string>({
	label,
	options,
	selected,
	onChange,
	getLabel = (v) => v
}: MultiSelectDropdownProps<T>) {
	const [open, setOpen] = useState<boolean>(false);

	const toggleOption = (option: T) => {
		if (selected.includes(option)) {
			onChange(selected.filter(o => o !== option));
		} else {
			onChange([...selected, option]);
		}
	};

	return (
		<div className="multi-select">
			<label>{label}</label>
			<div
				className="dropdown-toggle"
				onClick={() => setOpen(!open)}
			>
				{selected.length > 0 ? selected.join(", ") : "Choose..."}
			</div>
			{open && (
				<div className="dropdown-options">
					{options.map(option => (
						<label key={option} className="dropdown-option">
							<input
								type="checkbox"
								checked={selected.includes(option)}
								onChange={() => toggleOption(option)}
							/>
							{getLabel(option)}
						</label>
					))}
				</div>
			)}
		</div>
	)
}

export default MultiSelectDropdown;