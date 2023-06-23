use std::fs;
use std::path::Path;
// Prevents additional console window on Windows in release, DO NOT REMOVE!!
#[cfg_attr(not(debug_assertions), windows_subsystem = "windows")]
// Learn more about Tauri commands at https://tauri.app/v1/guides/features/command
#[tauri::command]
fn greet(name: &str) -> String {
    println!("Hello");
    format!("Hello, {}! You've been greeted from Rust!", name)
}

#[tauri::command]
fn get_files(location: &str) -> Vec<String> {
    let path = Path::new(location);
    let mut string_paths: Vec<String> = vec![];
    let file_list = match fs::read_dir(path) {
        Ok(file_list) => file_list,
        Err(e) => panic!("{e}"),
    };
    for file_result in file_list {
        let file = match file_result {
            Ok(file) => file,
            Err(e) => panic!("{e}"),
        };

        println!("{}", file.path().display().to_string());
        string_paths.push(file.path().display().to_string());
    }

    string_paths
}

fn main() {
    tauri::Builder::default()
        .invoke_handler(tauri::generate_handler![greet, get_files])
        .run(tauri::generate_context!())
        .expect("error while running tauri application");
}
