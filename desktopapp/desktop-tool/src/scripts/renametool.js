const fs = require('fs');
const renameContainer = document.querySelector(".rename-content")
const dropArea = document.getElementById("drop-area");
const dropdownConainer = document.querySelector(".dropdown-container")
const fileExplorer = document.getElementById("fileExplorer");
const resizehandle = document.getElementById("resizeHandle")
const changeBtn = document.querySelector(".changenamebtn");
const tooltabs = document.querySelectorAll('.tooltab');
const typeContainersList = document.querySelectorAll('.type-container')
const typeContainers = {};
typeContainersList.forEach(div => {
    const type = div.dataset.type;
    typeContainers[type] = div;
});
console.log(typeContainers)
const demoField = document.getElementById('demofield')
const dropdowns = {}
let fileToChange = null;


// File explorer
const iconMap = {
    pdf: "../style/icons/pdf-icon.png",
    doc: "../style/icons/doc-icon.png",
    txt: "../style/icons/txt-icon.png",
    jpg: "icons/jpg-icon.png",
    png: "icons/png-icon.png",
    default: "icons/default-icon.png"
};


function makeRenameTool() {
    const standards = projectData.standards_by_type;
    for (const [type, list] of Object.entries(standards)) {
        const container = typeContainers[type];
        if (container) {
            AddDropDowns(list, container, type);
        }
    }
    const selectedDiv = document.querySelector(".type-container.selected")
    const selectedStandardID = selectedDiv.querySelector(".standard-dropdown").value
    showStandard(selectedDiv.dataset.type, selectedStandardID)
}

function AddDropDowns(list, container, type) {
    dropdowns[type] = [];
    const dropdownOptions = list.map(standard => `<option value="${standard.id}">${standard.name}</option>`).join('');
    container.innerHTML = `
                <div class="standard-selector">
                    <h3>Konvention</h3>
                    <select class="standard-dropdown">
                        ${dropdownOptions}
                    </select>
                </div>`;

    list.forEach(standard => {
        dropdowns[type].push(new Standard(container, standard));
    });

    container.querySelector(".standard-dropdown").addEventListener("change", function () {
        showStandard(type, this.value);
    });
}
function showStandard(type, value) {
    console.log(type + "   " + value)
    dropdowns[type].forEach(standard => {
        console.log("objId: " + standard.standard.id + "   select value: " + value)
        if (standard.standard.id == value) {
            standard.show()
            demoField.value = standard.getCurentName()
        } else {
            standard.hide()
        }
    })
}

function traverseFileSystem(item) {
    return new Promise((resolve, reject) => {
        if (item.isFile) {
            item.file(file => {
                resolve(file);
            }, error => {
                reject(error);
            });
        } else if (item.isDirectory) {
            const directoryReader = item.createReader();
            const directoryFiles = [];

            directoryReader.readEntries(entries => {
                const entryPromises = [];

                for (let i = 0; i < entries.length; i++) {
                    entryPromises.push(traverseFileSystem(entries[i]));
                }

                Promise.all(entryPromises)
                    .then(files => {
                        resolve({ directoryName: item.name, entries: files });
                    })
                    .catch(error => {
                        reject(error);
                    });
            }, error => {
                reject(error);
            });
        }
    });
}

function AddFiles(list, parent) {
    list.forEach(item => {
        if (Object.hasOwn(item, "entries")) {
            const newFolder = document.createElement("div")
            newFolder.classList.add("folderDiv")
            const newHeader = document.createElement("p")
            newHeader.innerHTML = '<i class="fa-solid fa-folder"></i> ' + item.directoryName + '  <i class="dropdown-icon fa-solid fa-caret-down"></i>'
            newFolder.appendChild(newHeader)
            newFolder.addEventListener('click', function (event) {
                event.stopPropagation()
                this.classList.toggle('open'); // Toggle the 'open' class to show/hide files
            });
            parent.appendChild(newFolder)
            AddFiles(item.entries, newFolder)
        }
        else {
            parent.appendChild(createFileDiv(item))
        }
    });

}

function createFileDiv(file) {
    const newFile = document.createElement("div");
    const extension = file.name.split(".").pop()
    console.log(extension)
    newFile.classList.add("fileDiv");
    newFile.dataset.path = file.path;
    newFile.innerHTML = file.name;
    newFile.addEventListener('click', function (event) {
        event.stopPropagation()
        if (fileToChange) {
            fileToChange.classList.remove('selected');
        }
        fileToChange = newFile;
        fileToChange.classList.add('selected');
        console.log(fileToChange)
    });
    return newFile;
}


const dragOverHandler = function (event) {
    event.preventDefault();
    fileExplorer.classList.add("highlight");
};

// Function to handle dropping files
const dropHandler = function (event) {
    event.preventDefault();
    fileExplorer.classList.remove("highlight");

    const items = event.dataTransfer.items;
    const filePromises = [];

    for (let i = 0; i < items.length; i++) {
        const item = items[i].webkitGetAsEntry();
        if (item) {
            filePromises.push(traverseFileSystem(item));
        }
    }

    Promise.all(filePromises)
        .then(files => {
            document.querySelectorAll(".fileDiv, .folderDiv").forEach(file => file.remove())
            fileExplorer.classList.remove("empty")
            document.querySelector(".empty-explorer-text").remove()
            AddFiles(files, fileExplorer)

        })
        .catch(error => {
            console.error("Error reading files and folders:", error);
            // Handle the error
        });

};

// Add event listeners
fileExplorer.addEventListener("dragover", dragOverHandler);
fileExplorer.addEventListener("dragleave", function () {
    fileExplorer.classList.remove("highlight");
});
fileExplorer.addEventListener("drop", dropHandler);

changeBtn.addEventListener("click", function () {
    if (fileToChange) {
        const oldName = fileToChange.dataset.path.split('\\').pop();
        const path = fileToChange.dataset.path.slice(0, fileToChange.dataset.path.lastIndexOf('\\') + 1);
        const extension = "." + oldName.split(".").pop();
        const newName = demoField.value + extension;
        try {
            fs.renameSync(path + oldName, path + newName);
            console.log('Rename complete!');

            // Update the file name in the DOM
            fileToChange.innerHTML = newName;

            // Update the dataset path attribute
            fileToChange.dataset.path = path + newName;
            fileToChange.classList.add("updated")
        } catch (err) {
            throw err;
        }
    }
});





//resize FileExplorer

let isResizing = false;
const minWidth = 100; // Minimum width in pixels
const maxWidth = 800; // Maximum width in pixels

resizehandle.addEventListener('mousedown', function (event) {
    isResizing = true;
    document.addEventListener('mousemove', handleMouseMove);
    document.addEventListener('mouseup', handleMouseUp);
});

function handleMouseMove(event) {
    if (!isResizing) return;
    const newWidth = event.clientX - fileExplorer.getBoundingClientRect().left;
    fileExplorer.style.width = `${clamp(newWidth, minWidth, maxWidth)}px`;
    renameContainer.style.gridTemplateColumns = `${Number.parseInt(fileExplorer.style.width) + 10}px auto auto auto`
    resizehandle.style.left = `${Number.parseInt(fileExplorer.style.width) + 58}px`;
}

function handleMouseUp(event) {
    if (!isResizing) return;
    isResizing = false;
    document.removeEventListener('mousemove', handleMouseMove);
    document.removeEventListener('mouseup', handleMouseUp);
}

function clamp(value, min, max) {
    return Math.min(Math.max(value, min), max);
}


// Hide/Show scroll bar



fileExplorer.addEventListener('mouseenter', () => {
    fileExplorer.classList.add('hovered');
});

fileExplorer.addEventListener('mouseleave', () => {
    fileExplorer.classList.remove('hovered');
});
// Loop through each 'tooltab' element
tooltabs.forEach(function (tab) {
    // Add click event listener to each 'tooltab'
    tab.addEventListener('click', function () {
        // Remove 'clicked' class from all 'tooltab' elements
        [...tooltabs, ...typeContainersList].forEach(item => item.classList.remove("selected"))
        // Add 'clicked' class to the clicked 'tooltab' element
        tab.classList.add('selected');
        const selectedDiv = typeContainers[tab.dataset.type]
        selectedStandard = selectedDiv.querySelector(".standard-dropdown").value
        showStandard(tab.dataset.type, selectedStandard)
        selectedDiv.classList.add('selected');
    });
});

class Dropdown {
    constructor(container, dictionary) {
        this.container = container;
        this.dictionary = dictionary;
        this.header = this.createHeader();
        this.dropdown = this.createDropdown();
        this.options = this.createOptions();
        this.dropdownContainer = this.createDropdownContainer();
        this.selectedtext = this.createSelectedText()
        this.dropdown.appendChild(this.selectedtext)
        this.dropdown.appendChild(this.options);
        this.dropdownContainer.appendChild(this.header);
        this.selectedOption = this.setSelected(this.options.children[0]);
        this.dropdownContainer.appendChild(this.dropdown);
        this.container.appendChild(this.dropdownContainer);


        // Toggle options visibility on header click
        this.dropdown.addEventListener('click', this.toggleOptions.bind(this));
        this.dropdown.addEventListener('blur', this.hideOptions.bind(this));

        // Handle option selection
        this.options.addEventListener('click', (event) => {
            const selectedOption = event.target.closest('.dropdown-option');
            if (selectedOption) {
                this.setSelected(selectedOption);
                this.container.dispatchEvent(new Event('optionSelected'));
            }
        });
    }


    setSelected(option) {
        const selectedOption = option
        this.selectedtext.innerText = selectedOption.dataset.value
        Array.from(this.options.children).forEach(option => option.classList.remove("selected"))
        selectedOption.classList.add("selected")
        return selectedOption
    }
    createSelectedText() {
        const text = document.createElement("p")
        text.classList.add("dropdown-selected-text")
        return text
    }

    createDropdownContainer() {
        const dropdownContainer = document.createElement("div");
        dropdownContainer.classList.add("custom-dropdown-container");
        return dropdownContainer;
    }

    createHeader() {
        const header = document.createElement("h3");
        header.textContent = this.dictionary.name;
        return header;
    }

    createDropdown() {
        const dropdown = document.createElement('div');
        dropdown.classList.add('custom-dropdown');
        dropdown.tabIndex = 0;
        return dropdown;
    }

    createOptions() {
        const options = document.createElement('div');
        options.classList.add('dropdown-options');

        // Create a temporary hidden element to measure the maximum content width
        const tempElement = document.createElement('div');


        for (const [key, value] of Object.entries(this.dictionary.options)) {
            const option = document.createElement('div');
            option.classList.add('dropdown-option');
            option.dataset.key = key;
            option.dataset.value = value;
            option.innerHTML = `<div class="option-key">${value}</div> <div class="option-value">${key}</div>`;
            options.appendChild(option);
        }
        return options;
    }

    toggleOptions(event) {
        event.stopPropagation();
        if (this.options.classList.contains('show-options')) {
            this.dropdown.blur(); // Blur the dropdown to hide options
        } else {
            this.options.classList.add('show-options'); // Show options
            this.dropdown.focus()
        }
    }


    hideOptions(event) {
        event.stopPropagation()
        this.options.classList.remove('show-options');
    }
}

class Standard {
    constructor(container, standard) {
        this.container = container;
        this.standard = standard;
        this.dropdowns = [];
        this.dropdownsContainer = this.createContainer()

        this.init();
    }

    createContainer() {
        const dropdownsContainer = document.createElement("div")
        dropdownsContainer.classList.add("standard-container")
        dropdownsContainer.dataset.standardid = this.standard.id
        return dropdownsContainer
    }

    init() {
        this.standard.dictionaries.forEach((dict, index) => {
            const dropdown = new Dropdown(this.dropdownsContainer, dict);
            this.dropdowns.push(dropdown);
        });
        this.container.appendChild(this.dropdownsContainer)
        this.dropdownsContainer.addEventListener('optionSelected', () => {
            demoField.value = this.getCurentName()
        });
    }
    hide() {
        this.dropdownsContainer.classList.remove("selected")
    }
    show() {
        this.dropdownsContainer.classList.add("selected")
    }
    getCurentName() {
        return this.dropdowns.map(dropdown => dropdown.selectedtext.innerText).join('')
    }

}

// Usage
// const optionsData = [
//     { key: '1', value: 'Option 1' },
//     { key: '2', value: 'Option 2' },
//     { key: '3', value: 'Option 3' }
// ];
// const dropdown = new CustomDropdown('.dropdown-container', optionsData);
