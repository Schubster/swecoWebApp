// const { ipcRenderer } = require('electron');

const fetchData = {"token" : localStorage.getItem("token")}
ipcRenderer.send('apiRequest', fetchData, "http://127.0.0.1:8000/api/fetchprojects", "projectsResponse");

projectContainer = document.getElementById("project-container")

ipcRenderer.on('projectsResponse', (event, responseData) => {
    // Update HTML elements to display the response data
    projects = JSON.parse(responseData)                 
    projects.forEach(project => {
      console.log(project)

      projectDiv = document.createElement("div")
      projectHeader = document.createElement("h1")
      projectHeader.innerHTML = project.name
      projectStandard = document.createElement("h2")
      let standards = []
      project.standardName.forEach(name =>{
        standards.push(name)
      })
      console.log(standards.join(" "))
      projectStandard.innerHTML = "standards: " + standards.join(" ")

      projectDiv.addEventListener("click", ()=>{
        ipcMain.send()
      })

      // projectDiv.appendChild(projectHeader)
      // projectDiv.appendChild(projectStandard)
      projectDiv.innerHTML += `<h1>${project.name}</h1><h2>standards: ${standards.join(" ")}</h2>`
      projectContainer.appendChild(projectDiv)
      

    });



  });


    

