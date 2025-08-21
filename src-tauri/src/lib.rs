mod database;
mod types;
mod utils;

use database::statblock_db::{delete_statblock, save_statblock};
use tauri::{Emitter, Manager};
#[cfg(desktop)]
use tauri_plugin_deep_link::DeepLinkExt;
use utils::fs_utils::{load_encounters, load_statblocks};

use utils::auth_utils::{
    get_current_user, get_stored_value, handle_discord_oauth_callback, login_with_discord,
    login_with_email, logout_user, register_with_email, remove_stored_value, store_value,
};

use crate::database::encounter_db::{
    delete_encounter, fetch_encounter_players_for_encounter, fetch_encounters,
    fetch_playable_statblocks_for_encounter, save_encounter, save_encounter_players,
    save_playable_statblocks,
};
use crate::database::statblock_db::fetch_statblocks_with_joins;
use crate::utils::auth_utils::refresh_access_token;

#[tauri::command]
async fn open_url(url: &str) -> Result<(), String> {
    tauri_plugin_opener::open_url(&url, None::<&str>)
        .map_err(|e| format!("Failed to open URL: {}", e))?;

    Ok(())
}

#[cfg_attr(mobile, tauri::mobile_entry_point)]
pub fn run() {
    tauri::Builder::default()
        .plugin(tauri_plugin_opener::init())
        .plugin(tauri_plugin_deep_link::init())
        .plugin(tauri_plugin_single_instance::init(|app, args, _cwd| {
            for arg in args {
                if arg.starts_with("encounterarchitect://") {
                    if let Err(e) = handle_deep_link_url(app, &arg) {
                        eprintln!("Failed to handle deep link from second instance: {}", e);
                    }
                }
            }

            if let Some(window) = app.get_webview_window("main") {
                let _ = window.show();
                let _ = window.set_focus();
                let _ = window.unminimize();
            }
        }))
        .setup(|app| {
            if let Ok(Some(urls)) = app.deep_link().get_current() {
                println!("Current deep link URL: {:?}", urls);

                for url in urls {
                    if let Err(e) = handle_deep_link_url(app.handle(), &url.as_str()) {
                        eprintln!("Error handling deep link URL: {}", e);
                    }
                }
            };

            let handle = app.handle().clone();
            app.deep_link().on_open_url(move |event| {
                let urls = event.urls();
                println!("Received deep link URLs: {:?}", urls);
                for url in urls {
                    if let Err(e) = handle_deep_link_url(&handle, &url.as_str()) {
                        eprintln!("Failed to handle deep link: {}", e);
                    }
                }
            });

            Ok(())
        })
        .invoke_handler(tauri::generate_handler![
            save_encounter,
            fetch_encounters,
            save_encounter_players,
            fetch_encounter_players_for_encounter,
            save_playable_statblocks,
            fetch_playable_statblocks_for_encounter,
            load_encounters,
            delete_encounter,
            load_statblocks,
            get_current_user,
            logout_user,
            login_with_discord,
            handle_discord_oauth_callback,
            store_value,
            get_stored_value,
            remove_stored_value,
            open_url,
            register_with_email,
            login_with_email,
            refresh_access_token,
            save_statblock,
            delete_statblock,
            fetch_statblocks_with_joins,
        ])
        .run(tauri::generate_context!())
        .expect("error while running tauri application");
}

fn handle_deep_link_url(
    app_handle: &tauri::AppHandle,
    url: &str,
) -> Result<(), Box<dyn std::error::Error>> {
    use url::Url;

    let parsed_url = Url::parse(url)?;

    if parsed_url.scheme() == "encounterarchitect" && parsed_url.host_str() == Some("oauth") {
        if let Some(fragment) = parsed_url.fragment() {
            let fragment_url = Url::parse(&format!("http://localhost?{}", fragment))?;
            let query_pairs: std::collections::HashMap<_, _> = fragment_url.query_pairs().collect();

            if let Some(access_token) = query_pairs.get("access_token") {
                let access_token_str = access_token.to_string();
                let refresh_token_str = query_pairs
                    .get("refresh_token")
                    .map(|s| s.to_string())
                    .unwrap_or_default();

                let app_handle_clone = app_handle.clone();
                tauri::async_runtime::spawn(async move {
                    if let Err(e) = store_value(
                        app_handle_clone.clone(),
                        "access_token".to_string(),
                        access_token_str.clone(),
                    )
                    .await
                    {
                        eprintln!("Failed to store access token: {}", e);
                    } else {
                        println!("Successfully stored access token");
                    }

                    if !refresh_token_str.is_empty() {
                        if let Err(e) = store_value(
                            app_handle_clone.clone(),
                            "refresh_token".to_string(),
                            refresh_token_str.clone(),
                        )
                        .await
                        {
                            eprintln!("Failed to st ore refresh token: {}", e);
                        } else {
                            println!("Successfully stored refresh token");
                        }
                    }

                    match get_current_user(access_token_str).await {
                        Ok(user) => {
                            if let Err(e) = store_value(
                                app_handle_clone.clone(),
                                "user".to_string(),
                                user.to_string(),
                            )
                            .await
                            {
                                eprintln!("Failed to store user info: {}", e);
                            } else {
                                println!("Successfully stored user info");
                            }
                        }
                        Err(e) => {
                            eprintln!("Failed to get user info: {}", e);
                        }
                    }

                    if let Err(e) = app_handle_clone.emit(
                        "oauth-success",
                        serde_json::json!({
                           "message": "Successfully authenticated with Discord"
                        }),
                    ) {
                        eprintln!("Failed to emit oauth-success event: {}", e);
                    } else {
                        println!("Emitted oauth-success event");
                    }
                });

                if let Some(window) = app_handle.get_webview_window("main") {
                    let _ = window.show();
                    let _ = window.set_focus();

                    println!("Focused app window");
                }
            } else {
                println!("No access token found in deep link fragment");
            }
        } else {
            println!("No fragment found in OAuth deep link");
        }
    }

    Ok(())
}
