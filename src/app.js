const electron = require('electron');
const app = electron.app;
const BrowserWindow = electron.BrowserWindow;

// App version
global._VERSION = "1.0.1";

// BrowserWindow Nodes
let mainWindow = null;
let splashScreen = null;

function load() {
    // MainWindow Prefs
    mainWindow = new BrowserWindow({
        width: 750,
        height: 450,
        resizable: false,
        show: false
    });    
    mainWindow.setMenu(null);

    // BrowserWindow Path
    mainWindow.loadURL('file://' + __dirname + '/main.html');

    // BrowserWindow Events
    mainWindow.on('ready-to-show', () => {
        mainWindow.show();
        splashScreen.hide();
    });

    mainWindow.on('closed', () => {
        app.quit();
    });
}

function start() {
    splashScreen = new BrowserWindow({
        width: 300,
        height: 150,
        frame: false,
        show: false
    });

    splashScreen.loadURL('file://' + __dirname + '/loader.html');
    splashScreen.on('ready-to-show', () => {
        splashScreen.show();
        load();
    });
}
app.on('ready', start);