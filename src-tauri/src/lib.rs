mod types;
use types::{Encounter, StatBlock};

use std::fs;
use std::path::PathBuf;

#[tauri::command]
fn save_encounter(encounter: Encounter) -> Result<String, String> {
    // Determine path to save encounter
    let path = PathBuf::from(format!("../encounters/{}.json", encounter.name));
    fs::create_dir_all(path.parent().unwrap()).map_err(|e| e.to_string())?;

    let json = serde_json::to_string_pretty(&encounter).map_err(|e| e.to_string())?;
    fs::write(&path, json).map_err(|e| e.to_string())?;

    Ok(format!("Encounter saved at {:?}", path))
}

#[cfg_attr(mobile, tauri::mobile_entry_point)]
pub fn run() {
    tauri::Builder::default()
        .plugin(tauri_plugin_opener::init())
        .invoke_handler(tauri::generate_handler![save_encounter])
        .run(tauri::generate_context!())
        .expect("error while running tauri application");
}
