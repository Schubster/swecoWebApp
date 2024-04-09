// const { ipcRenderer } = require('electron');



function menuSend(pageToLoad){
    ipcRenderer.send('load-page', pageToLoad);

}

