//
//  App-Base.js
//  Home of namespace App
//
const fs = require('fs');
const path = require('path');
const electron = require('electron').remote;
const APP_START_PAGE = "selector";

//
// Namespace APP
//
let app = {}

window.addEventListener('load', () => {
    app.vWrapper = new ViewerWrapper();
    app.ui = new UIManager();    
});