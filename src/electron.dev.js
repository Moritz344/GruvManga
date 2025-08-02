const { app, BrowserWindow } = require('electron');
const path = require('path');

function createWindow() {
  const win = new BrowserWindow({
    width: 1000,
    height: 700,
    autoHideMenuBar: true,
    webPreferences: {
      contextIsolation: true,
      nodeIntegration: false
    },
  });

  win.loadFile(path.join(__dirname, '../dist/manga-app/browser/index.html'));
  win.webContents.openDevTools();
}

app.whenReady().then(createWindow);

