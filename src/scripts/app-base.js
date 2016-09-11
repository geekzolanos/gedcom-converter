//
//  App-Base.js
//  Home of namespace App
//
const fs = require('fs');
const path = require('path');

//
// Namespace APP
//
let app = {}

window.addEventListener('load', () => {
    app.vWrapper = new ViewerWrapper();
    app.ui = new UIManager();    
});