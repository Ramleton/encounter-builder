export interface User {
	email: string;
	username: string;
	avatarUrl: string;
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