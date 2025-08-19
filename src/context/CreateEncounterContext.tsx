import { createContext, Dispatch, FC, ReactNode, SetStateAction, useContext, useState } from "react";
import { Encounter } from "../types/encounter";
import { generateEmptyEncounter } from "../utils/encounterUtils";

interface CreateEncounterContextType {
	encounter: Encounter;
	setEncounter: Dispatch<SetStateAction<Encounter>>;
	errors: Record<string, string>;
	setErrors: Dispatch<SetStateAction<Record<string, string>>>;
}

const CreateEncounterContext = createContext<CreateEncounterContextType | undefined>(undefined);

export const CreateEncounterProvider: FC<{ children: ReactNode, initialEncounter: Encounter | null  }> = ({ children, initialEncounter }) => {
	const [encounter, setEncounter] = useState<Encounter>(initialEncounter || generateEmptyEncounter());
	const [errors, setErrors] = useState<Record<string, string>>({});

	return (
		<CreateEncounterContext.Provider value={{ encounter, setEncounter, errors, setErrors }}>
			{children}
		</CreateEncounterContext.Provider>
	);
};

export const useEncounters = () => {
	const context = useContext(CreateEncounterContext);
	if (!context) throw new Error("useEncounters must be used within a CreateEncounterProvider");
	return context;
}