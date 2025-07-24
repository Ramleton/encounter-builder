import { invoke } from "@tauri-apps/api/core";
import { createContext, Dispatch, FC, ReactNode, SetStateAction, useContext, useEffect, useState } from "react";
import { StatBlock } from "../types/statBlock";

interface StatBlockContextType {
	statBlocks: StatBlock[];
	setStatBlocks: Dispatch<SetStateAction<StatBlock[]>>;
	refreshStatBlocks: () => Promise<void>;
}

const StatBlockContext = createContext<StatBlockContextType | undefined>(undefined);

export const StatBlockProvider: FC<{ children: ReactNode }> = ({ children }) => {
	const [statBlocks, setStatBlocks] = useState<StatBlock[]>([]);
	
	const refreshStatBlocks = async (): Promise<void> => {
		const data = await invoke<StatBlock[]>("load_statblocks");
		setStatBlocks(data);
	}

	useEffect(() => {
		refreshStatBlocks();
	}, []);

	return (
		<StatBlockContext.Provider value={{ statBlocks, setStatBlocks, refreshStatBlocks }}>
			{children}
		</StatBlockContext.Provider>
	);
};

export const useStatBlocks = (): StatBlockContextType => {
	const context = useContext(StatBlockContext);
	if (!context) throw new Error("useStatBlocks must be used within a StatBlockProvider");
	return context;
}