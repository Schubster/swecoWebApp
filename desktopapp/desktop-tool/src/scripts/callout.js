const { ipcRenderer } = require('electron');

function showError(message, error=true) {
    // Create error callout elements
    const errorCallout = document.createElement('div');
    errorCallout.id = 'errorCallout';
    var type = "error"
    if(!error)(type="success")
    errorCallout.classList.add('callout', type); // Adding 'error' class for styling
  
    const errorText = document.createElement('span');
    errorText.id = 'errorText';
    errorText.textContent = message;
    errorCallout.appendChild(errorText);
  
    const closeErrorButton = document.createElement('button');
    closeErrorButton.id = 'closeErrorButton';
    closeErrorButton.classList.add('close'); // Adding 'close' class for styling
    closeErrorButton.innerHTML = '&times;';
    closeErrorButton.addEventListener('click', () => {
        errorCallout.remove()
    });
    errorCallout.appendChild(closeErrorButton);
  
    // Append error callout to the top of the document body
    document.body.insertBefore(errorCallout, document.body.firstChild);
  
    // Show the callout
    setTimeout(() => {
        errorCallout.classList.remove('hidden');
    }, 100);
}

// Function to hide the error callout
function hideError(error) {
    const errorCallout = document.getElementById('errorCallout');
    error.remove();
}

ipcRenderer.on('errorResponse', (event, responseData) => {
    showError(JSON.parse(responseData).error)
});
