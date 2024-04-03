const { ipcRenderer } = require('electron');



let email = localStorage.getItem("email")
const header = document.getElementById('header')
header.innerText = "login in as " + email
var btn = document.getElementById("newProjBtn");
    
btn.onclick = function() {
          ipcRenderer.send('load-page', 'newProject.html');
}
