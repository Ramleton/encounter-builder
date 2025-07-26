import { HowToReg, Login, Visibility, VisibilityOff } from "@mui/icons-material";
import { Alert, Box, Button, CircularProgress, Divider, IconButton, InputAdornment, Stack, Tab, Tabs, TextField, Tooltip, Typography } from "@mui/material";
import { useEffect, useState } from "react";
import { FaDiscord } from "react-icons/fa";
import { useAuth } from "../context/AuthContext";
import { LoginRequest, OAuthProvider, RegisterRequest } from "../types/auth";

interface FormData {
	username: string;
	email: string;
	password: string;
	confirmPassword: string;
}

type ActiveTab = 'login' | 'register';

function AuthForm() {
	const [activeTab, setActiveTab] = useState<ActiveTab>('login');
	const [formData, setFormData] = useState<FormData>({
		username: '',
		email: '',
		password: '',
		confirmPassword: ''
	});
	const [showPassword, setShowPassword] = useState<boolean>(false);
	const [showConfirmPassword, setShowConfirmPassword] = useState<boolean>(false);
	const [validationErrors, setValidationErrors] = useState<string[]>([]);
	const [emailVerificationSent, setEmailVerificationSent] = useState<string>("");

	const {
		user,
		isAuthenticated,
		isLoading,
		error,
		loginWithDiscord,
		loginWithEmail,
		registerWithEmail,
		logout,
		clearError
	} = useAuth();
	
	useEffect(() => {
		setEmailVerificationSent("");
	}, [isAuthenticated]);

	const handleTabChange = (_: any, newValue: 'login' | 'register') => {
		setActiveTab(newValue);
		setValidationErrors([]);
		clearError();
	};

	const handleInputChange = (field: string) => (event: React.ChangeEvent<HTMLInputElement>) => {
		setFormData(prev => ({
			...prev,
			[field]: event.target.value
		}));
		setValidationErrors([]);
		clearError();
	};

	const validateForm = (): boolean => {
		const errors: string[] = [];

		if (activeTab === 'register') {
			if (!formData.username.trim()) {
				errors.push('Username is required');
			} else if (formData.username.length < 3) {
				errors.push('Username must be at least 3 characters');
			}

			if (formData.password !== formData.confirmPassword) {
				errors.push('Passwords do not match');
			}
		}

		if (!formData.email.trim()) {
			errors.push('Email is required');
		} else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
			errors.push('Please enter a valid email address');
		}

		if (!formData.password.trim()) {
			errors.push('Password is required');
		} else if (formData.password.length < 6) {
			errors.push('Password must be at least 6 characters');
		}

		setValidationErrors(errors);
		return errors.length === 0;
	};

	const handleEmailAuth = async () => {
		if (!validateForm()) return;

		try {
			if (activeTab === 'login') {
				const loginRequest: LoginRequest = {
					email: formData.email,
					password: formData.password
				};
				await loginWithEmail(loginRequest);
			} else {
				const registerRequest: RegisterRequest = {
					username: formData.username,
					email: formData.email,
					password: formData.password
				};
				const res = await registerWithEmail(registerRequest);

				if (res.status === "pending-verification") {
					setEmailVerificationSent(res.email);
					return;
				}
			}
		} catch (error: any) {
			console.error(`${activeTab} failed`, error);
		}
	};

	const handleOAuthLogin = async (provider: OAuthProvider) => {
		try {
			clearError();
			// TODO: Add more providers
			if (provider === 'discord') {
				await loginWithDiscord();
			}
		} catch (error: any) {
			console.error(`${provider} login failed:`, error);
		}
	};

	const handleLogout = async () => {
		try {
			await logout();
			setFormData({
				username: '',
				email: '',
				password: '',
				confirmPassword: ''
			});
		} catch (error: any) {
			console.error("Logout failed:", error);
		}
	};

	if (isAuthenticated && user) {
		return (
			<Box sx={{
				display: 'flex',
				flexDirection: 'column',
				justifyContent: 'center',
				alignItems: 'center',
				minHeight: '60vh'
			}}>
				<Typography variant="h2" component="h1" gutterBottom textAlign="center">
					Welcome!
				</Typography>

				<Alert severity="success" sx={{ mb: 2, width: '100%', maxWidth: 400 }}>
					Logged in as {user.username}
				</Alert>

				<Button
					variant="outlined"
					onClick={handleLogout}
					disabled={isLoading}
				>
					{isLoading ? <CircularProgress size={20} /> : 'Logout'}
				</Button>
			</Box>
		);
	}

	return (
		<Box sx={{
			display: 'flex',
			flexDirection: 'column',
			justifyContent: 'center',
			alignItems: 'center',
			minHeight: '60vh'
		}}>
			<Typography variant="h2" component="h1" gutterBottom textAlign="center">
				EncounterArchitect
			</Typography>

			<Box sx={{
				width: '100%',
				maxWidth: 400
			}}>
				<Tabs
					value={activeTab}
					onChange={handleTabChange}
					centered
					sx={{ mb: 3 }}
				>
					<Tab label="Login" value="login" />
					<Tab label="Register" value="register" />
				</Tabs>
				{(error || validationErrors.length > 0) && (
					<Alert 
						severity="error" 
						sx={{ mb: 2 }}
						onClose={() => {
							clearError();
							setValidationErrors([]);
						}}
					>
						{error && <div>{error}</div>}
						{validationErrors.map((err, index) => (
							<div key={index}>{err}</div>
						))}
					</Alert>
				)}

				{isLoading && !error && validationErrors.length === 0 && (
					<Alert severity="info" sx={{ mb: 2 }}>
						{activeTab === 'login' ? 'Logging in...' : 'Creating account...'}
					</Alert>
				)}

				<Stack spacing={2}>
					{emailVerificationSent && (
						<Alert severity="info" sx={{ mb: 2 }}>
							A verification link has been sent to {emailVerificationSent}. Please
							check your inbox and verify your email to continue.
						</Alert>
					)}
					{activeTab === 'register' && (
						<TextField
							required
							label="Username"
							variant="outlined"
							type="text"
							value={formData.username}
							onChange={handleInputChange('username')}
							disabled={isLoading}
							error={validationErrors.some(err => err.includes('Username'))}
						/>
					)}
					
					<TextField
						required
						label="Email"
						variant="outlined"
						type="email"
						value={formData.email}
						onChange={handleInputChange('email')}
						disabled={isLoading}
						error={validationErrors.some(err => err.includes('email'))}
					/>
					
					<TextField
						required
						label="Password"
						variant="outlined"
						type={showPassword ? 'text' : 'password'}
						value={formData.password}
						onChange={handleInputChange('password')}
						disabled={isLoading}
						error={validationErrors.some(err => err.includes('Password'))}
						slotProps={{
							input: {
								endAdornment: (
									<InputAdornment position="end">
										<IconButton
											onClick={() => setShowPassword(!showPassword)}
											edge="end"
										>
											{showPassword ? <VisibilityOff /> : <Visibility />}
										</IconButton>
									</InputAdornment>
								)
							}
						}}
					/>

					{activeTab === 'register' && (
						<TextField
							required
							label="Confirm Password"
							variant="outlined"
							type={showConfirmPassword ? 'text' : 'password'}
							value={formData.confirmPassword}
							onChange={handleInputChange('confirmPassword')}
							disabled={isLoading}
							error={validationErrors.some(err => err.includes('match'))}
							slotProps={{
								input: {
									endAdornment: (
										<InputAdornment position="end">
											<IconButton
												onClick={() => setShowConfirmPassword(!showPassword)}
												edge="end"
											>
												{showPassword ? <VisibilityOff /> : <Visibility />}
											</IconButton>
										</InputAdornment>
									)
								}
							}}
						/>
					)}

					<Button 
						variant="contained" 
						size="large"
						onClick={handleEmailAuth}
						disabled={isLoading}
						startIcon={isLoading ? <CircularProgress size={20} /> : (activeTab === 'register' ? <HowToReg /> : <Login />)}
					>
						{activeTab === 'register' ? 'Create Account' : 'Sign In'}
					</Button>

					<Divider sx={{ my: 2 }}>OR</Divider>

					<Stack direction="row" spacing={2} justifyContent="center">
						<Tooltip title="Sign in with Discord">
							<IconButton
								aria-label="discord login"
								color="primary"
								onClick={() => handleOAuthLogin('discord')}
								disabled={isLoading}
								sx={{ 
									border: '1px solid',
									borderColor: 'secondary.main',
									'&:hover': { backgroundColor: 'secondary.main', color: 'white' }
								}}
							>
								{isLoading ? <CircularProgress size={24} /> : <FaDiscord />}
							</IconButton>
						</Tooltip>
					</Stack>
				</Stack>
			</Box>
		</Box>
	)
}

export default AuthForm;