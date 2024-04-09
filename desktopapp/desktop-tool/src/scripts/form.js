//const { ipcRenderer } = require('electron');
// const { ipcRenderer } = require('electron');

form = document.getElementById('register-form');

form.addEventListener('submit', (event) => {
    event.preventDefault(); // Prevent default button click behavior

    var email = document.getElementById('email').value;
    var password = document.getElementById('password').value;
    var confirmPassword = document.getElementById('confirm-password').value;

    if (email.trim() === "") {
        alert("Email is required.");
        return;
    }
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


    if (password.trim() === "") {
        alert("Password is required.");
        return;
    }

    if (password !== confirmPassword) {
        alert("Passwords do not match.");
        return;
    }
console.log("success");
    // If all validation checks pass, continue with form submission
    const formData = {
        email: email,
        password: password,
        confirmPassword: confirmPassword
    };

   // ipcRenderer.send('register', formData);
});

// ipcRenderer.on('displayApiResponse', (event, responseData) => {
//     // Update HTML elements to display the response data
//     const responseContainer = document.getElementById('response-container');
//     if (responseData.hasOwnProperty("response")) {
//         ipcRenderer.send('load-page', 'projectview.html');
    //}
//});
