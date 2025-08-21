use std::{fs, path::PathBuf};

use serde::Deserialize;

use crate::types::{encounter_types::Encounter, statblock_types::StatBlock};

fn load_data<T: for<'de> Deserialize<'de>>(folder_name: &str) -> Result<Vec<T>, String> {
    let folder = PathBuf::from(format!("../{}", folder_name));

    if !folder.exists() {
        return Ok(vec![]);
    }

    let mut data = Vec::new();

    for entry in fs::read_dir(folder).map_err(|e| e.to_string())? {
        let entry = entry.map_err(|e| e.to_string())?;
        let path = entry.path();

        if path.extension().map_or(false, |ext| ext == "json") {
            let content = fs::read_to_string(&path).map_err(|e| e.to_string())?;
            let json: T = serde_json::from_str(&content).map_err(|e| e.to_string())?;
            data.push(json);
        }
    }

    Ok(data)
}

#[tauri::command]
pub fn load_encounters() -> Result<Vec<Encounter>, String> {
    let encounters: Vec<Encounter> = load_data("encounters")?;
    Ok(encounters)
}

#[tauri::command]
pub fn load_statblocks() -> Result<Vec<StatBlock>, String> {
    let statblocks: Vec<StatBlock> = load_data("statblocks")?;
    Ok(statblocks)
}

#[tauri::command]
pub fn delete_encounter(encounter: Encounter) -> Result<String, String> {
    let path = PathBuf::from(format!("../encounters/{}.json", encounter.name));

    fs::remove_file(path).map_err(|e| e.to_string())?;

    Ok(String::from("Successfully deleted encounter"))
}
