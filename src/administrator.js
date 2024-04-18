

const DATA = { clients: [] }

socket.on('all_clients', (clients) => { DATA.clients = clients })


function printModalEditClient(client) {
    $('.title-modal-edit-client').text(client.name_organization);

    const exeptionItem = ['mac_adres', 'playlists', 'avatar', 'last_location', 'online', 'songs', 'information', 'type']
    const clientDataBlock = document.querySelector('.client-edit-data'); // Используем querySelector для выбора одного элемента
    clientDataBlock.innerHTML = ''; // Удаляем текущее содержимое элемента

    for (const item of Object.keys(client)) {
        if (!exeptionItem.includes(item)) {
            const p = document.createElement('p');
            const label = document.createElement('label');
            label.textContent = `${item}: `;
            const input = document.createElement('input');
            input.setAttribute('placeholder', item);
            input.className = 'input-data-edit-client';
            input.value = client[item];
            input.id = item;


            if (item === 'who_added' || item === 'last_connect' || item === 'id') {
                input.setAttribute('readonly', 'readonly');
                input.classList.add('readonly-no-shadow');
            }

            label.appendChild(input);
            p.appendChild(label);
            clientDataBlock.appendChild(p);
        }
    }

}

function showAllClients() {
    $('.body-work-space-administrator').empty();
    $('.title-work-space-administrator').text('All clients');
    const listClients = document.createElement('ul');
    listClients.className = 'uk-list list-all-clients-work-space';

    for (const i in DATA.clients) {
        const id = DATA.clients[i].id;
        const li = document.createElement('li');
        li.className = 'li-card-body-administrator';
        li.id = id;
        li.innerHTML = DATA.clients[i].name_organization;
        li.setAttribute("uk-toggle", "target: #modal-close-outside");

        li.addEventListener('click', function () {
            //DATA.clients - массив клиентов
            const client = DATA.clients.filter((item) => { if (item.id == id) { return item } })
            printModalEditClient(client[0]);
        });


        listClients.appendChild(li);
    }

    $('.body-work-space-administrator').append(listClients);
}

function printAdmin() {
    const divAdministrator = document.createElement('div');
    divAdministrator.className = 'administrator';

    const navAdministrator = document.createElement('p');
    navAdministrator.className = 'nav-administrator';
    navAdministrator.setAttribute('uk-margin', '');
    navAdministrator.innerHTML = `
        <button class="btn-nav-administrator" onclick="showAllClients()">[ all clients ]</button>
        <button class="btn-nav-administrator" uk-toggle="target: #modal-add-user">[ add client ]</button>
        <input type="text" class="search-all" placeholder="Поиск">
    `;

    const bodyAdministrator = document.createElement('div');
    bodyAdministrator.className = 'uk-child-width-1-3@m uk-grid-small uk-grid-match body-administrator';
    bodyAdministrator.setAttribute('uk-grid', '');
    bodyAdministrator.innerHTML = `
        <div>
            <div class="uk-card uk-card-default uk-card-body card-body-administrator">
                <h3 class="uk-card-title title-card-body-administrator title-work-space-administrator">Work space</h3>
                <div class="body-work-space-administrator"></div>
            </div>
        </div>
        <div>
            <div class="uk-card uk-card-primary uk-card-body card-body-administrator">
                <h3 class="uk-card-title title-card-body-administrator title-online-administrator">Online clients</h3>
                <ul class="uk-list online-clients"></ul>
            </div>
        </div>
        <div>
            <div class="uk-card uk-card-secondary uk-card-body card-body-administrator">
                <h3 class="uk-card-title title-card-body-administrator title-offline-administrator">Offline clients</h3>
                <ul class="uk-list offline-clients"></ul>
            </div>
        </div>
    `;

    divAdministrator.appendChild(navAdministrator);
    divAdministrator.appendChild(bodyAdministrator);

    $('.main-window').append(divAdministrator);

    const searchInput = document.querySelector('.search-all');
    const allLists = document.querySelectorAll('.online-clients, .offline-clients, .body-work-space-administrator');


    searchInput.addEventListener('input', function () {
        const searchTerm = searchInput.value.trim().toLowerCase();

        allLists.forEach(function (list) {
            Array.from(list.getElementsByTagName('li')).forEach(function (item) {
                const text = item.textContent.toLowerCase();
                const isVisible = text.includes(searchTerm);

                item.style.display = isVisible ? 'block' : 'none';
            });
        });
    });
}

function saveDataClient() {

    const editDataBlocks = document.querySelectorAll('.client-edit-data');
    const dataInputs = {};

    editDataBlocks.forEach((block) => {
        const inputs = block.querySelectorAll('input');

        inputs.forEach((input) => {
            const id = input.id;
            const value = input.value;
            dataInputs[id] = value;
        });
    });


    dataInputs.id = parseInt(dataInputs.id);
    for (const key in DATA.clients) {
        if (parseInt(DATA.clients[key].id) === parseInt(dataInputs.id)) {
            for (const name of Object.keys(dataInputs)) {
                DATA.clients[key][name] = dataInputs[name]
            }
        }
    }

    const workspace = document.querySelector('.list-all-clients-work-space');

    // Проверяем, что блок найден
    if (workspace) {
        const lis = workspace.querySelectorAll('li');
        // Проходим по каждому элементу li
        lis.forEach(li => {
            if (parseInt(li.id) === dataInputs.id) {
                li.textContent = dataInputs.name_organization;
            }
        });
    }
    UIkit.modal('#modal-close-outside').hide();
    socket.emit('edit_data_user', dataInputs);
}

function addNewClient() {

    const userForm = document.getElementById("user-form");
    const inputs = userForm.querySelectorAll("input");
    const flag = true;
    const dataInputs = {};

    // Пример использования полученных инпутов
    inputs.forEach(function (input) {
        dataInputs[input.name] = input.value;

        if (input.value === '') {
            UIkit.notification({ message: `<span style="color: red; width: 50%;">Error!!! Enter [ ${input.name} ] data!!!</span>`, timeout: 5000 });
            flag = false;
        }
    });

    dataInputs['who_added'] = 'Boss'; //пока не готова авторизация

    if (flag) { socket.emit('addNewClient', dataInputs) }
    else { return }

}

function openModalDellClient() {
    const editDataBlocks = document.querySelectorAll('.client-edit-data');
    const dataClient = {};

    editDataBlocks.forEach((block) => {
        const inputs = block.querySelectorAll('input');
        inputs.forEach((input) => {
            if (input.id === 'id') { $('.id-client-for-delete').val(input.value) }
            else if (input.id === 'name_client') { $('.title-modal-dell-client').text(`Delete ${input.value} ?`) }
        });
    });

}

function dellClient() {
    socket.emit('delete_client', $('.id-client-for-delete').val());
}

