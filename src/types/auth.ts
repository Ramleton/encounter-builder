export interface User {
	uuid: string;
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

export type OAuthProvider = 'discord';

export type RegisterResult =
	| { status: "registered"; user: User }
	| { status: "pending-verification"; email: string }