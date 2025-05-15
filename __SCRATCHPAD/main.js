console.log("Inicializando Electron...");
import { app, BrowserWindow, ipcMain } from 'electron';
import started from 'electron-squirrel-startup';
import Database from 'better-sqlite3';
import fs from 'fs';
import { fileURLToPath, pathToFileURL } from 'url';
import path from 'node:path';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const modelsDir = path.join(__dirname, '../../src/db/models');
const modelFiles = fs.readdirSync(modelsDir).filter(file => file.endsWith('.mjs'));

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

  mainWindow.webContents.on('did-finish-load', async () => {
    mainWindow.webContents.send('expose-models', JSON.stringify(await carregarPreload()))
    // mainWindow.webContents.send('expose-models', JSON.stringify({a: "1", b: "2"}))
    // mainWindow.webContents.send('expose-models', carregarPreload(__filename))
  })
  // Open the DevTools.
  // mainWindow.webContents.openDevTools();
};

app.whenReady().then(() => {
  createWindow();
});

// Quit when all windows are closed.
app.addListener('window-all-closed', () => {
  app.quit();
});

ipcMain.handle('empresa:insert', async (event, data) => {
  // aqui você pode validar `data`, sanitizar, logar, etc.
  return empresaModel.insert(data);
});

/* ipcMain.addListener('db-operation', (_event, query, values) => {
  db.prepare(query).run(values)
}) */

/* ipcMain.handle('get-empresas', () => {
  const stmt = db.prepare('SELECT * FROM empresas')
  const rows = stmt.all() // retorna array de objetos
  return rows
}) */

async function carregarCanais() {
  for (const file of modelFiles) {
    const modelName = path.basename(file, '.js'); // ex: empresa

    // Importação dinâmica com await
    const modelModule = await import(path.join(modelsDir, file));
    const model = modelModule.default || modelModule;

    for (const [fnName, fn] of Object.entries(model)) {
      if (typeof fn !== 'function') continue;

      const channel = `${modelName}:${fnName}`;

      ipcMain.handle(channel, async (_event, payload) => {
        if (typeof model.validate === 'function') {
          const isValid = model.validate(payload);
          if (isValid !== true) {
            return { error: isValid || 'Dados inválidos' };
          }
        }

        try {
          const result = await fn(payload);
          return result;
        } catch (err) {
          console.error(`Erro no handler "${channel}":`, err);
          return { error: err.message };
        }
      });
    }
  }
}

async function carregarPreload(){
  /* const modelsDir = path.join(__dirname, './db/models');
  const modelFiles = fs.readdirSync(modelsDir).filter(file => file.endsWith('.js')); */

  const modelAPI = {};

  for (const file of modelFiles) {
    const filePath = path.join(modelsDir, file);              // C:\... ou /... (absoluto)
    const fileUrl = pathToFileURL(filePath).href;             // file:///...

    const modelName = path.basename(file, '.js');
    const module = await import(fileUrl);
    const methods = Object.keys(module).filter(k => typeof module[k] === 'function');

    modelAPI[modelName] = {};

    for (const fn of methods) {
      modelAPI[modelName][fn] = true;
    }
  }

  return modelAPI;
}