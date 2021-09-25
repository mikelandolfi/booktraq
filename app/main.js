//Google API terms of service: https://developers.google.com/books/terms
// BookTraq licensing terms (MIT License):
//Copyright (c) 2021 Mike Landolfi

//Permission is hereby granted, free of charge, to any person obtaining a copy
//of this software and associated documentation files (the "Software"), to deal
//in the Software without restriction, including without limitation the rights
//to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
//copies of the Software, and to permit persons to whom the Software is
//furnished to do so, subject to the following conditions:

//The above copyright notice and this permission notice shall be included in all
//copies or substantial portions of the Software.

//THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
//IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
//FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
//AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
//LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
//OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE
//SOFTWARE.

const {app, BrowserWindow, Menu, webContents} = require('electron');
//const mysql = require('mysql');

let mainWindow = null; 

// TODO main window (with partial view?) will be welcome.  buttons will allow navigation to data entry or inventory (datatables)
// i.e., input box and data display currently in index.html will be moved to data entry screen and files renamed (renderer, etc.)
app.on('ready', () => {
    mainWindow = new BrowserWindow({
        //fullscreen: true, 
        webPreferences: {
            nodeIntegration: true, // TODO possible security flaw
            contextIsolation: false,
        }
    });
    Menu.setApplicationMenu(null);
    mainWindow.webContents.loadFile('app/index.html');
    //mainWindow.setBackgroundColor('#d1b8b2'); // neither this nor a setting in mainwindow assignment works 
    mainWindow.openDevTools();
});
