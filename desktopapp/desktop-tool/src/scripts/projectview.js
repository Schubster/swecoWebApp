<<<<<<< HEAD
// const { ipcRenderer } = require('electron');

// Project List View

const fetchData = { "token": localStorage.getItem("token") };
=======
const fetchData = {"token" : localStorage.getItem("token")}
>>>>>>> nybranch
ipcRenderer.send('apiRequest', fetchData, "http://127.0.0.1:8000/api/fetchprojects", "projectsResponse");

const projectContainer = document.getElementById("project-container");
const currentProjectId = localStorage.getItem("currentProjectId");

ipcRenderer.on('projectsResponse', (event, responseData) => {
    // Update HTML elements to display the response data
    const projects = JSON.parse(responseData);
    projects.forEach(project => {
        const projectDiv = document.createElement("div");
        projectDiv.classList.add("project-item");

<<<<<<< HEAD
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


    

=======
      let projectDiv = document.createElement("div")
      let projectHeader = document.createElement("h1")
      projectHeader.innerHTML = project.name
      let projectDescription = document.createElement("h2")
      projectDescription.innerHTML = project.description
      let projectStandard = document.createElement("h2")
      let standards = project.standardName.join(", ")
      projectStandard.innerHTML = "Standards: " + standards

      projectDiv.addEventListener("click", () => {
        // Create and display the overlay
        let overlay = document.createElement("div")
        overlay.className = "overlay"
        
        // Create and display the box
        let box = document.createElement("div")
        box.className = "project-box"
        box.innerHTML = `
          <div class="box-header">
            <h1 class="module">${project.name}</h1>
            <button class="close-btn">×</button>
          </div>
          <div class="box-content">
            <p>Standards: ${standards}</p>

          </div>
          <div class="box-buttons">
            <button class="add-user-btn button">Användare</button>
            <button class="add-tool-btn button">Redskap</button>
          </div>
        `
        overlay.appendChild(box)
        document.body.appendChild(overlay)

        // Close the box when the close button is clicked
        const closeBtn = box.querySelector(".close-btn")
        closeBtn.addEventListener("click", () => {
          document.body.removeChild(overlay)
        })

        // Add functionality to buttons
        const addUserBtn = box.querySelector(".add-user-btn")
        addUserBtn.addEventListener("click", () => {
          // Add your logic here for adding users
          console.log("Add user button clicked")
        })

        const addToolBtn = box.querySelector(".add-tool-btn")
        addToolBtn.addEventListener("click", () => {
          // Add your logic here for adding tools
          console.log("Add tool button clicked")
        })
      })

      projectDiv.appendChild(projectHeader)
      projectDiv.appendChild(projectStandard)
      projectContainer.appendChild(projectDiv)
    });
});
>>>>>>> nybranch
