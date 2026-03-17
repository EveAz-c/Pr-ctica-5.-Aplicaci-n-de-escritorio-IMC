const { app, BrowserWindow, ipcMain } = require('electron');
const path = require('path');
const fs = require('fs');

let mainWindow;

app.whenReady().then(() => {
  mainWindow = new BrowserWindow({
    width: 500,
    height: 600,
    webPreferences: {
      preload: path.join(__dirname, 'preload.js'), 
      contextIsolation: true,
    }
  });

  mainWindow.loadFile('index.html');
  
  
});


ipcMain.handle('get-history-path', () => {
  return path.join(app.getPath('userData'), 'history.json');
});


ipcMain.handle('read-history', async () => {
  const historyPath = path.join(app.getPath('userData'), 'history.json');
  try {
    if (fs.existsSync(historyPath)) {
      const data = await fs.promises.readFile(historyPath, 'utf8');
      return JSON.parse(data);
    }
  } catch (error) {
    console.error('Error al leer historial:', error);
  }
  return [];
});


ipcMain.handle('save-history', async (event, history) => {
  const historyPath = path.join(app.getPath('userData'), 'history.json');
  try {
    await fs.promises.writeFile(historyPath, JSON.stringify(history, null, 2), 'utf8');
    return true;
  } catch (error) {
    console.error('Error al guardar historial:', error);
    return false;
  }
});

app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') app.quit();
});