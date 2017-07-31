const electron = require('electron')
const settings = require('electron-settings')
const {ipcMain} = electron;
// Module to control application life.
const app = electron.app
// Module to create native browser window.
const BrowserWindow = electron.BrowserWindow

// Keep a global reference of the window object, if you don't, the window will
// be closed automatically when the JavaScript object is garbage collected.
let mainWindow

function createWindow () {
  // Create the browser window.
  mainWindow = new BrowserWindow({width: 1830, height: 900})

  // and load the index.html of the app.
  mainWindow.loadURL(`file://${__dirname}/dist/index.html`)

  // Open the DevTools.
  mainWindow.webContents.openDevTools()

  // Emitted when the window is closed.
  mainWindow.on('closed', function () {
    // Dereference the window object, usually you would store windows
    // in an array if your app supports multi windows, this is the time
    // when you should delete the corresponding element.
    mainWindow = null
  })
  // logout();
}

// This method will be called when Electron has finished
// initialization and is ready to create browser windows.
// Some APIs can only be used after this event occurs.
app.on('ready', createWindow)

// Quit when all windows are closed.
app.on('window-all-closed', function () {
  // On OS X it is common for applications and their menu bar
  // to stay active until the user quits explicitly with Cmd + Q
  if (process.platform !== 'darwin') {
    app.quit()
  }
})

app.on('activate', function () {
  // On OS X it's common to re-create a window in the app when the
  // dock icon is clicked and there are no other windows open.
  if (mainWindow === null) {
    createWindow()
  }
})

function logout(){
  mainWindow.webContents.session.cookies.get({}, function(error, cookies){
    if(error){
      return console.log(error);
    }
    for(var i = cookies.length; i >= 0; i--){
      if(cookies[i]){
        var url = "http" + (cookies[i].secure ? "s" : "") + "://" +cookies[i].domain + cookies[i].path;
        var name = cookies[i].name;
        mainWindow.webContents.session.cookies.remove(url, name, function(error){
          if(error){
            return console.log(error);
          }
        });
      }
    }
  });
}

ipcMain.on('logout', (event, arg) => {
  if( logout() == null){
    event.sender.send('logout-success');
  }
});


// In this file you can include the rest of your app's specific main process
// code. You can also put them in separate files and require them here.

const initialState = {
  state: 'Login',
  token: null,
  limit: 6,
  width: 600,
  height: 400
}

if (!settings.get('state')) {
  settings.set('state', initialState)
}

ipcMain.on('stateRequest', (event, arg) => {
  const state = settings.get('state')
  event.sender.send('state', state)
})

ipcMain.on('updateState', (event, arg) => {
  settings.set('state', arg)
  // const state = settings.get('state')
  // event.sender.send('state', state)
})

// settings.set('state', initialState)
// console.log(settings.get('state'))
