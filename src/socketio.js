const io = require('socket.io-client');

const socket = io('https://musictmm.com');
const { updateRedactor } = require('./redactor');
global.globalData = {
    allClients: null,
    arrayLastUploadSongs: null,
}


socket.on('connect', () => {
    console.log('Connected to server');
    socket.emit('get_all_clients');
 });


socket.on('disconnect', () => {
    console.log('Disconnected from server');
});

// Handle incoming messages
socket.on('message', (message) => {
    console.log('Received message:', message);
});

socket.on('all_clients', (data) => { globalData.allClients = data });

socket.on('last_upload', (data) => {

    globalData.arrayLastUploadSongs = data;
    $('.list-last-upload-songs').empty();
    $('.header-control-last-upload').empty().hide();
    $('.form-create-playlist-from-last-upload').hide();
    for(key in data) { $('.list-last-upload-songs').append(`<li>${data[key].artist} - ${data[key].title}</li>`) }
    UIkit.modal('#modal-last-upload', { stack: true }).show(); // Показать модальное окно
    
})

// Send a message to the room
socket.emit('message', 'Hello, administrator!');

//events
$('.btn-administrator').click(() => {
    $('.btn-administrator').css({'color': 'aqua', 'text-shadow': '0 0 10px aqua'});
    $('.btn-redactor').css({'color': 'grey', 'text-shadow': 'none'});

    socket.emit('joinRoom', 'administrator');
});
$('.btn-redactor').click(() => {
    $('.btn-redactor').css({'color': 'aqua', 'text-shadow': '0 0 10px aqua'});
    $('.btn-administrator').css({'color': 'grey', 'text-shadow': 'none'});

    socket.emit('joinRoom', 'redactor');
    console.log('connect to "redactor"');
});


//answer from server
socket.on('redactor-data', (data) => { updateRedactor(data) });

//get last upload songs
function lastUpload () { socket.emit('getLastUpload') }