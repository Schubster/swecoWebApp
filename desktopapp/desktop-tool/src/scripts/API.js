// Inside your renderer process file (index.js)

//const { ipcRenderer } = require('electron');

// Get the button element
const btn = document.getElementById("get");

// Add click event listener to the button
btn.addEventListener('click', () => {
  // Send a message to the main process to fetch data from the API
  ipcRenderer.send('fetchData');
});

// Listen for data from main process
ipcRenderer.on('apiData', (event, data) => {
  // Handle the received data
  console.log('Received data from main process:', data);
  // Example: Update UI with the fetched data
  document.getElementById('data-display').innerText = data;
});

const openFormButton = document.getElementById('openFormButton');
        openFormButton.addEventListener('click', () => {
            window.open('form.html', '_blank');
        });



