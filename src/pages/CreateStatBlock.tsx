import { Box, ThemeProvider } from "@mui/material";
import { useLocation } from "react-router-dom";
import StatBlockForm from "../components/StatBlockForm";
import StatBlockView from "../components/StatBlockView";
import { CreateStatBlockProvider } from "../context/CreateStatBlockContext";
import { statBlockViewTheme } from "../theme";

function CreateStatBlock() {
	const location = useLocation();
	const { statBlock = null } = location.state || {};

	return (
		<Box sx={{
			display: 'flex',
			flexDirection: 'row',
			width: '100%',
			minHeight: '100%',
			gap: '4rem'
		}}>
			<CreateStatBlockProvider initialStatBlock={statBlock}>
				<StatBlockForm />
				<ThemeProvider theme={statBlockViewTheme}>
					<StatBlockView />
				</ThemeProvider>
			</CreateStatBlockProvider>
		</Box>
	)
}

export default CreateStatBlock;