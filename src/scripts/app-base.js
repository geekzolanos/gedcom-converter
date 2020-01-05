//
//  App-Base.js
//  Home of namespace App
//
const process = require('child_process');
const fs = require('fs');
const path = require('path');
const electron = require('electron').remote;
const { shell } = require('electron');
const ctxMenu = require('electron-contextmenu-middleware');
const inputCtxMenu = require('electron-input-menu');
const APP_START_PAGE = "selector";
const GH_URL = 'https://www.github.com/geekzolanos/gedcom-converter/';

//
// Namespace APP
//
window.app = {};