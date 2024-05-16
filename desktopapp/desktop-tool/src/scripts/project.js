const { ipcMain } = require("electron");
if(localStorage.getItem("currentProjectId") === null){
    ipcRenderer.send('load-page', 'projectview.html');
}
fetchData = {
    token: localStorage.getItem("token"),
    projectID: localStorage.getItem("currentProjectId"),
  };
console.log(fetchData)
let projectData = null;
let projectID = localStorage.getItem("currentProjectId")
ipcRenderer.send("apiRequest", fetchData, "http://127.0.0.1:8000/api/fetchAllProjectStandards", "projectResponse");
ipcRenderer.on("projectResponse", (event, responseData) => {
    projectData = JSON.parse(responseData)
    makeRenameTool()
    makeEditTool()
})



document.querySelectorAll(".tab").forEach(tab => {
    tab.addEventListener('click', function () {
        document.querySelectorAll(".view, .tab").forEach(div => div.classList.remove('selected'));
        this.classList.add('selected')
        document.querySelector("." + tab.dataset.container).classList.add('selected');
    });
});