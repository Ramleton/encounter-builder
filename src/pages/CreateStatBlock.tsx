import { Box } from "@mui/material";
import { useState } from "react";
import StatBlockForm from "../components/StatBlockForm";
import { StatBlock } from "../types/statBlock";
import { generateEmptyStatBlock } from "../utils/statBlockUtils";

interface StatBlockPreviewProps {
	statBlock: StatBlock;
}

function StatBlockPreview({ statBlock }: StatBlockPreviewProps) {
	return (
		<Box
			sx={{
				flex: 1
			}}
		>
		</Box>
	)
}

function CreateStatBlock() {
	const [statBlock, setStatBlock] = useState<StatBlock>(generateEmptyStatBlock());	

	return (
		<Box sx={{
			display: 'flex',
			flexDirection: 'row',
			width: '100%',
			minHeight: '100%',
			gap: '4rem'
		}}>
			<StatBlockForm statBlock={statBlock} setStatBlock={setStatBlock}/>
			<StatBlockPreview statBlock={statBlock} />
		</Box>
	)
}

export default CreateStatBlock;