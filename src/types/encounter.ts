import { Player } from "./player";
import { StatBlock } from "./statblock";

export type Encounter = {
	name: string;
	creatures: StatBlock[];
	players: Player[];
}