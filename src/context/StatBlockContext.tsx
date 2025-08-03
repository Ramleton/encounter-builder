import { createContext, Dispatch, FC, ReactNode, SetStateAction, useContext, useState } from "react";
import { StatBlock } from "../types/statBlock";
import { generateEmptyStatBlock } from "../utils/statBlockUtils";

interface StatBlockContextType {
	statBlock: StatBlock;
	setStatBlock: Dispatch<SetStateAction<StatBlock>>;
}

const StatBlockContext = createContext<StatBlockContextType | undefined>(undefined);

export const StatBlockProvider: FC<{ children: ReactNode }> = ({ children }) => {
	const [statBlock, setStatBlock] = useState<StatBlock>(generateEmptyStatBlock());

	return (
		<StatBlockContext.Provider value={{ statBlock, setStatBlock }}>
			{children}
		</StatBlockContext.Provider>
	);
}

export const useStatBlock = () => {
	const context = useContext(StatBlockContext);
	if (!context) throw new Error("useStatBlock must be used within a StatBlockProvider");
	return context;
}