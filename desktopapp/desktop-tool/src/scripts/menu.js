// const { ipcRenderer } = require('electron');
const { shell } = require('electron')


function menuSend(pageToLoad){
    ipcRenderer.send('load-page', pageToLoad);

}


