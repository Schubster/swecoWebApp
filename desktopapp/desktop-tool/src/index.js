// Inside form.js
const { ipcRenderer } = require('electron');



// const form = document.getElementById('data-form');
// const fileForm = document.getElementById('file-form');
// const fileInput = document.getElementById('file');
const inlogForm = document.getElementById('login-form');
const storeDiv = document.getElementById('storage');
const registerBtn = document.getElementById('button');

ipcRenderer.on('displayApiResponse', (event, responseData) => {
    // Update HTML elements to display the response data
    const responseContainer = document.getElementById('response-container');
    try{
        responseData = JSON.parse(responseData)
        if(responseData.hasOwnProperty("error")){
            responseContainer.textContent = JSON.stringify(responseData);
            document.getElementById('password').value = "";
            alert("error: " + responseData["error"])
        }
        else{
            for(var key in responseData){
                localStorage.setItem(key, responseData[key])
            }
        }

        ipcRenderer.send('load-page', 'projectview.html');
    }catch(er){
        console.log(er)
        document.body.innerHTML = responseData
    }
        


  });


registerBtn.addEventListener('click', (event) =>{
    ipcRenderer.send('load-page', 'form.html');
})


// fileForm.addEventListener('submit', (event)=> {
//     event.preventDefault();
//     const formData = new FormData(fileForm);
//     console.log(file.files[0].path);
// })

// form.addEventListener('submit', (event) => {
//     event.preventDefault();
//     const formData = new FormData(form);
//     const formDataObject = {};
//     formData.forEach((value, key) => {
//         formDataObject[key] = value;
//     });

//     ipcRenderer.send('postData', formDataObject);
// });



inlogForm.addEventListener('submit', (event) => {
    event.preventDefault();
    const formData = new FormData(inlogForm);
    const formDataObject = {};
    formData.forEach((value, key) => {
        formDataObject[key] = value;
    });

    ipcRenderer.send('login', formDataObject);

});