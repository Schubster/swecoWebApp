




// custom dropdown
let userGridItemsData = [];
let currentProjectId = localStorage.getItem("currentProjectId");
console.log(currentProjectId);
let userDebounceTimeout = null;

// JavaScript to filter dropdown content based on input search query
const userInputField = document.querySelector(".user-dropdown-input");
const list = document.querySelector(".styled-list");
const filter = document.getElementById("filter");
const addBtn = document.getElementById("add-user-btn")
userInputField.addEventListener("input", () => searchUser());
filter.addEventListener("change", () => searchUser());
addBtn.addEventListener("click", ()=>{
  const regex = /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|.(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/
  const email = userInputField.value
  if(regex.test(email)){
    updateUser(email)
  }
  else{
    showError("måste var ett giltligt email")
  }
})
searchUser()
    
addUser(userGridItemsData);

function addUser(dataList) {
    list.innerHTML = "";
    dataList.forEach((item) => {
      let type = 'green-button">Add <i class="fa-solid fa-user-plus"';
      if (item.isInProject)
        type = 'red-button">Remove <i class="fa-solid fa-user-slash"';
      const listItem = document.createElement("li");
      listItem.innerHTML = `
          <span>${item.email}</span>
          <button class="user-button ${type}"></i></button>
      `;
      list.appendChild(listItem);
      const button = listItem.querySelector("button");
      button.addEventListener("click", () => {
        updateUser(item.email);
      });
    });
  }
  
  function updateUser(email) {
    const updateData = fetchData
    updateData.email = email
    var query = userInputField.value.toLowerCase().trim();
    updateData.searchString = query;
    updateData.filter = filter.value
    console.log(updateData)
    ipcRenderer.send(
        "apiRequest",
        updateData,
        "http://127.0.0.1:8000/api/users/update/member",
        "usersResponse"
      )
  }

function searchUser() {
  clearTimeout(userDebounceTimeout);
  userDebounceTimeout = setTimeout(() => {
    var query = userInputField.value.toLowerCase().trim();
    const searchData = fetchData
    searchData.searchString = query;
    searchData.filter = filter.value
    ipcRenderer.send(
      "apiRequest",
      searchData,
      "http://127.0.0.1:8000/api/users/search",
      "usersResponse"
    );
  }, 300);
}

ipcRenderer.on("usersResponse", (event, responseData) => {
  console.log("data: " + responseData);
  addUser(JSON.parse(responseData));
});
