// const { ipcRenderer } = require('electron');

form = document.getElementById('register-form');

form.addEventListener('submit', (event) => {
    event.preventDefault();
    const formData = new FormData(form);
    const formDataObject = {};
    formData.forEach((value, key) => {
        formDataObject[key] = value;
    });
    ipcRenderer.send('apiRequest', formDataObject, "http://127.0.0.1:8000/api/register", "registerResponse");
    
});

ipcRenderer.on('registerResponse', (event, responseData) => {
    // Update HTML elements to display the response data
    ipcRenderer.send('load-page', 'projectview.html');



  });
