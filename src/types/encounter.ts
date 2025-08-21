import { EnumerateRange } from "../utils/typeUtils";

export type Encounter = {
	id?: number;
	name: string;
	user_id: string;
	last_modified: string;
}

export type Level = EnumerateRange<1, 21>;

export type EncounterPlayer = {
	encounter_id?: number;
	name: string;
	hp: number;
	current_hp: number;
	temporary_hp: number;
	initiative?: number;
	level: Level;
}

export type PlayableStatBlock = {
	id?: number;
	current_hp: number;
	temporary_hp: number;
	initiative?: number;
	name?: string;
	statblock_id: number;
	encounter_id?: number;
}