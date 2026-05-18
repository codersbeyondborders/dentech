use tauri_plugin_shell::ShellExt;
use tauri_plugin_shell::process::CommandEvent;
use tauri::AppHandle;

#[tauri::command]
async fn start_backend(app: AppHandle) -> Result<String, String> {
    let sidecar_command = app.shell().sidecar("backend").map_err(|e| e.to_string())?;
    
    let (mut rx, _child) = sidecar_command
        .spawn()
        .map_err(|e| e.to_string())?;
        
    tauri::async_runtime::spawn(async move {
        while let Some(event) = rx.recv().await {
            if let CommandEvent::Stdout(line) = event {
                println!("Backend: {}", String::from_utf8_lossy(&line));
            } else if let CommandEvent::Stderr(line) = event {
                eprintln!("Backend Error: {}", String::from_utf8_lossy(&line));
            }
        }
    });
    
    Ok("Backend started successfully".into())
}

#[cfg_attr(mobile, tauri::mobile_entry_point)]
pub fn run() {
  tauri::Builder::default()
    .plugin(tauri_plugin_shell::init())
    .setup(|app| {
      if cfg!(debug_assertions) {
        app.handle().plugin(
          tauri_plugin_log::Builder::default()
            .level(log::LevelFilter::Info)
            .build(),
        )?;
      }
      Ok(())
    })
    .invoke_handler(tauri::generate_handler![start_backend])
    .run(tauri::generate_context!())
    .expect("error while running tauri application");
}
