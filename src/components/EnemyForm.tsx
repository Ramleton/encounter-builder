import { useState } from "react";
import { Ability, Alignment, Score, Size, StatBlock, Stats } from "../types/statblock";
import { abilityToScore, getModifier, getProficiencyBonus } from "../utils/abilityUtils";
import "./EnemyForm.css";
import MultiSelectDropdown from "./MultiSelectDropdown";

interface Props {
	onSubmit: (enemy: StatBlock) => void;
	onCancel: () => void;
}

function EnemyForm({ onSubmit, onCancel }: Props) {
	const [statBlock, setStatBlock] = useState<StatBlock>({
		name: "",
		size: Size.Medium,
		type_: "",
		subtype: "",
		alignment: Alignment.TrueNeutral,
		ac: 10,
		hp: 1,
		hit_dice: "",
		speed: "",
		stats: {
			strength: 10,
			dexterity: 10,
			constitution: 10,
			intelligence: 10,
			wisdom: 10,
			charisma: 10
		},
		saves: [],
		skill_saves: [],
		senses: "",
		languages: [],
		damage_vulnerabilities: [],
		damage_immunities: [],
		damage_resistances: [],
		condition_immunities: [],
		cr: 0,
		traits: [],
		actions: [],
		legendary_actions: [],
		bonus_actions: [],
		reactions: []
	});

	const updateField = <K extends keyof StatBlock>(key: K, value: StatBlock[K]) => {
		setStatBlock(prev => ({
			...prev,
			[key]: value
		}))
	}

	const updateStat = <K extends keyof StatBlock["stats"]>(key: K, value: StatBlock["stats"][K]) => {
		setStatBlock(prev => ({
			...prev,
			stats: {
				...prev.stats,
				[key]: value
			}
		}));
	}
	
	const handleSubmit = () => {
		onSubmit(statBlock);
	}

	const allScores = Object.values(Score);
	const allAbilities = Object.values(Ability);
	const CR_OPTIONS = [
		"0", "1/8", " 1/4", "1/2", ...Array.from({ length: 30 }, (_, i) => i + 1)
	];

	return (
		<div className="enemy-form">
			<h2>Add New Enemy</h2>
			<div className="form-fields">
				<div className="form-field">
					<label htmlFor="enemy-name">Name</label>
					<input
						id="enemy-name"
						type="text"
						placeholder="Name"
						value={statBlock.name}
						onChange={e => updateField("name", e.target.value)}
						required
					/>
				</div>
				<div className="form-field">
					<label htmlFor="enemy-type">Type</label>
					<input
						id="enemy-type"
						type="text"
						placeholder="Type"
						value={statBlock.type_}
						onChange={e => updateField("type_", e.target.value)}
						required
					/>
				</div>
				<div className="form-field">
					<label htmlFor="enemy-subtype">Subtype</label>
					<input
						id="enemy-subtype"
						type="text"
						placeholder="Subtype"
						value={statBlock.subtype}
						onChange={e => updateField("subtype", e.target.value)}
					/>
				</div>
				<div className="form-field">
					<label htmlFor="enemy-alignment">Alignment</label>
					<select
						id="enemy-alignment"
						name="alignment"
						onChange={e => updateField("alignment", e.target.value as Alignment)}
						required
					>
						{Object.values(Alignment).map(alignment => (
							<option
								key={alignment}
								value={alignment}
							>
								{alignment.replace(/([A-Z])/g, " $1").trim()}
							</option>
						))}
					</select>
				</div>
				<div className="form-field">
					<label htmlFor="enemy-ac">Armour Class (AC)</label>
					<input
						id="enemy-ac"
						type="number"
						min={0}
						placeholder="2"
						value={statBlock.ac}
						onChange={e => updateField("ac", Number(e.target.value))}
						required
					/>
				</div>
				<div className="form-field">
					<label htmlFor="enemy-hp">Hit Points (HP)</label>
					<input
						id="enemy-hp"
						type="number"
						min={1}
						placeholder="2"
						value={statBlock.hp}
						onChange={e => updateField("hp", Number(e.target.value))}
						required
					/>
				</div>
				<div className="form-field">
					<label htmlFor="enemy-hd">Hit Dice</label>
					<input
						id="enemy-hd"
						type="text"
						placeholder="Hit dice"
						value={statBlock.hit_dice}
						onChange={e => updateField("hit_dice", e.target.value)}
						required
					/>
				</div>
				<div className="form-field">
					<label htmlFor="enemy-speed">Speed</label>
					<input
						id="enemy-speed"
						type="text"
						placeholder="Speed"
						value={statBlock.speed}
						onChange={e => updateField("speed", e.target.value)}
						required
					/>
				</div>
				<div className="form-field-stats">
					{[
						["Strength", "strength"],
						["Dexterity", "dexterity"],
						["Constitution", "constitution"],
						["Intelligence", "intelligence"],
						["Wisdom", "wisdom"],
						["Charisma", "charisma"]
					].map(([label, key]) => (
						<div className="stat-column" key={key}>
							<label htmlFor={`enemy-${key}`}>{label}</label>
							<input
								className="stat-input"
								id={`enemy-${key}`}
								type="number"
								min={0}
								value={statBlock.stats[key as keyof typeof statBlock.stats]}
								onChange={(e) => updateStat(key as keyof typeof statBlock.stats, Number(e.target.value))}
							/>
							<div className="modifier">
								{getModifier(statBlock.stats[key as keyof typeof statBlock.stats])}
							</div>
						</div>
					))}
				</div>
				<div className="form-section">
					<h3>Saving Throw Proficiencies</h3>
					<div className="form-field-saves">
						{allScores.map((score) => (
							<label key={score}>{score}
								<input
									type="checkbox"
									checked={statBlock.saves.includes(score)}
									onChange={(e) => {
										const updated = e.target.checked
											? [...statBlock.saves, score]
											: statBlock.saves.filter(s => s !== score);
										updateField("saves", updated);
									}}
								/>
							</label>
						))}
					</div>
				</div>
				<div className="form-section">
					<h3>Ability Save Proficiencies</h3>
					<div className="form-field-saves">
						<MultiSelectDropdown
							label={"Select Ability Saves"}
							options={allAbilities}
							selected={statBlock.skill_saves}
							onChange={(selected) => {
								updateField("skill_saves", selected);
							}}
							getLabel={(v) => {
								const associatedScore = abilityToScore(v);
								const scoreKey = associatedScore.toLowerCase() as keyof Stats;
								const rawStat = statBlock.stats[scoreKey];
								const modifier = Math.floor((rawStat - 10) / 2) + (
									statBlock.skill_saves.includes(v)
										? getProficiencyBonus(statBlock)
										: 0
								);

								const abilityTrimmed = v.replace(/([A-Z])/g, " $1").trim();
								const modifierStr = modifier > 0
									? `+${modifier}`
									: modifier == 0
									? `${modifier}`
									: `-${modifier}`;

								return abilityTrimmed + ` (${modifierStr})`
							}}
						/>
					</div>
				</div>
				<div className="form-field">
					<label htmlFor="enemy-cr">Challenge Rating (CR)</label>
					<select
						id="enemy-cr"
						value={statBlock.cr}
						onChange={(e) => updateField("cr", parseFloat(e.target.value))}
					>
						{CR_OPTIONS.map((cr) => (
							<option key={cr} value={cr}>
								{cr}
							</option>
						))}
					</select>
				</div>
			</div>
			<div className="form-actions">
				<button className="cancel-button" onClick={onCancel}>Cancel</button>
				<button className="submit-button" onClick={handleSubmit}>Add</button>
			</div>
		</div>
	)
}

export default EnemyForm;