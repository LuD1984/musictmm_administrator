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

// Handle incoming messages*************************************************************************************************
socket.on('message', (message) => {
    console.log('Received message:', message);
});

socket.on('all_clients', (data) => { globalData.allClients = data });

socket.on('last_upload', (data) => {

    globalData.arrayLastUploadSongs = data;
    $('.list-last-upload-songs').empty();
    $('.header-control-last-upload').empty().hide();
    $('.form-create-playlist-from-last-upload').hide();
    for (key in data) { $('.list-last-upload-songs').append(`<li>${data[key].artist} - ${data[key].title}</li>`) }
    UIkit.modal('#modal-last-upload', { stack: true }).show(); // Показать модальное окно

})

// Send a message to the room*************************************************************************************************
socket.emit('message', 'Hello, administrator!');

//events
$('.btn-administrator').click(() => {
    $('.btn-administrator').css({ 'color': 'aqua', 'text-shadow': '0 0 10px aqua' });
    $('.btn-redactor').css({ 'color': 'grey', 'text-shadow': 'none' });

    $('.nav-redactor', '.redactor-table').hide(500);
    UIkit.notification({ message: '<span uk-icon=\'icon: check\'></span> Get all data administrator', timeout: 1000 });
    socket.emit('joinRoom', 'administrator');
    socket.emit('get_online_clients');
});

$('.btn-redactor').click(() => {
    $('.btn-redactor').css({ 'color': 'aqua', 'text-shadow': '0 0 10px aqua' });
    $('.btn-administrator').css({ 'color': 'grey', 'text-shadow': 'none' });

    socket.emit('joinRoom', 'redactor');
    console.log('connect to "redactor"');
});


//answer from server*************************************************************************************************
socket.on('redactor-data', (data) => { updateRedactor(data) });
socket.on('done_create_new_playlist', () => {
    UIkit.notification({ message: '<span uk-icon=\'icon: check\'></span> Create playlist status: OK' })
    setTimeout(() => { window.location.reload() }, 3000);
})

socket.on('success_edit_client', () => { UIkit.notification({ message: '<span uk-icon=\'icon: check\'></span> Success edit data client', timeout: 1000 }); });
socket.on('error_edit_client', () => { UIkit.notification({ message: '<span style="color: red" uk-icon=\'icon: check\'></span> Error edit data client!!!', timeout: 2000 }); });

socket.on('add_client_status', (data) => {
    data.status === 'ok'
        ? UIkit.notification({ message: '<span uk-icon=\'icon: check\'></span> Success save new client. Panel will be reloaded in 5 seconds!', timeout: 5000 })
        : UIkit.notification({ message: '<span style="color: red" uk-icon=\'icon: check\'></span> Error save new client!!! Panel will be reloaded in 5 seconds!', timeout: 2000 });
    setTimeout(() => { window.location.reload() }, 6000);
})

socket.on('delete_user_status', (status) => {
    status === 'ok'
        ? UIkit.notification({ message: '<span uk-icon=\'icon: check\'></span> Success delete new client. Panel will be reloaded in 5 seconds!', timeout: 5000 })
        : UIkit.notification({ message: '<span style="color: red" uk-icon=\'icon: check\'></span> Error delete new client!!! Panel will be reloaded in 5 seconds!', timeout: 2000 });
    setTimeout(() => { window.location.reload() }, 6000);
})

function onlineOfflineSort(data) {
    
    const arrOnlineId = [];
    $('.online-clients').empty();
    $('.offline-clients').empty();

    for(const key of Object.keys(data)){ arrOnlineId.push(parseInt(key)) }
    console.log(arrOnlineId);
    for(const i of Object.keys(DATA.clients)) {

        const li = document.createElement('li');
        li.id = DATA.clients[i].id;
        li.innerHTML = DATA.clients[i].name_organization;

        if(!arrOnlineId.includes(DATA.clients[i].id)) { $('.offline-clients').append(li) }
        else { $('.online-clients').append(li) }
    }
}

socket.on('connect_client', (data) => { onlineOfflineSort(data) });
socket.on('disconnect_client', (data) => { onlineOfflineSort(data) });
socket.on('online_clients', (data) => { onlineOfflineSort(data) });





//get last upload songs*************************************************************************************************
function lastUpload() { socket.emit('getLastUpload') }

