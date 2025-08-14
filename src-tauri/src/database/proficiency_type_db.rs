//? Helper Util

use reqwest::Client;

use crate::types::{
    auth_types::SupabaseConfig,
    proficiency_types::{SaveProficiencyDB, SkillProficiencyDB},
    statblock_types::StatBlock,
};

pub async fn save_statblock_save_proficiency_helper(
    stat_block: &StatBlock,
    config: &SupabaseConfig,
    client: &Client,
    access_token: &str,
) -> Result<String, String> {
    let saves = stat_block.save_proficiencies_to_db().unwrap();

    delete_save_proficiencies_matching_statblock_id(stat_block, config, client, access_token)
        .await?;

    for save in saves {
        insert_save_proficiencies(&save, config, client, access_token).await?;
    }

    Ok("SaveProficiency inserts successful".to_string())
}

pub async fn save_statblock_skill_proficiency_helper(
    stat_block: &StatBlock,
    config: &SupabaseConfig,
    client: &Client,
    access_token: &str,
) -> Result<String, String> {
    let saves = stat_block.skill_proficiencies_to_db().unwrap();

    delete_skill_proficiencies_matching_statblock_id(stat_block, config, client, access_token)
        .await?;

    for save in saves {
        insert_skill_proficiencies(&save, config, client, access_token).await?;
    }

    Ok("SkillProficiency inserts successful".to_string())
}

//? POST

pub async fn insert_save_proficiencies(
    save_proficiency: &SaveProficiencyDB,
    config: &SupabaseConfig,
    client: &Client,
    access_token: &str,
) -> Result<String, String> {
    // Insert currently existing condition types for statblock
    let insert_url = format!("{}/rest/v1/SaveProficiency", config.url);

    let insert_response = client
        .post(&insert_url)
        .header("apikey", &config.anon_key)
        .header("Authorization", format!("Bearer {}", access_token))
        .body(serde_json::to_string(&vec![save_proficiency]).map_err(|e| e.to_string())?)
        .send()
        .await
        .map_err(|e| format!("SaveProficiency insert failed: {}", e))?;

    if !insert_response.status().is_success() {
        return Err(format!(
            "SaveProficiency insert failed: {}",
            insert_response.text().await.unwrap_or_default()
        ));
    }

    Ok("SaveProficiency insert successful".to_string())
}

pub async fn insert_skill_proficiencies(
    skill_proficiency: &SkillProficiencyDB,
    config: &SupabaseConfig,
    client: &Client,
    access_token: &str,
) -> Result<String, String> {
    // Insert currently existing condition types for statblock
    let insert_url = format!("{}/rest/v1/SkillProficiency", config.url);

    let insert_response = client
        .post(&insert_url)
        .header("apikey", &config.anon_key)
        .header("Authorization", format!("Bearer {}", access_token))
        .body(serde_json::to_string(&vec![skill_proficiency]).map_err(|e| e.to_string())?)
        .send()
        .await
        .map_err(|e| format!("SkillProficiency insert failed: {}", e))?;

    if !insert_response.status().is_success() {
        return Err(format!(
            "SkillProficiency insert failed: {}",
            insert_response.text().await.unwrap_or_default()
        ));
    }

    Ok("SkillProficiency insert successful".to_string())
}

//? GET

//? DELETE

pub async fn delete_save_proficiencies_matching_statblock_id(
    stat_block: &StatBlock,
    config: &SupabaseConfig,
    client: &Client,
    access_token: &str,
) -> Result<String, String> {
    // Delete pre-existing condition immunities for statblock
    let delete_url = format!(
        "{}/rest/v1/SaveProficiency?statblock_id=eq.{}",
        config.url,
        stat_block.id.unwrap()
    );

    let delete_response = client
        .delete(&delete_url)
        .header("apikey", &config.anon_key)
        .header("Authorization", format!("Bearer {}", access_token))
        .header("Content-Type", "application/json")
        .send()
        .await
        .map_err(|e| format!("SaveProficiency delete failed: {}", e))?;

    if !delete_response.status().is_success() {
        return Err(format!(
            "SaveProficiency delete failed: {}",
            delete_response.text().await.unwrap_or_default()
        ));
    }

    Ok("Save Proficiencies successfully deleted".to_string())
}

pub async fn delete_skill_proficiencies_matching_statblock_id(
    stat_block: &StatBlock,
    config: &SupabaseConfig,
    client: &Client,
    access_token: &str,
) -> Result<String, String> {
    // Delete pre-existing condition immunities for statblock
    let delete_url = format!(
        "{}/rest/v1/SkillProficiency?statblock_id=eq.{}",
        config.url,
        stat_block.id.unwrap()
    );

    let delete_response = client
        .delete(&delete_url)
        .header("apikey", &config.anon_key)
        .header("Authorization", format!("Bearer {}", access_token))
        .header("Content-Type", "application/json")
        .send()
        .await
        .map_err(|e| format!("SkillProficiency delete failed: {}", e))?;

    if !delete_response.status().is_success() {
        return Err(format!(
            "SkillProficiency delete failed: {}",
            delete_response.text().await.unwrap_or_default()
        ));
    }

    Ok("Skill Proficiencies successfully deleted".to_string())
}
