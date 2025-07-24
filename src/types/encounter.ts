import { Player } from "./player";
import { StatBlock } from "./statBlock";

export type Encounter = {
	name: string;
	creatures: StatBlock[];
	players: Player[];
	last_modified: string;
}