const {app, BrowserWindow, ipcMain, Tray, Menu} = require('electron');
const request = require('request');
const path = require('path');
const Positioner = require('electron-positioner');
process.setMaxListeners(0);
let mainWindow;

// Quit when all windows are closed.
app.on('window-all-closed', () => {
  if (process.platform != 'darwin')
    app.quit();
});

// This method will be called when Electron has done everything
// initialization and ready for creating browser windows.
app.on('ready', () => {
  // Create the browser window.
  mainWindow = new BrowserWindow(
  	{
      title: "Currency",
  		width: 115,
  		height: 410,
  		alwaysOnTop: true,
  		resizable: false,
  		movable: true,
      frame: false,
  		icon: './public/icons/tray-ico.png',
  	}
  );

  //mainWindow.openDevTools();

  let iconPath = path.join(__dirname, 'public/icons/tray-ico.png');
  tray = new Tray(iconPath);
  const contextMenu = Menu.buildFromTemplate([
     {
      label: 'Quit',
      type: 'normal',
      click: function() {
        app.quit();
      }
     }
   ]);
   tray.setToolTip('Welcome')
   tray.setContextMenu(contextMenu)

  // and load the index.html of the app.
  mainWindow.loadURL('file://' + __dirname + '/views/index.html');

  var data = '';

  ipcMain.on('get-currency', (event,arg) => {
    if (arg === true){
      request('https://altin.doviz.com/api/v1/header', (error, response, body) => {
        if (error){ 
          event.sender.send('currency-reply', false);
        }else{
          if (arg === true){
            data = JSON.parse(body).splice(0,3);
            event.sender.send('currency-reply', data);
          }
        }
      });
    }
  });

  var positioner = new Positioner(mainWindow);
  positioner.move('center')

  // Emitted when the window is closed.
  mainWindow.on('closed', () => {
    // Dereference the window object, usually you would store windows
    // in an array if your app supports multi windows, this is the time
    // when you should delete the corresponding element.
    mainWindow = null;
  });
});

