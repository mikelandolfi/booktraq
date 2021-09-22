const {app, BrowserWindow, Menu, webContents} = require('electron');
//const mysql = require('mysql');

let mainWindow = null; 

// TODO main window will be welcome.  buttons will allow navigation to data entry or inventory (datatables)
// i.e., input box and data display currently in index.html will be moved to data entry screen and files renamed (renderer, etc.)
app.on('ready', () => {
    mainWindow = new BrowserWindow({
        fullscreen: true, 
        webPreferences: {
            nodeIntegration: true,
            contextIsolation: false,
        }
    });
    Menu.setApplicationMenu(null);
    mainWindow.webContents.loadFile('app/index.html');
    //mainWindow.setBackgroundColor('#d1b8b2'); // neither this nor a setteing in mainwindow assignment works 
    //mainWindow.openDevTools();
});
