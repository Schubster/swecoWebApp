// const { ipcRenderer } = require('electron');

// Project List View

const fetchData = { "token": localStorage.getItem("token") };
ipcRenderer.send('apiRequest', fetchData, "http://127.0.0.1:8000/api/fetchprojects", "projectsResponse");

const projectContainer = document.getElementById("project-container");
const currentProjectId = localStorage.getItem("currentProjectId");

ipcRenderer.on('projectsResponse', (event, responseData) => {
    // Update HTML elements to display the response data
    const projects = JSON.parse(responseData);
    projects.forEach(project => {
        const projectDiv = document.createElement("div");
        projectDiv.classList.add("project-item");

        const projectHeader = document.createElement("h1");
        projectHeader.innerHTML = project.name;

        const projectStandard = document.createElement("h2");
        projectStandard.innerHTML = "Standards: " + project.standardName.join(", ");

        projectDiv.addEventListener("click", () => {
            localStorage.setItem("currentProjectId", project.id);
            // Navigate to project view
            menuSend("users.html");
        });

        if (project.id === currentProjectId) {
            // Highlight or mark the currently viewed project
            projectDiv.classList.add("current-project");
        }

        projectDiv.appendChild(projectHeader);
        projectDiv.appendChild(projectStandard);
        projectContainer.appendChild(projectDiv);
    });
});


    

