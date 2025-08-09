import { Box } from "@mui/material";
import StatBlockForm from "../components/StatBlockForm";
import StatBlockView from "../components/StatBlockView";
import { StatBlockProvider } from "../context/StatBlockContext";

function CreateStatBlock() {

	return (
		<Box sx={{
			display: 'flex',
			flexDirection: 'row',
			width: '100%',
			minHeight: '100%',
			gap: '4rem'
		}}>
			<StatBlockProvider>
				<StatBlockForm />
				<StatBlockView />
			</StatBlockProvider>
		</Box>
	)
}

export default CreateStatBlock;