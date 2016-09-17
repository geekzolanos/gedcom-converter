//
//  App-Base.js
//  Home of namespace App
//
const process = require('child_process');
const fs = require('fs');
const path = require('path');
const electron = require('electron').remote;
const {shell} = require('electron');
const ctxMenu = require('electron-contextmenu-middleware');
const inputCtxMenu = require('electron-input-menu');
const APP_START_PAGE = "selector";
const UW_URL = 'http://www.upwork.com';
const GK_URL = 'http://geekzolanos.wordpress.com';

//
// Namespace APP
//
window.app = {};