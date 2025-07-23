import { createTheme } from '@mui/material/styles';

export const darkTheme = createTheme({
	palette: {
		mode: "dark",
		background: {
			default: "#1e1e1e",
			paper: "#252526"
		},
		primary: {
			main: "#007acc"
		},
		secondary: {
			main: "#d4d4d4"
		},
	},
	typography: {
		fontFamily: "Consolas, monospace"
	}
});