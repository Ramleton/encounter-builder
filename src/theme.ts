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

export const statBlockViewTheme = createTheme({
	palette: {
		mode: "dark",
		background: {
			default: "#3a3528",
		},
		primary: {
			main: "#d4c5a0",
			contrastText: "#a59a7eff"
		},
		secondary: {
			main: "#4a4235"
		}
	}
});