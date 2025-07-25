import { HowToReg } from "@mui/icons-material";
import Login from "@mui/icons-material/Login";
import { Box, Button, IconButton, Stack, TextField, Tooltip, Typography } from "@mui/material";
import { useState } from "react";
import { FaDiscord } from "react-icons/fa";

function Register() {
	const [username, setUsername] = useState<string>("");
	const [email, setEmail] = useState<string>("");
	const [password, setPassword] = useState<string>("");

	return (
		<Box sx={{
			display: 'flex',
			flexDirection: 'column',
			justifyContent: 'center',
			alignItems: 'center'
		}}>
			<Typography variant="h2" component="h1" gutterBottom textAlign="center">
				Register
			</Typography>
			<Stack spacing={2} sx={{ mt: 2 }}>
				<TextField
					required
					id="standard-required"
					label="Username"
					variant="standard"
					type="text"
					onChange={(e) => setUsername(e.target.value)}
				/>
				<TextField
					required
					id="standard-required"
					label="Email"
					variant="standard"
					type="email"
					onChange={(e) => setEmail(e.target.value)}
				/>
				<TextField
					required
					id="standard-required"
					label="Password"
					variant="standard"
					type="password"
					onChange={(e) => setPassword(e.target.value)}
				/>
			</Stack>
			<Stack direction="row" spacing={2} sx={{ mt: 4 }}>
				<Button variant="contained" disabled={!username || !email || !password} startIcon={<HowToReg />}>
					Register
				</Button>
				<Button variant="contained" startIcon={<Login />}>
					Login
				</Button>
			</Stack>
			<Typography variant="h5" sx={{ mt: 2 }}>
				Or Login Using
			</Typography>
			<Stack direction="row" spacing={2} sx={{ mt: 1 }}>
				<Tooltip title="Discord">
					<IconButton aria-label="discord login" color="secondary" onClick={() => {

					}}>
						<FaDiscord />
					</IconButton>
				</Tooltip>
			</Stack>
		</Box>
	)
}

export default Register;