// In this file you can include the rest of your app's specific main process
// code. You can also put them in separate files and import them here.
import { app, BrowserWindow, ipcMain } from 'electron';
import path from 'node:path';
import started from 'electron-squirrel-startup';
import * as empresa from "./db/models/empresa.js"

ipcMain.handle('empresa-all', () => empresa.all())
ipcMain.handle('empresa-get', (fields = {}, where = {}) => {
  const valid = empresa.validate(fields, 'get', 'select') && empresa.validate(where, 'get', 'where');
  if(valid) return empresa.get(fields, where);
})
ipcMain.handle('empresa-insert', (_event, data) => {
  const valid = empresa.validate(data, ['insert']);
  if(valid) return empresa.insert(data);
})
ipcMain.handle('empresa-select', (_event, data, where) => {
  const valid = empresa.validate(where, ['select','where']);
  if(valid) return empresa.select(data, where);
})
ipcMain.handle('empresa-update', (_event, data, where) => {
  const validSet = empresa.validate(data, ['update','set']);
  const validWhere = empresa.validate(where, ['update','where']);
  if(validSet && validWhere) return empresa.update(data, where);
})
ipcMain.handle('empresa-remove', (_event, where) => {
  const valid = empresa.validate(where, ['delete']);
  if(valid) return empresa.remove(where);
})

// Handle creating/removing shortcuts on Windows when installing/uninstalling.
if (started) {
  app.quit();
}

const createWindow = () => {
  // Create the browser window.
  const mainWindow = new BrowserWindow({
    width: 800,
    height: 600,
    webPreferences: {
      preload: path.join(__dirname, 'preload.js'),
    },
  });

  // and load the index.html of the app.
  if (MAIN_WINDOW_VITE_DEV_SERVER_URL) {
    mainWindow.loadURL(MAIN_WINDOW_VITE_DEV_SERVER_URL);
  } else {
    mainWindow.loadFile(path.join(__dirname, `../renderer/${MAIN_WINDOW_VITE_NAME}/index.html`));
  }

  /* mainWindow.webContents.on('did-finish-load', () => {
    mainWindow.webContents.send('test', db)
  }) */
  mainWindow.webContents.openDevTools();
};

// This method will be called when Electron has finished
// initialization and is ready to create browser windows.
// Some APIs can only be used after this event occurs.
app.whenReady().then(() => {
  ipcMain.on('test-value', (_event, value) => {
    console.log(value) // will print value to Node console
  })
  createWindow();
});

// Quit when all windows are closed.
app.on('window-all-closed', () => {
  app.quit();
});