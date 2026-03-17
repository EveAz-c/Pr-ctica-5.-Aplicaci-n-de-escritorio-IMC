const { contextBridge, ipcRenderer } = require('electron');

contextBridge.exposeInMainWorld('electronAPI', {
  getHistoryPath: () => ipcRenderer.invoke('get-history-path'),
  readHistory: () => ipcRenderer.invoke('read-history'),
  saveHistory: (history) => ipcRenderer.invoke('save-history', history)
});