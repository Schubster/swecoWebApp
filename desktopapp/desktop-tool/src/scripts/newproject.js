const { ipcRenderer } = require("electron");

// Usage examp

if (!null) console.log("kos");

var testStandardList = {
  "name": "placeholder",
  "id": -1,
  "options": {
    "typ1": "T1",
    "typ2": "T2"
  }
}

const newProject = [
  {
    id: 0,
    name: "Project1",
    standards_by_type: {
      modeller: [{}],
      ritningar: [{}],
      textdokument: [{}],
    },
  },
];

let draggedItem = null;

const defaultStandard = [
  { name: "Elprojektör", options: { placeholder: "P" } },
  { name: "Telesystem", options: { placeholder: "P" } },
  { name: "Planritning", options: { placeholder: "P" } },
  { name: "Nummer", options: { placeholder: "P" } },
];

var standardsDiv = document.getElementById("standards");

var demofield = document.getElementById("demofield");
const dictionaryNameField = document.getElementById("dictionary_name");
var submitStandard = document.getElementById("submit_standard");

// Get the modals
var standardModal = document.getElementById("new_standard_modal");
var dictionaryModal = document.getElementById("new_dictionary_modal");

// Get the button that opens the modals
var addDictionaryBtn = document.getElementById("add_dictionary");
var standardButton = document.getElementById("edit_standard");

// Get the <span> element that closes the modals
var closeStandardModal = document.getElementById("close_standard_modal");
var closeDictionaryModal = document.getElementById("close_dictionary_modal");

const fetchData = { token: localStorage.getItem("token") };

// custom dropdown
let gridItemsData = [];
let selectedStandards = { "modeller": [], "ritningar": [], "textdokument": [] };
let debounceTimeout = null;
let selectedType = "textdokument";
let selectedList = null

// JavaScript to filter dropdown content based on input search query
const inputField = document.querySelector(".dropdown-input");
const dropdownContent = document.querySelector(".dropdown-content");
const gridContainer = document.querySelector(".grid-container");
const dropdownContainer = document.querySelector(".dropdown");
const selectedStandardsContainer = document.querySelector(
  ".selected-standards-container-div"
);
const editTypeList = selectedStandardsContainer.querySelectorAll(".standard-type-list")

function displaySelectedStandards(){
  editTypeList.forEach(typeList=>{
  const subList = typeList.querySelector(".sublist")
  subList.innerHTML = '';
  
  selectedStandards[typeList.dataset.type].forEach(standard=>{
    makeStandardli(standard, subList)
  })

  typeList.addEventListener("click", ()=>{
      editTypeList.forEach(listItem=> {
          listItem.querySelector(".sublist").classList.remove("selected")
          listItem.classList.remove("selected")
          
      })
      selectedList = subList
      selectedType = typeList.dataset.type
      subList.classList.add("selected")
      typeList.classList.add("selected")
  })
})
}
displaySelectedStandards()

function makeStandardli(standard, subList){
const listItem = document.createElement("li")
listItem.innerText = standard.name
listItem.addEventListener("click",()=>{
  editStandard(standard.id, standard.name)}
  )
const removeBtn = document.createElement("button")
removeBtn.classList.add("remove-standard-item-btn")
removeBtn.innerText = "Ta bort"
removeBtn.type = "button"
removeBtn.addEventListener("click", (event)=>{
  event.stopPropagation()
  selectedStandards[selectedType] = selectedStandards[selectedType].filter(removeStandard => removeStandard.id !== standard.id)
  listItem.remove()
})
listItem.appendChild(removeBtn)
subList.appendChild(listItem)
}

inputField.addEventListener("input", () => search());
inputField.addEventListener("focus", () => showDropdown());
//inputField.addEventListener("focusout", () => hideDropdown());
dropdownContent.addEventListener("mousedown", (event) =>
  preventFocusOut(event)
);
addItems(gridItemsData);

function showDropdown() {
  dropdownContent.style.display = "grid";

}

function hideDropdown() {
  dropdownContent.style.display = "none";
}

function preventFocusOut(event) {
  event.preventDefault();
}

function addItems(dataList) {
  gridContainer.innerHTML = "";
  const gridItems = dataList.map((item) => {
    const gridItem = document.createElement("div");
    gridItem.classList.add("grid-item");
    gridItem.textContent = item.name;
    gridItem.dataset.index = item.id;
    const index = parseInt(gridItem.dataset.index);
    const name = gridItem.textContent.trim();
    const optionButtons = document.createElement("div");
    optionButtons.classList.add("option-buttons");
    const option1 = createOptionButton("Select");
    const option2 = createOptionButton("Use as template");
    optionButtons.appendChild(option1);
    optionButtons.appendChild(option2);
    gridItem.appendChild(optionButtons);

    option1.addEventListener("click", function (event) {
      event.stopPropagation(); // Prevent event from propagating to grid item
      addStandard(index, name);
    });

    option2.addEventListener("click", function (event) {
      event.stopPropagation(); // Prevent event from propagating to grid item
      editStandard(index, name);
    });
    gridItem.addEventListener("mouseover", function () {
      this.firstElementChild.style.display = "block";
    });
    gridItem.addEventListener("mouseout", function () {
      this.firstElementChild.style.display = "none";
    });
    return gridItem;
  });


  gridItems.forEach((item) => {
    gridContainer.appendChild(item);
  });
}

function search() {
  clearTimeout(debounceTimeout);
  debounceTimeout = setTimeout(() => {
    var query = inputField.value.toLowerCase().trim();
    const searchData = fetchData
    searchData.searchString = query
    ipcRenderer.send(
      "apiRequest",
      searchData,
      "http://127.0.0.1:8000/api/standards/search",
      "allStandardResponse"
    );


  }, 300);
}


function createOptionButton(text) {
  const button = document.createElement("div");
  button.textContent = text;
  button.classList.add("option-button");
  return button;
}

function addStandard(index, name) {
  if (!selectedStandards[selectedType].find((item) => item.id === index)) {
    selectedStandards[selectedType].push({ id: index, name: name });
    displaySelectedStandards();
  }
}

function editStandard(index, name) {
  console.log(`id: ${index}, name: ${name}`);
  fetchData["standard_id"] = index;
  ipcRenderer.send(
    "apiRequest",
    fetchData,
    "http://127.0.0.1:8000/api/fetchstandards",
    "standardDictsResponse"
  );
}

// When the user clicks on the button, open the modals
function attachEventListenerToSelect() {
  var selects = standardsDiv.querySelectorAll("select");
  selects.forEach((select) => {
    select.addEventListener("change", getCurentName);
  });
}

function attachEventListenerToButton(button, dict) {
  let select = dict;
  button.addEventListener("click", function () {
    let index = button.id.split("editdict")[1];
    displayDictModal(select);
  });
}

function attachRemove(button) {
  button.addEventListener("click", function () {
    button.parentElement.remove();
  });
}

attachEventListenerToSelect();
function clearStandardModal() {
  demofield.value = "";
  document.getElementById("standard_name").value = "";
  standards.innerHTML = "";
}

document.getElementById("new_standard").addEventListener("click", function () {
  updateStandardModal(defaultStandard);
});

// When the user clicks on <span> (x), close the modals
closeStandardModal.onclick = function () {
  standardModal.style.display = "none";
  clearStandardModal();
};

closeDictionaryModal.onclick = function () {
  dictionaryModal.style.display = "none";
  standardModal.style.display = "block";
};


function addNewDictionary(dictionaryData, name = "") {
  var dictionary = dictionaryData.options;
  var standards = document.getElementById("standards");
  var standardDiv = document.createElement("div");
  standardDiv.draggable = true; // Make the div draggable

  var dict = document.createElement("select");
  dict.dataset.name = dictionaryData.name;
  dict.dataset.id = dictionaryData.id;

  const header = document.createElement("h2");
  header.textContent = dictionaryData.name;

  var edit = document.createElement("button");
  edit.type = "button";
  edit.id = "editdict" + dictionaryData.id;
  edit.innerHTML = "edit";

  var remove = document.createElement("button");
  remove.type = "button";
  remove.innerHTML = "remove";

  for (var key in dictionary) {
    var opt = document.createElement("option");
    opt.value = dictionary[key];
    opt.innerHTML = key;
    dict.appendChild(opt);
  }

  const dropTarget = document.querySelector(".drop-target"); // Define dropTarget

  standardDiv.appendChild(header);
  standardDiv.appendChild(edit);
  standardDiv.appendChild(dict);
  standardDiv.appendChild(remove);
  standards.insertBefore(standardDiv, dropTarget);
  attachRemove(remove);
  attachEventListenerToSelect();
  attachEventListenerToButton(edit, dict);

  standardDiv.addEventListener("dragstart", function () {
    draggedItem = standardDiv;
    setTimeout(() => {
      standardDiv.style.display = "none"; // Hide the original element while dragging
      dropTarget.style.display = "grid"; // Show drop target
    }, 10);
  });

  standardDiv.addEventListener("dragend", function () {
    setTimeout(() => {
      draggedItem.style.display = "grid"; // Show the original element after dragging
      draggedItem = null;
      dropTarget.style.display = "none"; // Hide drop target
    }, 10);
  });

  standardDiv.addEventListener("dragover", function (e) {
    e.preventDefault(); // Allow drop
  });

  standardDiv.addEventListener("dragenter", function (e) {
    e.preventDefault(); // Allow drop
    this.classList.add("drag-over");
  });

  standardDiv.addEventListener("dragleave", function () {
    this.classList.remove("drag-over");
  });

  standardDiv.addEventListener("drop", function () {
    this.classList.remove("drag-over");
    if (draggedItem !== this) {
      const parent = this.parentNode;
      parent.insertBefore(draggedItem, this);
    }
  });

}


function createNewDivider(value = "") {
  const input = document.createElement("input")
  input.type = "text"
  input.maxLength = 1
  input.value = value
  input.addEventListener("change", getCurentName)
  return input
}
function getCurentName() {
  demofield.value = "";
  standardsDiv.querySelectorAll("select").forEach(select => demofield.value += select.value)
}

document.getElementById("add_new_dict").addEventListener("click", function () {
  addNewDictionary(testStandardList);
});

function displayDictModal(select) {
  if (select != null) {
    var options = select.querySelectorAll("option");
    var optionsContainer = document.getElementById("options");
    dictionaryNameField.value = select.dataset.name;
    optionsContainer.innerHTML = "";

    options.forEach((option) => {
      var newOption = addOption();
      newOption.children[0].value = option.innerHTML;
      newOption.children[1].value = option.value;
    });
  }

  var new_btn = addDictionaryBtn.cloneNode(true);
  addDictionaryBtn.parentNode.replaceChild(new_btn, addDictionaryBtn);
  addDictionaryBtn = new_btn;
  addDictionaryBtn.addEventListener("click", function () {
    var inputs = optionsContainer.querySelectorAll("input");
    const name = dictionaryNameField.value;
    if (name == null || name == "") {
      showError("Enter a name");
      return;
    }
    if (inputs.length < 2) {
      showError("You have to add at least 1 option");
      return;
    }
    select.innerHTML = "";
    select.name = dictionaryNameField.value;
    for (let i = 0; i < inputs.length; i++) {
      var opt = document.createElement("option");
      opt.innerHTML = inputs[i].value;
      opt.value = inputs[++i].value;
      select.appendChild(opt);
    }
    select.parentElement.firstElementChild.innerHTML = name
    select.dataset.name = name;
    select.name = name;
    dictionaryModal.style.display = "none";
    standardModal.style.display = "block";
  });

  dictionaryModal.style.display = "block";
  standardModal.style.display = "none";
}

function addOption() {
  var optionsContainer = document.getElementById("options");
  var optionDiv = document.createElement("div");
  optionDiv.classList.add("option");
  var key = document.createElement("input");
  key.placeholder = "key";
  key.name = "option_key[]";
  key.type = "text";

  var value = document.createElement("input");
  value.placeholder = "value";
  value.name = "option_value[]";
  value.type = "text";

  var remove = document.createElement("button");
  remove.type = "button";
  remove.innerHTML = "remove";

  optionDiv.appendChild(key);
  optionDiv.appendChild(value);
  optionDiv.appendChild(remove);
  optionsContainer.appendChild(optionDiv);
  attachRemove(remove);
  return optionDiv;
}

document.getElementById("add_option").addEventListener("click", function () {
  addOption();
});

submitStandard.addEventListener("click", function () {
  const name = document.getElementById("standard_name").value;
  if (name == null || name == "") {
    showError("Enter a name");
    return;
  }
  var standardData = { 'name': name };

  standardData.dict_data = [];

  // Get all select elements within standardsDiv
  var selects = standardsDiv.querySelectorAll("select");
  if (selects.length < 1) {
    showError("you have to have at least 1 dictionary of options");
    return;
  }


  // Iterate over each select element

  selects.forEach((select) => {
    var data = {};
    data.name = select.dataset.name;
    data.options = {};
    // Object to hold data for each select element

    // Iterate over each option in the select element
    select.querySelectorAll("option").forEach((option) => {
      // Add option value to the data object
      let key = option.innerHTML;
      let value = option.value;
      data.options[key] = value;
    });

    // Push the data object to the dicts array in dictsData
    standardData.dict_data.push(data);


  });
  standardData.token = localStorage.getItem("token");
  console.log(JSON.stringify(standardData));
  ipcRenderer.send(
    "apiRequest",
    standardData,
    "http://127.0.0.1:8000/api/addnewstandard",
    "allStandardResponse"
  );
});

ipcRenderer.send(
  "apiRequest",
  fetchData,
  "http://127.0.0.1:8000/api/fetchstandards",
  "allStandardResponse"
);
ipcRenderer.on("allStandardResponse", (event, responseData) => {
  var response = JSON.parse(responseData);
  console.log(response);
  clearStandardModal();
  standardModal.style.display = "none";
  gridItemsData = response;
  addItems(gridItemsData);

});
ipcRenderer.on("standardDictsResponse", (event, responseData) => {
  var response = JSON.parse(responseData);
  document.getElementById("standard_name").value = response.name;
  updateStandardModal(response.dict_data)
});

function updateStandardModal(dictList) {
  console.log(dictList)
  standardsDiv.innerHTML = "";
  const dropTarget = document.createElement("div");
  dropTarget.classList.add("drop-target");
  dropTarget.style.display = "none"
  dropTarget.addEventListener("dragover", function (e) {
    e.preventDefault(); // Allow drop
  });

  dropTarget.addEventListener("dragenter", function () {
    this.classList.add("drag-over");
  });

  dropTarget.addEventListener("dragleave", function () {
    this.classList.remove("drag-over");
  });

  dropTarget.addEventListener("drop", function () {
    const parent = this.parentNode;
    parent.insertBefore(draggedItem, this); // Drop at the last position
    draggedItem.style.display = "block"; // Show the original element after dragging
    this.style.display = "none"; // Hide drop target
  });
  standardsDiv.appendChild(dropTarget);
  standardModal.style.display = "block";
  dictList.forEach((dict) => {
    addNewDictionary(dict);
  });

  getCurentName()
}

const form = document.getElementById("project_form");
form.addEventListener("submit", (event) => {
  event.preventDefault();
  const formData = new FormData(form);
  const formDataObject = {};

  formDataObject["name"] = formData.get("project_name");
  formDataObject["standards"] = Object.entries(selectedStandards).reduce((acc, [key, value]) => {
    acc[key] = value.map(obj => obj.id);
    return acc;
  }, {});;
  formDataObject["token"] = localStorage.getItem("token");
  console.log(formDataObject);
  ipcRenderer.send(
    "apiRequest",
    formDataObject,
    "http://127.0.0.1:8000/api/addnewproject",
    "newProject"
  );
});

ipcRenderer.on("newProject", (event, responseData) => {
  console.log("data: " + responseData);
  showError(JSON.parse(responseData).response, false);
});
