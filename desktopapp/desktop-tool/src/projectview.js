const { ipcRenderer } = require('electron');



let email = localStorage.getItem("email")
const header = document.getElementById('header')
header.innerText = "login in as " + email

const addOptionBtn = document.getElementById("addOption")
    var dictonaryDiv = document.getElementById("dictionary1");
     var modal = document.getElementById("myModal");
    
        var btn = document.getElementById("newProjBtn");
    
        btn.onclick = function() {
      modal.style.display = "block";
    }
    
    
    var span = document.getElementById("closeSpan");
                        // modal.style.display = "block";
                    if (span) {
                        span.onclick = function () {
                            modal.style.display = "none";
                        };
                    }
      window.onclick = function(event) {
        if (event.target == modal) {
          modal.style.display = "none";
        }
      };
    addOptionBtn.onclick = function(){
       console.log("kos")
        options = dictonaryDiv.children.length / 4 + 1

        var newKeyLabel = document.createElement("label");
        newKeyLabel.htmlFor = "key" + options
        newKeyLabel.innerHTML = "key " + options
        dictonaryDiv.appendChild(newKeyLabel);

        
        var newKeyInput = document.createElement("input");
        newKeyInput.type = "text";
        newKeyInput.name = "key" + options;
        newKeyInput.className = "key";
        newKeyInput.id = "key" + options;
        dictonaryDiv.appendChild(newKeyInput);


        var newValueLabel = document.createElement("label");
        newValueLabel.htmlFor = "value" + options
        newValueLabel.innerHTML = "value " + options
        dictonaryDiv.appendChild(newValueLabel);

        var newValueInput = document.createElement("input");
        newValueInput.type = "text";
        newValueInput.name = "value" + options;
        newValueInput.className = "value";
        newValueInput.id = "value" + options;
        dictonaryDiv.appendChild(newValueInput);
    }
    const formProj = document.getElementById("newProject");

    formProj.onsubmit = function(event){
        event.preventDefault();
        const allInputs = dictonaryDiv.querySelectorAll('input');
        const namefield = document.getElementById("projectName");
        console.log(allInputs)
        console.log(namefield.value)
    }