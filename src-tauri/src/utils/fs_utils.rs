use std::{fs, path::PathBuf};

use serde::Deserialize;

pub fn load_data<T: for<'de> Deserialize<'de>>(folder_name: &str) -> Result<Vec<T>, String> {
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
