import { invoke } from "@tauri-apps/api/core";

export interface User {
	id: string;
	email: string;
	user_metadata?: any;
	app_metadata?: any;
}

export interface AuthResponse {
	access_token?: string;
	refresh_token?: string;
	user?: User;
	error?: string;
}

export interface LoginRequest {
	email: string;
	password: string;
}

export interface RegisterRequest {
	username: string;
	email: string;
	password: string;
}

class AuthService {
	private accessToken: string | null = null;
	private refreshToken: string | null = null;
	private user: User | null = null;

	constructor() {
		this.loadTokensFromStorage();
	}

	private async loadTokensFromStorage() {
		try {
			this.accessToken = await invoke('get_stored_value', { key: 'access_token'}) as string | null;
			this.refreshToken = await invoke('get_stored_value', { key: 'refresh_token'}) as string | null;
			const userStr = await invoke('get_stored_value', { key: 'user'}) as string | null;
			if (userStr) {
				this.user = JSON.parse(userStr) as User;
			}
		} catch (error) {
			console.log('No stored auth data found');
		}
	}

	private async saveTokensToStorage(response: AuthResponse) {
		try {
			if (response.access_token) {
				await invoke('store_value', { key: 'access_token', value: response.access_token });
				this.accessToken = response.access_token;
			}
			if (response.refresh_token) {
				await invoke('store_value', { key: 'refresh_token', value: response.refresh_token });
				this.refreshToken = response.refresh_token;
			}
			if (response.user) {
				await invoke('store_value', { key: 'user', value: JSON.stringify(response.user) });
				this.user = response.user;
			}
		} catch (error) {
			console.error('Failed to save access token:', error);
		}
	}

	private async clearTokensFromStorage() {
		try {
			await invoke('remove_stored_value', { key: 'access_token' });
			await invoke('remove_stored_value', { key: 'refresh_token' });
			await invoke('remove_stored_value', { key: 'user' });
		} catch (error) {
			console.error('Failed to clear tokens from storage:', error);
		}
		this.accessToken = null;
		this.refreshToken = null;
		this.user = null;
	}

	async loginWithDiscord(): Promise<void> {
		try {
			const oauthUrl = await invoke<string>('login_with_discord');
			await open(oauthUrl);
		} catch (error) {
			console.error('Discord login failed:', error);
			throw error;
		}
	}

	async handleOAuthCallback(code: string, state: string): Promise<AuthResponse> {
		try {
			const response: AuthResponse = await invoke('handle_discord_oauth_callback', { code, state });
			
			if (response.error) {
				throw new Error(response.error);
			}
			
			this.saveTokensToStorage(response);
			return response;
		} catch (error) {
			console.error('OAuth callback handling failed:', error);
			throw error;
		}
	}

	async getCurrentUser(): Promise<User | null> {
		if (!this.accessToken) {
			return null;
		}

		try {
			const user: User = await invoke('get_current_user', {
				accessToken: this.accessToken
			});
			this.user = user;
			return user;
		} catch (error) {
			console.error('Failed to get current user:', error);
			this.clearTokensFromStorage();
			return null;
		}
	}

	async logout(): Promise<void> {
		if (this.accessToken) {
			try {
				await invoke('logout_user', { accessToken: this.accessToken });
			} catch (error) {
				console.error('Logout failed:', error);
			}
		}

		this.clearTokensFromStorage();
	}

	isAuthenticated(): boolean {
		return !!this.accessToken && !!this.user;
	}

	getUser(): User | null {
		return this.user;
	}

	getAccessToken(): string | null {
		return this.accessToken;
	}
}

export const authService = new AuthService();