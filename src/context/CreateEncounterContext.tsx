import { createContext, Dispatch, FC, ReactNode, SetStateAction, useContext, useState } from "react";
import { Encounter, EncounterPlayer, PlayableStatBlock } from "../types/encounter";
import { generateEmptyEncounter } from "../utils/encounterUtils";

interface CreateEncounterContextType {
	encounter: Encounter;
	setEncounter: Dispatch<SetStateAction<Encounter>>;
	playableStatBlocks: PlayableStatBlock[];
	setPlayableStatBlocks: Dispatch<SetStateAction<PlayableStatBlock[]>>;
	encounterPlayers: EncounterPlayer[];
	setEncounterPlayers: Dispatch<SetStateAction<EncounterPlayer[]>>;
	errors: Record<string, string>;
	setErrors: Dispatch<SetStateAction<Record<string, string>>>;
}

const CreateEncounterContext = createContext<CreateEncounterContextType | undefined>(undefined);

interface CreateEncounterContextProps {
	children: ReactNode;
	initialEncounter?: Encounter;
	initialPlayableStatBlocks: PlayableStatBlock[];
	initialEncounterPlayers: EncounterPlayer[];
}

export const CreateEncounterProvider: FC<CreateEncounterContextProps> = ({
	children,
	initialEncounter,
	initialPlayableStatBlocks,
	initialEncounterPlayers
}) => {
	const [encounter, setEncounter] = useState<Encounter>(initialEncounter || generateEmptyEncounter());
	const [playableStatBlocks, setPlayableStatBlocks] = useState<PlayableStatBlock[]>(initialPlayableStatBlocks);
	const [encounterPlayers, setEncounterPlayers] = useState<EncounterPlayer[]>(initialEncounterPlayers);
	const [errors, setErrors] = useState<Record<string, string>>({});

	return (
		<CreateEncounterContext.Provider value={{
			encounter,
			setEncounter,
			playableStatBlocks,
			setPlayableStatBlocks,
			encounterPlayers,
			setEncounterPlayers,
			errors,
			setErrors
		}}>
			{children}
		</CreateEncounterContext.Provider>
	);
};

export const useEncounter = () => {
	const context = useContext(CreateEncounterContext);
	if (!context) throw new Error("useEncounters must be used within a CreateEncounterProvider");
	return context;
}