use serde_json::json;
use std::{collections::HashMap, fs};
use tauri::Manager;

use crate::{
    types::auth_types::{AuthResponse, LoginRequest, RegisterRequest, SupabaseAuthResponse},
    utils::supabase_util::init_supabase,
};

#[tauri::command]
pub async fn register_with_email(
    register_request: RegisterRequest,
) -> Result<AuthResponse, String> {
    let config = init_supabase().await?;
    let client = reqwest::Client::new();

    let body = json!({
        "email": register_request.email,
        "password": register_request.password,
        "data": {
            "username": register_request.username,
            "display_name": register_request.username
        }
    });

    println!("Registering with: {:?}", body);

    let response = client
        .post(&format!("{}/auth/v1/signup", config.url))
        .header("apikey", &config.anon_key)
        .header("Content-Type", "application/json")
        .json(&body)
        .send()
        .await
        .map_err(|e| format!("Request failed: {}", e))?;

    if !response.status().is_success() {
        let error_text = response
            .text()
            .await
            .unwrap_or_else(|_| "Unknown error".to_string());
        return Err(format!("Registration failed: {}", error_text));
    }

    let supabase_response: SupabaseAuthResponse = response
        .json()
        .await
        .map_err(|e| format!("Failed to parse response: {}", e))?;

    let auth_response = convert_supabase_response(supabase_response);

    println!("Received response: {:?}", auth_response);
    Ok(auth_response)
}

#[tauri::command]
pub async fn login_with_email(login_request: LoginRequest) -> Result<AuthResponse, String> {
    let config = init_supabase().await?;
    let client = reqwest::Client::new();

    let body = json!({
        "email": login_request.email,
        "password": login_request.password
    });

    let response = client
        .post(&format!("{}/auth/v1/token?grant_type=password", config.url))
        .header("apikey", &config.anon_key)
        .header("Content-Type", "application/json")
        .json(&body)
        .send()
        .await
        .map_err(|e| format!("Request failed: {}", e))?;

    if !response.status().is_success() {
        let error_text = response
            .text()
            .await
            .unwrap_or_else(|_| "Unknown error".to_string());
        return Err(format!("Login failed: {}", error_text));
    }

    let supabase_response: SupabaseAuthResponse = response
        .json()
        .await
        .map_err(|e| format!("Failed to parse response: {}", e))?;

    let auth_response = convert_supabase_response(supabase_response);

    Ok(auth_response)
}

#[tauri::command]
pub async fn login_with_discord() -> Result<String, String> {
    let config = init_supabase().await?;

    let redirect_uri = "encounterarchitect://oauth";

    let discord_oauth_url = format!(
        "{}/auth/v1/authorize?provider=discord&redirect_to={}",
        config.url,
        urlencoding::encode(redirect_uri)
    );

    Ok(discord_oauth_url)
}

#[tauri::command]
pub async fn handle_discord_oauth_callback(
    code: String,
    state: String,
) -> Result<AuthResponse, String> {
    let config = init_supabase().await?;
    let client = reqwest::Client::new();

    let mut body = HashMap::new();
    body.insert("auth_code", code);
    body.insert("code_verifier", state);

    let response = client
        .post(&format!(
            "{}/auth/v1/token?grant_type=authorization_code",
            config.url
        ))
        .header("apikey", &config.anon_key)
        .header("Content-Type", "application/json")
        .json(&body)
        .send()
        .await
        .map_err(|e| format!("Request failed: {}", e))?;

    let supabase_response: SupabaseAuthResponse = response
        .json()
        .await
        .map_err(|e| format!("Failed to parse response: {}", e))?;

    let auth_response = convert_supabase_response(supabase_response);

    Ok(auth_response)
}

#[tauri::command]
pub async fn get_current_user(access_token: String) -> Result<serde_json::Value, String> {
    let config = init_supabase().await?;
    let client = reqwest::Client::new();

    let response = client
        .get(&format!("{}/auth/v1/user", config.url))
        .header("apikey", &config.anon_key)
        .header("Authorization", format!("Bearer {}", access_token))
        .send()
        .await
        .map_err(|e| format!("Request failed: {}", e))?;

    let user: serde_json::Value = response
        .json()
        .await
        .map_err(|e| format!("Failed to parse response: {}", e))?;

    Ok(user)
}

#[tauri::command]
pub async fn logout_user(access_token: String) -> Result<(), String> {
    let config = init_supabase().await?;
    let client = reqwest::Client::new();

    let _response = client
        .post(&format!("{}/auth/v1/logout", config.url))
        .header("apikey", &config.anon_key)
        .header("Authorization", format!("Bearer {}", access_token))
        .send()
        .await
        .map_err(|e| format!("Request failed: {}", e))?;

    Ok(())
}

#[tauri::command]
pub async fn store_value(app: tauri::AppHandle, key: String, value: String) -> Result<(), String> {
    let app_dir = app
        .path()
        .app_data_dir()
        .map_err(|e| format!("Failed to get app data dir: {}", e))?;

    fs::create_dir_all(&app_dir).map_err(|e| format!("Failed to create app data dir: {}", e))?;

    let file_path = app_dir.join(format!("{}.txt", key));

    fs::write(file_path, value).map_err(|e| format!("Failed to write to storage: {}", e))?;

    Ok(())
}

#[tauri::command]
pub async fn get_stored_value(app: tauri::AppHandle, key: String) -> Result<String, String> {
    let app_dir = app
        .path()
        .app_data_dir()
        .map_err(|e| format!("Failed to get app data dir: {}", e))?;

    let file_path = app_dir.join(format!("{}.txt", key));

    if !file_path.exists() {
        return Err(format!("Key not found: {}", key));
    }

    let value =
        fs::read_to_string(file_path).map_err(|e| format!("Failed to read from storage: {}", e))?;

    Ok(value)
}

#[tauri::command]
pub async fn remove_stored_value(app: tauri::AppHandle, key: String) -> Result<(), String> {
    let app_dir = app
        .path()
        .app_data_dir()
        .map_err(|e| format!("Failed to get app data dir: {}", e))?;

    let file_path = app_dir.join(format!("{}.txt", key));

    if !file_path.exists() {
        return Err(format!("Key not found: {}", key));
    }

    fs::remove_file(file_path).map_err(|e| format!("Failed to remove from storage: {}", e))?;

    Ok(())
}

#[tauri::command]
pub async fn refresh_access_token(refresh_token: String) -> Result<AuthResponse, String> {
    let config = init_supabase().await?;
    let client = reqwest::Client::new();

    let body = json!({
        "refresh_token": refresh_token
    });

    let response = client
        .post(&format!(
            "{}/auth/v1/token?grant_type=refresh_token",
            config.url
        ))
        .header("apikey", &config.anon_key)
        .header("Content-Type", "application/json")
        .json(&body)
        .send()
        .await
        .map_err(|e| format!("Request failed: {}", e))?;

    if !response.status().is_success() {
        let error_text = response
            .text()
            .await
            .unwrap_or_else(|_| "Token refresh failed".to_string());
        return Err(format!("Token refresh failed: {}", error_text));
    }

    let supabase_response: SupabaseAuthResponse = response
        .json()
        .await
        .map_err(|e| format!("Failed to parse response: {}", e))?;

    let auth_response = convert_supabase_response(supabase_response);

    Ok(auth_response)
}

fn convert_supabase_response(supabase_response: SupabaseAuthResponse) -> AuthResponse {
    let user = if let Some(user_data) = supabase_response.user {
        Some(crate::types::auth_types::User {
            uuid: user_data
                .get("id")
                .and_then(|v| v.as_str())
                .unwrap_or_default()
                .to_string(),
            email: user_data
                .get("email")
                .and_then(|v| v.as_str())
                .unwrap_or_default()
                .to_string(),
            username: user_data
                .get("user_metadata")
                .and_then(|m| m.get("full name"))
                .and_then(|v| v.as_str())
                .unwrap_or_default()
                .to_string(),
            avatar_url: user_data
                .get("user_metadata")
                .and_then(|m| m.get("avatar_url"))
                .and_then(|v| v.as_str())
                .unwrap_or_default()
                .to_string(),
        })
    } else {
        None
    };

    AuthResponse {
        access_token: supabase_response.access_token,
        refresh_token: supabase_response.refresh_token,
        expires_in: supabase_response.expires_in,
        expires_at: supabase_response.expires_at,
        token_type: supabase_response.token_type,
        user,
        error: supabase_response
            .error
            .or(supabase_response.error_description),
    }
}
