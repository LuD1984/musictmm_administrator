const { ipcRenderer } = require('electron');
const $ = require('jquery');
const path = require('path');
const moment = require('moment');

function sendMessage(channel, data) { ipcRenderer.send(channel, data) }  // Example usage sendMessage('myChannel', { message: 'Hello, world!' });




//events

$('.btn-close').click(() => { sendMessage('close', {}) });
$('.btn-min').click(() => { sendMessage('minimize', {}) });
