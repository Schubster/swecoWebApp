// Inside preload.js

const { ipcRenderer } = require('electron');
const fetchData = { token: localStorage.getItem("token") };
window.ipcRenderer = ipcRenderer;
