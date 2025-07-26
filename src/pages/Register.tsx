import { HowToReg } from "@mui/icons-material";
import Login from "@mui/icons-material/Login";
import { Alert, Box, Button, CircularProgress, IconButton, Stack, TextField, Tooltip, Typography } from "@mui/material";
import { useState } from "react";
import { FaDiscord } from "react-icons/fa";
import { useAuth } from "../context/AuthContext";

function Register() {
	const [username, setUsername] = useState<string>("");
	const [email, setEmail] = useState<string>("");
	const [password, setPassword] = useState<string>("");

	const {
		user,
		isAuthenticated,
		isLoading,
		error,
		loginWithDiscord,
		logout,
		clearError
	} = useAuth();

	const handleDiscordLogin = async () => {
		try {
			clearError();
			await loginWithDiscord();
		} catch (error) {
			console.error("Discord login failed:", error);
		}
	};

	const handleLogout = async () => {
		try {
			await logout();
		} catch (error) {
			console.error("Logout failed:", error);
		}
	}

	if (isAuthenticated && user) {
		return (
			<Box sx={{
				display: 'flex',
				flexDirection: 'column',
				justifyContent: 'center',
				alignItems: 'center'
			}}>
				<Typography variant="h2" component="h1" gutterBottom textAlign="center">
					Welcome!
				</Typography>

				<Alert severity="success" sx={{ mb: 2, width: '100%', maxWidth: 400 }}>
					Logged in as {user.email}
				</Alert>

				<Button variant="outlined" onClick={handleLogout} disabled={isLoading}>
					{isLoading ? <CircularProgress size={20} /> : "Logout"}
				</Button>
			</Box>
		)
	}

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
			
			{error && (
				<Alert
					severity="error"
					sx={{ mb: 2, width: '100%', maxWidth: 400 }}
					onClose={clearError}
				>
					{error}
				</Alert>
			)}

			{isLoading && !error && (
				<Alert severity="info" sx={{ mb: 2, width: '100%', maxWidth: 400 }}>
					{isLoading ? "Authenticating..." : "Please complete authentication in your browser."}
				</Alert>
			)}
			<Stack spacing={2} sx={{ mt: 2 }}>
				<TextField
					required
					label="Username"
					variant="standard"
					type="text"
					onChange={(e) => setUsername(e.target.value)}
				/>
				<TextField
					required
					label="Email"
					variant="standard"
					type="email"
					onChange={(e) => setEmail(e.target.value)}
				/>
				<TextField
					required
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
					<IconButton
						loading={isLoading}
						aria-label="discord login"
						color="secondary"
						onClick={handleDiscordLogin}>
						{ isLoading ? <CircularProgress size={24} /> : <FaDiscord /> }
					</IconButton>
				</Tooltip>
			</Stack>
		</Box>
	)
}

export default Register;