// See the Electron documentation for details on how to use preload scripts:
// https://www.electronjs.org/docs/latest/tutorial/process-model#preload-scripts
const { contextBridge, ipcRenderer } = require('electron/renderer')

contextBridge.exposeInMainWorld('electronAPI', {
  onTest: (callback) => ipcRenderer.on('test', (_event, value) => callback(value)),
  testValue: (value) => ipcRenderer.send('test-value', value),
  salvarEmpresa: (texto) => ipcRenderer.send('salvar-empresa', texto),
  getEmpresas: () => ipcRenderer.invoke('get-empresas'),
})