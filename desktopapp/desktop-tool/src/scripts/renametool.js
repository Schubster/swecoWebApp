const fs = require('fs');

document.addEventListener("DOMContentLoaded", function () {
    const dropArea = document.getElementById("drop-area");
    const fileList = document.getElementById("file-list");
    const changeBtn = document.querySelector(".changenamebtn");
    let fileToChange = null;

    // Mapping of file extensions to icon URLs
    const iconMap = {
        pdf: "icons/pdf-icon.png",
        doc: "icons/doc-icon.png",
        txt: "icons/txt-icon.png",
        jpg: "icons/jpg-icon.png",
        png: "icons/png-icon.png",
        default: "icons/default-icon.png"
    };

    // Function to prevent default behavior and allow dropping files
    const dragOverHandler = function (event) {
        event.preventDefault();
        dropArea.classList.add("highlight");
    };

    // Function to handle dropping files
    const dropHandler = function (event) {
        event.preventDefault();
        dropArea.classList.remove("highlight");

        const files = event.dataTransfer.files;

        // Display dropped files with icons
        fileList.innerHTML = "";
        for (const file of files) {
            const fileItem = document.createElement("div");
            fileItem.classList.add("file-item");

           

            const fileNameSpan = document.createElement("span");
            fileNameSpan.textContent = file.name;
            console.log(`\\\\`)
            fileToChange = file.path;
            fileItem.appendChild(fileNameSpan);

            fileList.appendChild(fileItem);
        }
    };

    // Add event listeners
    dropArea.addEventListener("dragover", dragOverHandler);
    dropArea.addEventListener("dragleave", function () {
        dropArea.classList.remove("highlight");
    });
    dropArea.addEventListener("drop", dropHandler);

    changeBtn.addEventListener("click", function(){
        const oldName = fileToChange.split('\\').pop();
        const path = fileToChange.slice(0, fileToChange.lastIndexOf('\\') + 1);
        const extension = fileToChange.split(".").pop()
        const newName = "newvector.png"
        try {
            fs.renameSync(path+oldName, path+newName);
            console.log('Rename complete!');
          } catch (err) {
            throw err;
          }
    })
});