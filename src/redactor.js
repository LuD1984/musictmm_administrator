const moment = require("moment");

let REDACTOR = {};
const exeptionsRedactor = {
    songs: ['songs', 'songs_for_playlists'],
    category: ['style_category', 'mood_category', 'business_category'],
}

const updateRedactor = (data) => {
    REDACTOR = data;
    UIkit.notification({ message: 'Update data for redactor', status: 'success', timeout: 2000 });
    console.log('Update data for redactor: ', REDACTOR);
    createNavRedactor();
};






module.exports = { updateRedactor };



// functions private
function createNavRedactor() {
    $('.nav-redactor').empty();
    for (key in REDACTOR) {
        let navItem = document.createElement('button');
        navItem.className = 'uk-button uk-button-default';
        navItem.id = key;
        navItem.innerHTML = key;
        document.querySelector('.nav-redactor').appendChild(navItem);
    }

    // events
    $('.nav-redactor button').click((event) => {
        let key = event.target.id;
        let data = REDACTOR[key];
        updateRedactorTable(data, key);
    });

    $('.nav-redactor').css('display', 'block');
}


function updateRedactorTable(data, buttonName) {
    $('.redactor-table').css('display', 'none');
    $('.redactor-table').empty();

    // Create table rows
    for (let key in data) {
        let rowData = data[key];
        let tableRow = document.createElement('tr');
        let td = document.createElement('td');
        (exeptionsRedactor.category.includes(buttonName)) ? td.id = rowData['name'] : td.id = rowData['id'];
        (exeptionsRedactor.songs.includes(buttonName)) ? td.textContent = rowData['artist'] + ' - ' + rowData['title'] : td.textContent = rowData['name'];
        tableRow.appendChild(td);

        $('.redactor-table').append(tableRow);

        // events
        $(td).click((event) => {
            let id = event.target.id;
            console.log('click on: ', id + ":" + buttonName);
            showModalForRedactor(id, buttonName);
        });
    }

    $('.redactor-table').css('display', 'block');
}


function showModalForRedactor(id, buttonName) {



    let data = (!exeptionsRedactor.category.includes(buttonName)) ? REDACTOR[buttonName].find(item => parseInt(item.id) === parseInt(id)) : REDACTOR[buttonName].find(item => item.name === id);
    console.log(data);
    let modal = document.createElement('div');
    modal.className = 'uk-modal-full';
    modal.innerHTML = `
        <div class="uk-modal-dialog">
            <button class="uk-modal-close-full uk-close-large" type="button" uk-close></button>

            <div class="uk-modal-header">
                <h2 class="uk-modal-title">${(exeptionsRedactor.songs.includes(buttonName)) ? data.artist + " - " + data.title : data.name}</h2>
            </div>

            <div class="uk-card uk-card-default uk-grid-collapse uk-child-width-1-2@s uk-margin" style="height: 75%;" uk-grid>
                <div class="uk-card-media-left uk-cover-container redactor-img-playlist" style="width: 25%;">
                    <img src="img/poster_deff.jpeg" style="width: 100%; height: auto;" alt="" uk-cover>
                </div>
                <div style="width: 75%; background: #304444;">
                    <div class="uk-card-body redactor-card-edit-content"></div>
                </div>
            </div>

        </div>
    `;

    let imageElement = modal.querySelector('.redactor-img-playlist');
    let uploadImg = () => {
        // Новое имя файла, которое нужно передать на сервер
        const newName = `${data.poster}`;
        const fileInput = document.createElement('input');
        fileInput.type = 'file';
        fileInput.accept = 'image/*';
        fileInput.addEventListener('change', (event) => {
            const file = event.target.files[0];
            const formData = new FormData();

            // Добавляем файл в formData
            formData.append('image', file);
            // Добавляем новое имя файла в formData
            formData.append('imageName', newName);

            // Отправляем запрос на сервер для загрузки изображения
            fetch('https://musictmm.com/img_upload', {
                method: 'POST',
                body: formData
            })
                .then(response => response.json())
                .then(data => {
                    // Обновляем источник изображения с загруженным URL
                    //uk notification
                    console.log(data.imageUrl);
                    UIkit.notification({ message: 'Image uploaded successfully', status: 'success' });
                    imageElement.querySelector('img').src = path.join('https://musictmm.com', data.imageUrl);
                })
                .catch(error => {
                    console.error('Error uploading image:', error);
                });
        });

        // Добавляем элемент fileInput в тело документа
        document.body.appendChild(fileInput);

        // Симулируем клик по элементу fileInput, чтобы вызвать диалоговое окно выбора файла
        fileInput.click();
    };


    imageElement.addEventListener('click', uploadImg);

    if (buttonName === 'playlists') {
        const songs = REDACTOR.songs_for_playlists.filter(item => item.id_playlist === data.id);
        modal.querySelector('img').src = `https://musictmm.com/img/posters_new_reliases/${data.poster}`;
        modal.querySelector('.redactor-card-edit-content').innerHTML = `
            <h3>Playlist</h3>
            <p>id: <span style="color: black;">${data.id}</span></p>
            <p>name: <span style="color: black;">${data.name}</span></p>
            <p>count songs: <span style="color: black;">${songs.length}</span></p>
            <p>description: <span style="color: black;">${data.description}</span></p>
            <p>created: <span style="color: black;">${moment(data.date_create).format('DD-MM-YYYY')} / ${data.time_create}</span></p>
            <p>like: <span style="color: black;">${data.users_like}</span></p>
            <p>save to library: <span style="color: black;">${data.users_add}</span></p>
            <p><button class="uk-button uk-button-primary btn-in-card-playlist show-all-songs" type="button">Show all songs</button></p>
            <p><button class="uk-button uk-button-primary btn-in-card-playlist delete-playlist" type="button">Delete playlist</button></p>
        `;
        modal.querySelector('.show-all-songs').addEventListener('click', () => {

            let modalForSongs = document.createElement('div');
            modalForSongs.className = 'modal-close-default';
            modalForSongs.innerHTML = `
            <div class="uk-modal-dialog uk-modal-body modal-list-songs">
                <button class="uk-modal-close-default" type="button" uk-close></button>
                <h2 class="uk-modal-title">Default</h2>
            </div>
            `;

            let songsContent = modalForSongs.querySelector('.modal-list-songs');
            let countSongsModal = 0;
            songs.forEach(song => {
                songsContent.innerHTML += `
                    <div>
                        <p>${++countSongsModal}. ${song.artist} - ${song.title}</p>
                    </div>
                `;
            });

            document.body.appendChild(modalForSongs);
            UIkit.modal(modalForSongs).show();
        });
    }
    document.body.appendChild(modal);
    UIkit.modal(modal).show();
}

