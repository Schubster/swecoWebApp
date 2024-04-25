const fetchData = {"token" : localStorage.getItem("token")}
localStorage.removeItem("project")
ipcRenderer.send('apiRequest', fetchData, "http://127.0.0.1:8000/api/fetchprojects", "projectsResponse");

projectContainer = document.getElementById("project-container")

ipcRenderer.on('projectsResponse', (event, responseData) => {
    // Update HTML elements to display the response data
    projects = JSON.parse(responseData)                 
    projects.forEach(project => {
      console.log(project)

      let projectDiv = document.createElement("div")
      let projectHeader = document.createElement("h1")
      projectHeader.innerHTML = project.name
      let projectDescription = document.createElement("h2")
      projectDescription.innerHTML = project.description
      let projectStandard = document.createElement("h2")
      let standards = project.standardName.join(", ")
      projectStandard.innerHTML = "Standards: " + standards

      projectDiv.addEventListener("click", () => {
        localStorage.setItem("currentProjectId", project.id)
        ipcRenderer.send('load-page', "project.html");
      })

      projectDiv.appendChild(projectHeader)
      projectDiv.appendChild(projectStandard)
      projectContainer.appendChild(projectDiv)
    });
});
