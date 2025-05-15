import { contextBridge, ipcRenderer } from 'electron';

contextBridge.exposeInMainWorld('db', {
  empresas: {
    all: ipcRenderer.invoke('empresa-all').then((result) => result),
    insert: (data) => ipcRenderer.invoke('empresa-insert', data).then((result) => result),
    select: (data, where) => ipcRenderer.invoke('empresa-select', data, where).then((result) => result),
    remove: (where) => ipcRenderer.invoke('empresa-remove', where).then((result) => result),
    update: (data, where) => ipcRenderer.invoke('empresa-update', data, where).then((result) => result),
  }
})