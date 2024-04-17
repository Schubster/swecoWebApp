

const fetchData = {
  token: localStorage.getItem("token"),
  projectID: localStorage.getItem("currentProjectId"),
};

// custom dropdown
let gridItemsData = [];
let currentProjectId = localStorage.getItem("currentProjectId");
console.log(currentProjectId);
let debounceTimeout = null;

// JavaScript to filter dropdown content based on input search query
const inputField = document.querySelector(".dropdown-input");
const list = document.querySelector(".styled-list");
const filter = document.getElementById("filter");

inputField.addEventListener("input", () => search());
filter.addEventListener("change", () => search());

addItems(gridItemsData);

function addItems(dataList) {
    list.innerHTML = "";
    dataList.forEach((item) => {
      let type = 'green-button">Add <i class="fa-solid fa-user-plus"';
      if (item.isInProject)
        type = 'red-button">Remove <i class="fa-solid fa-user-slash"';
      const listItem = document.createElement("li");
      listItem.innerHTML = `
          <span>${item.email}</span>
          <button class="button ${type}"></i></button>
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
    var query = inputField.value.toLowerCase().trim();
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

function search() {
  clearTimeout(debounceTimeout);
  debounceTimeout = setTimeout(() => {
    var query = inputField.value.toLowerCase().trim();
    const searchData = fetchData;
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
  addItems(JSON.parse(responseData));
});
