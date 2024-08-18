// Prevents additional console window on Windows in release, DO NOT REMOVE!!
#![cfg_attr(not(debug_assertions), windows_subsystem = "windows")]

use std::process::Command;

#[tauri::command]
fn start_pocketbase() {
    if cfg!(target_os = "windows") {
        Command::new("cmd")
            .args(&["/C", "start-pocketbase.bat"])
            .spawn()
            .expect("failed to execute process");
    } else {
        Command::new("sh")
            .arg("start-pocketbase.sh")
            .spawn()
            .expect("failed to execute process");
    }
}

fn main() {
  tauri::Builder::default()
      .invoke_handler(tauri::generate_handler![start_pocketbase])
      .on_window_event(|event| {
        if let tauri::WindowEvent::CloseRequested { .. } = event.event() {
          // Add your script execution logic here
          if cfg!(target_os = "windows") {
            Command::new("cmd")
              .args(&["/C", "stop-pocketbase.bat"])
              .spawn()
              .expect("failed to execute process");
          } else {
            Command::new("sh")
              .arg("stop-pocketbase.sh")
              .spawn()
              .expect("failed to execute process");
          }
        }
      })
      .run(tauri::generate_context!())
      .expect("error while running tauri application");
}
