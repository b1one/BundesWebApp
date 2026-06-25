const { app, BrowserWindow, globalShortcut } = require('electron');
const path = require('path');

let mainWindow;

function createWindow() {
  mainWindow = new BrowserWindow({
    width: 1200,
    height: 900,
    // Kiosk-Modus sorgt dafür, dass die App den ganzen Bildschirm einnimmt
    // und nicht einfach mit Alt-Tab oder der Windows-Taste verlassen werden kann.
    kiosk: true, 
    webPreferences: {
      nodeIntegration: false, // Sicherheit: Kein direkter Node-Zugriff aus dem Frontend
      contextIsolation: true,
      preload: path.join(__dirname, 'preload.js') // Optional für tiefere Systemintegration
    },
    icon: path.join(__dirname, 'icon.png') // Pfad zu deinem App-Icon
  });

  // Lädt deine lokale HTML Datei
  mainWindow.loadFile('index.html');

  // Deaktiviert das Standard-Menü (Datei, Bearbeiten, etc.)
  mainWindow.setMenu(null);

  // Verhindert das Schließen per Alt+F4 während der Präsentation (optional)
  mainWindow.on('close', (e) => {
    // e.preventDefault(); 
  });
}

app.whenReady().then(() => {
  createWindow();

  // Sicherheits-Feature: Beenden der Präsentation nur über einen geheimen Shortcut
  globalShortcut.register('CommandOrControl+Shift+Q', () => {
    app.quit();
  });
});

app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') app.quit();
});