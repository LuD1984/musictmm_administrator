const mm = require('music-metadata-browser');


function showFilePicker() {
    const input = document.createElement('input');
    input.type = 'file';
    input.multiple = true;
    input.accept = 'audio/mp3';
    input.onchange = handleFileSelect;
    input.click();
}

function handleFileSelect(event) {
    const files = event.target.files;
    const formData = new FormData();

    for (let i = 0; i < files.length; i++) {
        formData.append('uploadedFiles', files[i]);
    }
    $('.upload-message').css('display', 'block');
    sendDataToServer(formData);
}

function sendDataToServer(formData) {
    fetch('https://musictmm.com/upload_songs', {
        method: 'POST',
        body: formData
    })
        .then(response => {
            if (!response.ok) {
                throw new Error('Произошла ошибка при отправке данных на сервер.');
            }
            return response.json();
        })
        .then(data => {
            console.log('Данные успешно отправлены на сервер:', data);
            $('.upload-message').text('Файлы успешно загружены на сервер');
            setTimeout(() => { $('.upload-message').hide(1000) }, 3000);
        })
        .catch(error => {
            console.error('Ошибка:', error.message);
        })
}

const createNewPlFromLastUpload = () => {
    $('.header-control-last-upload').hide(500);
    $('.header-control-last-upload').text('create new playlist');
    $('.header-control-last-upload').show(1000);
    $('.form-create-playlist-from-last-upload').show();
}

const insertLastUploadToPlaylist = () => {
    $('.header-control-last-upload').hide(500);
    $('.header-control-last-upload').text('insert to playlist');
    $('.header-control-last-upload').show(1000);
}

let PRIVAT = 0;
let BUSINESS = "NULL";
let MOOD = "NULL";
let STYLE_LIST = "NULL";
async function submitNewPlaylistLastUpload(id) {

    switch (id) {
        case 'next-1':
            const namePlaylist = $('#name-new-playlist-last-upload').val();

            const discriptionPlaylist = $('#discription-new-playlist-last-upload').val() === ''
                ? '"Music that heals the soul, inspires accomplishments, and makes the heart beat in the rhythm of joy." 🎵✨'
                : $('#discription-new-playlist-last-upload').val();

            if (namePlaylist === '') {
                UIkit.notification({ message: 'Enter playlist name', status: 'warning' });
                return;
            }
            try {
                $('.submit-create-playlist-last-upload').hide(500);
                $('#name-new-playlist-last-upload, #discription-new-playlist-last-upload').hide(1000);
            } catch (error) {
                console.log(error);
                return;
            } finally {
                const nextStep = document.createElement('div');
                nextStep.style.display = 'none';
                nextStep.innerHTML = `
                    <p id="nameNewPlaylistLastUpload" style="color: cadetblue; text-shadow: 0 0 5px cadetblue; text-decoration: underline; font-size: 1.5rem;">${namePlaylist}</p>
                    <p id="discriptionNewPlaylistLastUpload" style="color: cadetblue; text-shadow: 0 0 5px cadetblue;">${discriptionPlaylist}</p>
                    <p class="btn-group-private-public" style="margin-top: 15%;" uk-margin>
                        <button class="uk-button-default" id="private" style="font-size: 1.2rem; font-family: monospace;" onclick="submitNewPlaylistLastUpload(this.id)">[ private ]</button>
                        <button class="uk-button-default" id="public" style="font-size: 1.2rem; font-family: monospace;" onclick="submitNewPlaylistLastUpload(this.id)">[ public ]</button>
                    </p>
                `;
                $('.form-create-playlist-from-last-upload').prepend(nextStep);
                $(nextStep).show(1000);
            }


            break;

        case 'public':
            console.log('public');

            break;

        case 'private':
            PRIVAT = 1;
            try {
                $('.btn-group-private-public').hide();
                $('.btn-group-private-public').empty();
                $('.btn-group-private-public').append(`
                    <label class="uk-form-label" for="form-stacked-select">Assign to:</label>
                    <select class="uk-select select-clients-last-upload" aria-label="Select" style="width: 80%"></select>
                    <button class="uk-button-default" id="confirm-private" style="font-size: 1.2rem; font-family: monospace;" 
                        onclick="submitNewPlaylistLastUpload(this.id)">[ confirm ]
                    </button>
                `);

                globalData.allClients.forEach(element => {
                    $('.select-clients-last-upload').append(`<option>${element.name_organization}</option>`);
                });

            } catch (error) {
                console.log(error)
            } finally {
                $('.btn-group-private-public').show();
            }

            break;

        case 'confirm-private':
            const dataNewPlaylist = {
                name: $('#nameNewPlaylistLastUpload').text(),
                description: $('#discriptionNewPlaylistLastUpload').text(),
                owner: $('.select-clients-last-upload').val(),
                privat: PRIVAT,
                date_create: moment().format('YYYY-MM-DD'),
                time_create: moment().format('HH:mm:ss'),
                business: BUSINESS,
                mood: MOOD,
                style_list: STYLE_LIST,
                poster: 'deffault.jpeg',
                count_songs: globalData.arrayLastUploadSongs.length,
                songs: globalData.arrayLastUploadSongs
            }

            socket.emit('save_new_playlist', dataNewPlaylist);
            break;
    }

}
