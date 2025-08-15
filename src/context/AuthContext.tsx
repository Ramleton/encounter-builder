import { invoke } from "@tauri-apps/api/core";
import { listen } from "@tauri-apps/api/event";
import { createContext, FC, ReactNode, useContext, useEffect, useState } from "react";
import { AuthResponse, LoginRequest, RegisterRequest, RegisterResult, User } from "../types/auth";

interface AuthContextType {
	user: User | null;
	isAuthenticated: boolean;
	isLoading: boolean;
	error: string;
	loginWithDiscord: () => Promise<void>;
	loginWithEmail: (loginRequest: LoginRequest) => Promise<void>;
	registerWithEmail: (registerRequest: RegisterRequest) => Promise<RegisterResult>;
	logout: () => Promise<void>;
	getAccessToken: () => Promise<string>;
	clearError: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

interface AuthProviderProps {
	children: ReactNode;
}

export const AuthProvider: FC<AuthProviderProps> = ({ children }) => {
	const [user, setUser] = useState<User | null>(null);
	const [isLoading, setIsLoading] = useState<boolean>(true);
	const [error, setError] = useState<string>("");
	const [oauthPromise, setOAuthPromise] = useState<{
		resolve: (user: User) => void;
		reject: (error: Error) => void;
	} | null>(null);
	const [tokenRefreshTimer, setTokenRefreshTimer] = useState<number | null>(null);

	// Clear timer on unmount
	useEffect(() => {
		return () => {
			if (tokenRefreshTimer) {
				clearTimeout(tokenRefreshTimer);
			}
		};
	}, [tokenRefreshTimer]);

	// Load stored authentication data on mount
	useEffect(() => {
		loadStoredAuth();
		setupOAuthListener();
	}, []);

		const scheduleTokenRefresh = (expiresIn: number) => {
		// Clear existing timer
		if (tokenRefreshTimer) {
			clearTimeout(tokenRefreshTimer);
		}

		const refreshTime = Math.max(0, (expiresIn - 300) * 1000);

		const timer = setTimeout(async () => {
			await refreshTokens();
		}, refreshTime);

		setTokenRefreshTimer(timer);
	}

	const refreshTokens = async (): Promise<void> => {
		try {
			console.log("Refreshing access token...");

			const refreshToken = await invoke<string>("get_stored_value", { key: "refresh_token" });

			if (!refreshToken) {
				throw new Error("No refresh token available");
			}

			const response: AuthResponse = await invoke('refresh_access_token', {
				refreshToken
			});

			if (response.error) {
				throw new Error(response.error);
			}

			if (response.access_token) {
				await invoke('store_value', { key: 'access_token', value: response.access_token});

				if (response.refresh_token) {
					await invoke('store_value', { key: 'refresh_token', value: response.refresh_token});
				}

				scheduleTokenRefresh(3000);

				console.log('Access token refreshed successfully');
			}
		} catch (error) {
			console.error("Token refresh failed:", error);
			await logout();
		}
	}

	const loadStoredAuth = async () => {
		try {
			setIsLoading(true);
			const accessToken = await invoke<string>('get_stored_value', { key: 'access_token' });
			const userStr = await invoke<string>('get_stored_value', { key: 'user' });
			
			if (accessToken && userStr) {
				
				// Verify the token is still valid by getting current user
				try {
					const currentUser = await getCurrentUser(accessToken);
					if (currentUser) {
						setUser(currentUser);
					} else {
						// Token invalid, clear storage
						await clearStoredAuth();
					}
				} catch (err) {
					console.warn('Stored token invalid, clearing auth data');
					await clearStoredAuth();
				}
			}
		} catch (err) {
			console.log('No stored auth data found');
		} finally {
			setIsLoading(false);
		}
	};

	const setupOAuthListener = async () => {
		try {
			const unlisten = await listen<any>('oauth-success', async (event) => {
				console.log('Received OAuth success event:', event.payload);
				await handleOAuthSuccess();
			});
			
			// Store unlisten function for cleanup if needed
			return unlisten;
		} catch (error) {
			console.error('Failed to setup OAuth listener:', error);
		}
	};

	const handleOAuthSuccess = async () => {
		try {
			console.log('Handling OAuth success...');
			setIsLoading(true);
			setError("");
			
			// Reload tokens from storage after successful OAuth
			const accessToken = await invoke<string>('get_stored_value', { key: 'access_token' });
			
			if (accessToken) {
				console.log('Access token found, getting user info...');
				
				// Get user info
				const currentUser = await getCurrentUser(accessToken);
				console.log('User info retrieved:', currentUser);
				
				if (currentUser) {
					setUser(currentUser);
					
					// Resolve the OAuth promise if it exists
					if (oauthPromise) {
						oauthPromise.resolve(currentUser);
						setOAuthPromise(null);
					}
				} else {
					throw new Error('Failed to get user info after OAuth');
				}
			} else {
				throw new Error('No access token found after OAuth success');
			}
		} catch (error) {
			console.error('Failed to handle OAuth success:', error);
			const errorMessage = error instanceof Error ? error.message : 'OAuth authentication failed';
			setError(errorMessage);
			
			// Reject the OAuth promise if it exists
			if (oauthPromise) {
				oauthPromise.reject(new Error(errorMessage));
				setOAuthPromise(null);
			}
		} finally {
			setIsLoading(false);
		}
	};

	const getCurrentUser = async (accessToken: string): Promise<User | null> => {
		try {
			const res = await invoke<any>('get_current_user', {
				accessToken
			});

			console.log(res);

			const user = {
				uuid: res.id,
				email: res.email,
				username: res.user_metadata.full_name,
				avatarUrl: res.user_metadata.avatar_url || ""
			};
			
			// Store updated user info
			await invoke('store_value', { key: 'user', value: JSON.stringify(user) });
			
			return user;
		} catch (error) {
			console.error('Failed to get current user:', error);
			return null;
		}
	};

	const clearStoredAuth = async () => {
		try {
			await invoke('remove_stored_value', { key: 'access_token' });
			await invoke('remove_stored_value', { key: 'refresh_token' });
			await invoke('remove_stored_value', { key: 'user' });
		} catch (error) {
			console.error('Failed to clear stored auth:', error);
		}
	};

	const saveTokensToStorage = async (response: AuthResponse) => {
		try {
			if (response.access_token) {
				await invoke('store_value', { key: 'access_token', value: response.access_token });
			}
			if (response.refresh_token) {
				await invoke('store_value', { key: 'refresh_token', value: response.refresh_token });
			}
			if (response.user) {
				await invoke('store_value', { key: 'user', value: JSON.stringify(response.user) });

				const user: User = {
					uuid: response.user.uuid,
					username: response.user.username,
					email: response.user.email,
					avatarUrl: response.user.avatarUrl
				};

				setUser(user);
			}
		} catch (error) {
			console.error('Failed to save auth tokens:', error);
			throw new Error('Failed to save authentication data');
		}
	};

	const getAccessToken = async () => {
		return await invoke<string>("get_stored_value", { key: "access_token" });
	}

	const loginWithEmail = async (loginRequest: LoginRequest): Promise<void> => {
		try {
			setIsLoading(true);
			setError("");
			
			const response: AuthResponse = await invoke('login_with_email', { loginRequest });

			if (response.error) {
				throw new Error(response.error);
			}

			await saveTokensToStorage(response);
		} catch (error) {
			const errorMessage = error instanceof Error ? error.message : 'Login failed';
			setError(errorMessage);
			console.error('Email login failed:', error);
			throw new Error(errorMessage);
		} finally {
			setIsLoading(false);
		}
	}

	const registerWithEmail = async (registerRequest: RegisterRequest): Promise<RegisterResult> => {
		try {
			setIsLoading(true);
			setError("");

			const response: AuthResponse = await invoke('register_with_email', { registerRequest });

			if (response.error) {
				throw new Error(response.error);
			}

			if (!response.access_token && !response.error) {
				// Email confirmation required - no session returned
				return {
					status: "pending-verification",
					email: registerRequest.email
				}
			}

			if (response.access_token && response.user) {
				await saveTokensToStorage(response);
				return {
					status: "registered",
					user: {
						uuid: response.user.uuid,
						username: response.user.username,
						email: response.user.email,
						avatarUrl: response.user.avatarUrl
					}
				};
			}

			throw new Error("Unknown registration result");
		} catch (error) {
			const errorMessage = error instanceof Error ? error.message : 'Registration failed';
			setError(errorMessage);
			console.error('Email registration failed:', error);
			throw new Error(errorMessage);
		} finally {
			setIsLoading(false);
		}
	};

	const loginWithDiscord = async (): Promise<void> => {
		try {
			setIsLoading(true);
			setError("");

			const oauthUrl = await invoke<string>('login_with_discord');
			await invoke('open_url', { url: oauthUrl });

			// Create a promise that will be resolved when OAuth completes
			return new Promise<void>((resolve, reject) => {
				const timeout = setTimeout(() => {
					setOAuthPromise(null);
					setIsLoading(false);
					reject(new Error('OAuth timeout - Please try again.'));
				}, 120000); // 2 minute timeout

				setOAuthPromise({
					resolve: (_user: User) => {
						clearTimeout(timeout);
						setIsLoading(false);
						resolve();
					},
					reject: (error: Error) => {
						clearTimeout(timeout);
						setIsLoading(false);
						reject(error);
					}
				});
			});
		} catch (error) {
			setIsLoading(false);
			const errorMessage = error instanceof Error ? error.message : 'Discord login failed';
			setError(errorMessage);
			console.error('Discord login failed:', error);
			throw new Error(errorMessage);
		}
	};

	const logout = async (): Promise<void> => {
		try {
			setIsLoading(true);
			setError("");

			const accessToken = await invoke<string>('get_stored_value', { key: 'access_token' });
			
			if (accessToken) {
				try {
					await invoke('logout_user', { accessToken });
				} catch (error) {
					console.error('Backend logout failed:', error);
					// Continue with local logout even if backend fails
				}
			}

			await clearStoredAuth();
			setUser(null);
		} catch (error) {
			const errorMessage = error instanceof Error ? error.message : 'Logout failed';
			setError(errorMessage);
			console.error('Logout failed:', error);
			throw new Error(errorMessage);
		} finally {
			setIsLoading(false);
		}
	};

	const clearError = () => {
		setError("");
	};

	const value: AuthContextType = {
		user,
		isAuthenticated: !!user,
		isLoading,
		error,
		loginWithDiscord,
		loginWithEmail,
		registerWithEmail,
		logout,
		getAccessToken,
		clearError
	};

	return (
		<AuthContext.Provider value={value}>
			{children}
		</AuthContext.Provider>
	);
};

export const useAuth = (): AuthContextType => {
	const context = useContext(AuthContext);
	if (!context) {
		throw new Error("useAuth must be used within an AuthProvider");
	}
	return context;
}