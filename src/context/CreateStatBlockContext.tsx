import { createContext, Dispatch, FC, ReactNode, SetStateAction, useContext, useState } from "react";
import { StatBlock } from "../types/statBlock";
import { generateEmptyStatBlock } from "../utils/statBlockUtils";

interface CreateStatBlockContextType {
	statBlock: StatBlock;
	setStatBlock: Dispatch<SetStateAction<StatBlock>>;
	errors: Record<string, string>;
	setErrors: Dispatch<SetStateAction<Record<string, string>>>;
}

const CreateStatBlockContext = createContext<CreateStatBlockContextType | undefined>(undefined);

export const CreateStatBlockProvider: FC<{ children: ReactNode, initialStatBlock: StatBlock | null }> = ({ children, initialStatBlock = null }) => {
	const [statBlock, setStatBlock] = useState<StatBlock>(initialStatBlock || generateEmptyStatBlock());
	const [errors, setErrors] = useState<Record<string, string>>({});

	return (
		<CreateStatBlockContext.Provider value={{ statBlock, setStatBlock, errors, setErrors }}>
			{children}
		</CreateStatBlockContext.Provider>
	);
}

export const useCreateStatBlock = () => {
	const context = useContext(CreateStatBlockContext);
	if (!context) throw new Error("useCreateStatBlock must be used within a CreateStatBlockProvider");
	return context;
}