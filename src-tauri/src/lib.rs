mod types;
mod utils;

use types::encounter_types::Encounter;
use utils::fs_utils::load_data;

use utils::oauth_utils::{
    get_current_user, get_stored_value, handle_discord_oauth_callback, login_with_discord,
    logout_user, remove_stored_value, store_value,
};

use std::fs;
use std::path::PathBuf;

use types::statblock_types::StatBlock;

#[tauri::command]
fn save_encounter(encounter: Encounter) -> Result<String, String> {
    // Determine path to save encounter
    let path = PathBuf::from(format!("../encounters/{}.json", encounter.name));
    fs::create_dir_all(path.parent().unwrap()).map_err(|e| e.to_string())?;

    let json = serde_json::to_string_pretty(&encounter).map_err(|e| e.to_string())?;
    fs::write(&path, json).map_err(|e| e.to_string())?;

    Ok(format!("Encounter saved at {:?}", path))
}

#[tauri::command]
fn load_encounters() -> Result<Vec<Encounter>, String> {
    let encounters: Vec<Encounter> = load_data("encounters")?;
    Ok(encounters)
}

#[tauri::command]
fn load_statblocks() -> Result<Vec<StatBlock>, String> {
    let statblocks: Vec<StatBlock> = load_data("statblocks")?;
    Ok(statblocks)
}

#[tauri::command]
fn delete_encounter(encounter: Encounter) -> Result<String, String> {
    let path = PathBuf::from(format!("../encounters/{}.json", encounter.name));

    fs::remove_file(path).map_err(|e| e.to_string())?;

    Ok(String::from("Successfully deleted encounter"))
}

#[cfg_attr(mobile, tauri::mobile_entry_point)]
pub fn run() {
    tauri::Builder::default()
        .plugin(tauri_plugin_opener::init())
        .invoke_handler(tauri::generate_handler![
            save_encounter,
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
        ])
        .run(tauri::generate_context!())
        .expect("error while running tauri application");
}
