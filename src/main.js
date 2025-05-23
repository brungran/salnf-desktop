// In this file you can include the rest of your app's specific main process
// code. You can also put them in separate files and import them here.
import { app, BrowserWindow, ipcMain } from 'electron';
import path from 'node:path';
import started from 'electron-squirrel-startup';
import Database from 'better-sqlite3';

const db = new Database('src/database.db', { verbose: console.log });
db.pragma('journal_mode = WAL')
db.prepare('CREATE TABLE IF NOT EXISTS empresas (id INTEGER PRIMARY KEY, nome TEXT)').run()
ipcMain.handle('get-empresas', () => {
  const stmt = db.prepare('SELECT * FROM empresas')
  const rows = stmt.all() // retorna array de objetos
  return rows
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

  mainWindow.webContents.on('did-finish-load', () => {
    mainWindow.webContents.send('test', db)
  })
  // Open the DevTools.
  // mainWindow.webContents.openDevTools();
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

ipcMain.on('salvar-empresa', (_event, texto) => {
  db.prepare('INSERT INTO empresas (nome) VALUES (?)').run(texto)
  console.log(`Empresa salva: ${texto}`)
})