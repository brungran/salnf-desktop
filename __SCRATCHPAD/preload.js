console.log("Executando preload...");
import { contextBridge, ipcRenderer } from 'electron';

/* contextBridge.exposeInMainWorld('models', {
  use: (model) => modelAPI[model]
}); */
// let resolveReady;
// const readyPromise = new Promise((resolve) => { resolveReady = resolve; });

contextBridge.exposeInMainWorld('models', {
  use: (model) => ipcRenderer.on('expose-models', (_event, value) => JSON.parse(value)[model]),
  // use: (callback) => ipcRenderer.on('expose-models', (_event, value) => callback(JSON.parse(value))),
  // use: (callback) => ipcRenderer.on('expose-models', (_event, value) => callback(value)),
  // ready: () => readyPromise
});
// use: (callback) => ipcRenderer.on('expose-models', (_event, value) => callback(value))

/* contextBridge.exposeInMainWorld('electronAPI', {
  onUpdateCounter: (callback) => ipcRenderer.on('update-counter', (_event, value) => callback(value))
}) */

console.log("Preload carregado.");


// (args) => ipcRenderer.invoke(`${modelName}:${fn}`, args)