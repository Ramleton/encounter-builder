import { invoke } from "@tauri-apps/api/core";
import { listen } from "@tauri-apps/api/event";
import { createContext, FC, ReactNode, useContext, useEffect, useState } from "react";
import { User } from "../types/auth";

interface AuthContextType {
	user: User | null;
	isAuthenticated: boolean;
	isLoading: boolean;
	error: string;
	loginWithDiscord: () => Promise<void>;
	logout: () => Promise<void>;
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

	// Load stored authentication data on mount
	useEffect(() => {
		loadStoredAuth();
		setupOAuthListener();
	}, []);

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

			const user = {
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
		logout,
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