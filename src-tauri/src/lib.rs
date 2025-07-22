mod types;
use types::Encounter;

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

#[tauri::command]
fn load_encounters() -> Result<Vec<Encounter>, String> {
    let folder = PathBuf::from("../encounters/");

    if !folder.exists() {
        return Ok(vec![]);
    }

    let mut encounters = Vec::new();

    for entry in fs::read_dir(folder).map_err(|e| e.to_string())? {
        let entry = entry.map_err(|e| e.to_string())?;
        let path = entry.path();

        if path.extension().map_or(false, |ext| ext == "json") {
            let content = fs::read_to_string(&path).map_err(|e| e.to_string())?;
            let encounter: Encounter = serde_json::from_str(&content).map_err(|e| e.to_string())?;
            encounters.push(encounter);
        }
    }

    Ok(encounters)
}

#[cfg_attr(mobile, tauri::mobile_entry_point)]
pub fn run() {
    tauri::Builder::default()
        .plugin(tauri_plugin_opener::init())
        .invoke_handler(tauri::generate_handler![save_encounter, load_encounters])
        .run(tauri::generate_context!())
        .expect("error while running tauri application");
}
