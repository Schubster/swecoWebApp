const { ipcRenderer } = require('electron');

form = document.getElementById('register-form');

form.addEventListener('submit', (event) => {
    event.preventDefault();
    const formData = new FormData(form);
    const formDataObject = {};
    formData.forEach((value, key) => {
        formDataObject[key] = value;
    });

    ipcRenderer.send('register', formDataObject);

});

ipcRenderer.on('displayApiResponse', (event, responseData) => {
    // Update HTML elements to display the response data
    const responseContainer = document.getElementById('response-container');
    if(responseData.hasOwnProperty("response")){
        ipcRenderer.send('load-page', 'projectview.html');
    }


  });
