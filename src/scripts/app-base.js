//
//  App-Base.js
//  Home of namespace App
//
const process = require('child_process');
const fs = require('fs');
const path = require('path');
const electron = require('electron').remote;
const ctxMenu = require('electron-contextmenu-middleware');
const inputCtxMenu = require('electron-input-menu');
const APP_START_PAGE = "selector";

//
// Namespace APP
//
window.app = {}