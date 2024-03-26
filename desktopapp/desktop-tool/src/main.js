// Inside your main process file (main.js)

const { app, BrowserWindow, ipcMain, net, secureStore} = require('electron');
const path = require('path');
const Store = require('../lib/storage');
// const { safeStorage } = require('secure-electron-store');
// const secureStore = safeStorage('passphrase');
const store = new Store({
  // We'll call our data file 'user-preferences'
  configName: 'data',
});
let mainWindow;

// Handle creating/removing shortcuts on Windows when installing/uninstalling.
if (require('electron-squirrel-startup')) {
  app.quit();
}

// This method creates the main window and loads the index.html of the app
function createWindow() {
  // Create the browser window.
  mainWindow = new BrowserWindow({
    width: 800,
    height: 600,
    webPreferences: {

      nodeIntegration: true,
      contextIsolation: false,
      enableRemoteModule: true,
      preload: path.join(__dirname, 'render.js'),
    },
  });

  // Load the index.html of the app.
  mainWindow.loadFile(path.join(__dirname, 'index.html'));

  // Open the DevTools.
  mainWindow.webContents.openDevTools();

  // Return the window object
  return mainWindow;
}

function createFormWindow() {
  const formWindow = new BrowserWindow({
    width: 800,
    height: 600,
    webPreferences: {
      nodeIntegration: true,
      contextIsolation: false,
      enableRemoteModule: true,

    },
  });

  formWindow.loadFile(path.join(__dirname, 'form.html'));
  formWindow.webContents.openDevTools();


}

// Listen for the 'load-page' event from the renderer process
ipcMain.on('load-page', (event, fileName) => {
  mainWindow.loadFile(path.join(__dirname, fileName));
});


// This method will be called when Electron has finished
// initialization and is ready to create browser windows.
// Some APIs can only be used after this event occurs.

function fetchCSRFToken(callback) {
  const request = net.request({
    method: 'GET',
    url: 'http://127.0.0.1:8000/csrf_token/', // Replace with your CSRF token endpoint URL
  });

  request.on('response', (response) => {
    let data = '';

    response.on('data', (chunk) => {
      data += chunk;
    });

    response.on('end', () => {
      const csrfToken = JSON.parse(data).csrfToken;
      callback(csrfToken);
    });
  });

  request.end();
}




app.whenReady().then(() => {
  createWindow();

  // Listen for the 'fetchData' message from the renderer process
  ipcMain.on('fetchData', () => {
    // Fetch data from API
    const request = net.request('http://127.0.0.1:8000/')
    request.on('response', (response) => {
      let data = '';
      response.on('data', (chunk) => {
        data += chunk;
      })
      response.on('end', () => {
        // Send data to renderer process
        mainWindow.webContents.send('apiData', data);
      })
    })
    request.end();
  });
});

ipcMain.on('postData', (event, data) => {
  // Handle the data posted from the form
  console.log('Received form data:', data);
  console.log('jsonData:', JSON.stringify(data))

  // Example: Send data back to the API
  const request = net.request({
    method: 'POST',
    url: 'http://127.0.0.1:8000/post/',
    headers: {
      'Content-Type': 'application/json',
    },
  });
  request.write(JSON.stringify(data));
  request.end();
});

ipcMain.on('login', (event, loginData) => {
  // Fetch CSRF token
  fetchCSRFToken((csrfToken) => {
    // Create POST request
    const request = net.request({
      method: 'POST',
      url: 'http://127.0.0.1:8000/api/login',
      headers: {
        'Content-Type': 'application/json',
        'X-CSRFToken': csrfToken, // Include CSRF token in request headers
      },
    });

    // Send POST request
    request.on('response', (response) => {
      let responseData = '';

      response.on('data', (chunk) => {
        responseData += chunk;
      });

      response.on('end', () => {
        console.log('Response from server:', responseData);
        //responseObj =  JSON.parse(responseData)

        mainWindow.webContents.send('displayApiResponse', responseData);
        
        // Handle response as needed
      });
    });

    request.write(JSON.stringify(loginData));
    request.end();
  });
});


ipcMain.on('register', (event, data) => {
  // Fetch CSRF token
  fetchCSRFToken((csrfToken) => {
    // Create POST request
    const request = net.request({
      method: 'POST',
      url: 'http://127.0.0.1:8000/api/register',
      headers: {
        'Content-Type': 'application/json',
        'X-CSRFToken': csrfToken, // Include CSRF token in request headers
      },
    });

    // Send POST request
    request.on('response', (response) => {
      let responseData = '';

      response.on('data', (chunk) => {
        responseData += chunk;
      });

      response.on('end', () => {
        console.log('Response from server:', responseData);
        // responseObj =  JSON.parse(responseData)

        mainWindow.webContents.send('displayApiResponse', responseData);
        
        // Handle response as needed
      });
    });

request.write(JSON.stringify(data));
request.end();
});
});

ipcMain.on('apiResponse', (event, responseData) => {
  // Send the response data to the renderer process
  mainWindow.webContents.send('displayApiResponse', responseData);
});

// Quit when all windows are closed, except on macOS. There, it's common
// for applications and their menu bar to stay active until the user quits
// explicitly with Cmd + Q.
app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') {
    app.quit();
  }
});

app.on('activate', () => {
  // On OS X it's common to re-create a window in the app when the
  // dock icon is clicked and there are no other windows open.
  if (BrowserWindow.getAllWindows().length === 0) {
    createWindow();
  }
});

// In this file you can include the rest of your app's specific main process
// code. You can also put them in separate files and import them here.
