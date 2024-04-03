const { ipcRenderer } = require('electron');

// Usage examp


if(!null)console.log("kos")


var testStandardList = {
  name: "",
  id: ""
}

var standardsDiv = document.getElementById("standards");
var demofield = document.getElementById("demofield");
var standardSelect = document.getElementById("standard");
var dictionaryNameField = document.getElementById("dictionary_name")
var submitStandard = document.getElementById("submit_standard")
var index = 0;

// Get the modals
var standardModal = document.getElementById("new_standard_modal");
var dictionaryModal = document.getElementById("new_dictionary_modal");

// Get the button that opens the modals
var addDictionaryBtn = document.getElementById("add_dictionary");
var standardButton = document.getElementById("edit_standard");
var createStandard = document.getElementById("create_standard");
var dictionaryButtons = standardsDiv.querySelectorAll("select");

// Get the <span> element that closes the modals
var closeStandardModal = document.getElementById("close_standard_modal");
var closeDictionaryModal = document.getElementById("close_dictionary_modal");

const fetchData = {"token" : localStorage.getItem("token")}
ipcRenderer.send('apiRequest', fetchData, 'http://127.0.0.1:8000/api/fetchstandards', "allStandardResponse");
ipcRenderer.on('allStandardResponse', (event, responseData) => {
  var response = JSON.parse(responseData)
  console.log(response)
  clearStandardModal()
  standardModal.style.display = "none"
  standardSelect.innerHTML = ''
  response.forEach((standard) => {
    var opt = document.createElement('option');
      opt.value = standard.id;
      opt.innerHTML = standard.name;
      standardSelect.appendChild(opt);
  })
});
ipcRenderer.on('standardDictsResponse', (event, responseData) => {
    var response = JSON.parse(responseData)
    document.getElementById("standard_name").value = response.name
    standardsDiv.innerHTML = ''
    
    response.dict_data.forEach((dict) =>{
      addNewDictionary(dict)
    })

  standardModal.style.display = "block";
  
    
  });



// When the user clicks on the button, open the modals
function attachEventListenerToSelect() {

    var selects = standardsDiv.querySelectorAll("select")
    selects.forEach((select) => {
        select.addEventListener("change", function() {
            selects = standardsDiv.querySelectorAll("select")
            demofield.value = "";
          selects.forEach((item) => {
            demofield.value += item.value;
          })
        });
    });
}

function attachEventListenerToButton(button, dict){
  let select = dict
  button.addEventListener("click", function() {
    index = button.id.split("editdict")[1]
    displayDictModal(select)
  })

}

function attachRemove(button){
  button.addEventListener("click", function() {
    button.parentElement.remove();
  })

}

attachEventListenerToSelect()
function clearStandardModal(){
  demofield.value =''
  document.getElementById("standard_name").value = ''
  standards.innerHTML = ''
}


standardButton.addEventListener("click", function() {
  clearStandardModal()
  fetchData["standard_id"] = standardSelect.value
  ipcRenderer.send('apiRequest', fetchData, "http://127.0.0.1:8000/api/fetchstandards", "standardDictsResponse");
});

createStandard.addEventListener("click", function(){
  clearStandardModal()
  standardModal.style.display = "block";
})


// When the user clicks on <span> (x), close the modals
closeStandardModal.onclick = function() {
  standardModal.style.display = "none";
  clearStandardModal()
}

closeDictionaryModal.onclick = function() {
  dictionaryModal.style.display = "none";
  standardModal.style.display = "block"
}

// When the user clicks anywhere outside of the modals, close it
// window.onclick = function(event) {
//   if (event.target == standardModal) {
//     standardModal.style.display = "none";
//   }
//   if (event.target == dictionaryModal) {
//     dictionaryModal.style.display = "none";
//   }
// }

function addNewDictionary(dictionaryData, name="", ){
  var dictionary = dictionaryData.options
  console.log(dictionary)
  var standards = document.getElementById("standards");
  var nmbrOfDicts = standards.children.length + 1;
  var standardDiv = document.createElement("div")
  var dict = document.createElement("select");
  dict.name = dictionaryData.name;
  dict.id = dictionaryData.id;

  var edit = document.createElement("button");
  edit.type = "button";
  edit.id = "editdict" + dictionaryData.id;
  edit.innerHTML= "edit";
  
  var remove = document.createElement("button");
  remove.type = "button";
  remove.innerHTML = "remove";



  for(var Key in dictionary){
    var opt = document.createElement('option');
    opt.value = dictionary[Key];
    opt.innerHTML = Key;
    dict.appendChild(opt);
  }

  standardDiv.appendChild(edit)
  standardDiv.appendChild(dict)
  standardDiv.appendChild(remove)
  standards.appendChild(standardDiv)
  attachRemove(remove)
  attachEventListenerToSelect()
  attachEventListenerToButton(edit, dict)

}

document.getElementById("add_new_dict").addEventListener("click", function(){
    addNewDictionary(testStandardList)
    
});

function displayDictModal(select){

  if(select != null){
    var options = select.querySelectorAll("option")
    var optionsContainer = document.getElementById("options");
    dictionaryNameField.value = select.name
    optionsContainer.innerHTML = '';

    options.forEach((option) => {
      var newOption = addOption()
      newOption.children[0].value = option.innerHTML
      newOption.children[1].value = option.value
    })
  }

  var new_btn = addDictionaryBtn.cloneNode(true);
  addDictionaryBtn.parentNode.replaceChild(new_btn, addDictionaryBtn);
  addDictionaryBtn = new_btn
  addDictionaryBtn.addEventListener("click", function () {
    var inputs = optionsContainer.querySelectorAll("input")
    select.innerHTML = '';
    for(let i = 0; i < inputs.length; i++){
      var opt = document.createElement('option');
      opt.innerHTML = inputs[i].value;
      opt.value = inputs[++i].value;
      
      
        select.appendChild(opt);
    }
    if(dictionaryNameField.value!="")select.name = dictionaryNameField.value
      else select.name = "dict"
    dictionaryModal.style.display = "none";
    standardModal.style.display = "block"
  })

  dictionaryModal.style.display = "block";
    standardModal.style.display = "none"
}

function addOption(){
  var optionsContainer = document.getElementById("options");
  var optionDiv = document.createElement("div");
  optionDiv.classList.add("option");
  var key = document.createElement("input")
  key.placeholder = "key"
  key.name = "option_key[]"
  key.type = "text"

  var value = document.createElement("input")
  value.placeholder = "value"
  value.name = "option_value[]"
  value.type = "text"

  var remove = document.createElement("button");
  remove.type = "button";
  remove.innerHTML = "remove";



  optionDiv.appendChild(key)
  optionDiv.appendChild(value)
  optionDiv.appendChild(remove)
  optionsContainer.appendChild(optionDiv);
  attachRemove(remove)
  return optionDiv
}

document.getElementById("add_option").addEventListener("click", function() {
  addOption();
  });


submitStandard.addEventListener("click", function() {
 var dictsData = {}

 
 dictsData.name = document.getElementById("standard_name").value
 dictsData.dict_data =[ ]
 
  
  // Get all select elements within standardsDiv
  var selects = standardsDiv.querySelectorAll("select");
  
  // Iterate over each select element
  
  selects.forEach((select) => {
    
    var data = {}
    data.name = select.name
    data.options = {}
    // Object to hold data for each select element
  
    // Iterate over each option in the select element
    select.querySelectorAll("option").forEach((option) => {
      // Add option value to the data object
      let key = option.innerHTML
      let value = option.value
      data.options[key] = value;
    });
  
    // Push the data object to the dicts array in dictsData
    dictsData.dict_data.push(data);
  });
  dictsData.token = localStorage.getItem("token")
  console.log(JSON.stringify(dictsData));
  ipcRenderer.send('apiRequest', dictsData, "http://127.0.0.1:8000/api/addnewdictionary", "allStandardResponse");
})

const form = document.getElementById("project_form")
form.addEventListener('submit', (event) => {
  event.preventDefault();
  const formData = new FormData(form);
  const formDataObject = {};
  
  formDataObject["name"] = formData.get("project_name")
  formDataObject["standardID"] = formData.get("standard")
  console.log(formData)
  console.log(formDataObject)
});