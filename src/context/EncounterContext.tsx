import { invoke } from "@tauri-apps/api/core";
import { createContext, Dispatch, FC, ReactNode, SetStateAction, useContext, useEffect, useState } from "react";
import { Encounter } from "../types/encounter";

interface EncounterContextType {
	encounters: Encounter[];
	setEncounters: Dispatch<SetStateAction<Encounter[]>>;
	refreshEncounters: () => Promise<void>;
}

const EncounterContext = createContext<EncounterContextType | undefined>(undefined);

export const EncounterProvider: FC<{ children: ReactNode }> = ({ children }) => {
	const [encounters, setEncounters] = useState<Encounter[]>([]);
	
	const refreshEncounters = async () => {
		await invoke<Encounter[]>("load_encounters")
			.then(data => setEncounters(data));
	}

	useEffect(() => {
		refreshEncounters();
	}, []);

	return (
		<EncounterContext.Provider value={{ encounters, setEncounters, refreshEncounters }}>
			{children}
		</EncounterContext.Provider>
	);
};

export const useEncounters = () => {
	const context = useContext(EncounterContext);
	if (!context) throw new Error("useEncounters must be used within an EncounterProvider");
	return context;
}