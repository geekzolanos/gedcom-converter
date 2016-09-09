const electron = require('electron');
const app = electron.app;
const BrowserWindow = electron.BrowserWindow;

let mainWindow = null;

function load() {
    mainWindow = new BrowserWindow({
        width: 640,
        height: 480,
        show: false
    });
    
    mainWindow.loadURL('file://' + __dirname + '/main.html');
    mainWindow.on('ready-to-show', () => {
        mainWindow.show();
    });
}

app.on('ready', load);