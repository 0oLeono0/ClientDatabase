document.addEventListener('DOMContentLoaded', () => {
    arr = [];
    async function loadArray() {
        const response = await fetch('http://localhost:3000/api/clients');
        const data = await response.json();
        for (i in data) {
            arr.push({ contacts: data[i].contacts, createdAt: data[i].createdAt, id: data[i].id, FIO: data[i].surname + ' ' + data[i].name + ' ' + data[i].lastName, updatedAt: data[i].updatedAt });
        }

        const id = document.getElementById('ID');
        const FIO = document.getElementById('FIO');
        const date = document.getElementById('date');
        const lastChanges = document.getElementById('lastChanges');

        // сортировка

        idDir = FIODir = dateDir = lastChangesDir = false;
        function sorting(array, prop, dir = false) {
            let result = array.sort(function (a, b) {
                let dirIf = a[prop] < b[prop]

                if (dir == true) dirIf = a[prop] > b[prop];

                if (dirIf == true) return -1;
            });
            
            if (prop == 'id') {
                idDir = !dir
                id.classList.toggle('active');
                FIO.classList.remove('active');
                date.classList.remove('active');
                lastChanges.classList.remove('active');
            }
            if (prop == 'FIO') {
                FIODir = !dir
                id.classList.remove('active');
                FIO.classList.toggle('active');
                date.classList.remove('active');
                lastChanges.classList.remove('active');
            }
            if (prop == 'createdAt') {
                dateDir = !dir
                id.classList.remove('active');
                FIO.classList.remove('active');
                date.classList.toggle('active');
                lastChanges.classList.remove('active');
            }
            if (prop == 'updatedAt') {
                lastChangesDir = !dir
                id.classList.remove('active');
                FIO.classList.remove('active');
                date.classList.remove('active');
                lastChanges.classList.toggle('active');
            }
            renderClients(result);
        }
        sorting(arr, 'id', idDir);
        id.addEventListener('click', () => sorting(arr, 'id', idDir));
        FIO.addEventListener('click', () => sorting(arr, 'FIO', FIODir));
        date.addEventListener('click', () => sorting(arr, 'createdAt', dateDir));
        lastChanges.addEventListener('click', () => sorting(arr, 'updatedAt', lastChangesDir));

    }
    loadArray();
    // Создание селектов 
    function createSelect(type, base) {
        const contact = document.createElement('div')
        const select = document.createElement('div');
        const selectHeader = document.createElement('div');
        const selectCurrent = document.createElement('span');
        const selectIcon = document.createElement('div');
        const selectIconImg = document.createElement('div');
        const selectBody = document.createElement('div');
        const selectItem1 = document.createElement('div');
        const selectItem2 = document.createElement('div');
        const selectItem3 = document.createElement('div');
        const selectItem4 = document.createElement('div');
        const selectItem5 = document.createElement('div');
        const inputBlock = document.createElement('div');
        const input = document.createElement('input');
        const inputDelete = document.createElement('div');
        const inputDeleteImg = document.createElement('span');

        contact.classList.add('addClient_modal_form_addContact_contact')
        select.classList.add('addClient_modal_form_addContact_select');
        selectHeader.classList.add('addClient_modal_form_addContact_select_header');
        selectCurrent.classList.add('addClient_modal_form_addContact_select_current');
        selectCurrent.textContent = type;
        selectIcon.classList.add('addClient_modal_form_addContact_select_icon');
        selectIconImg.classList.add('addClient_modal_form_addContact_select_icon_img')
        selectBody.classList.add('addClient_modal_form_addContact_select_body');
        selectItem1.classList.add('addClient_modal_form_addContact_select_item');
        selectItem1.textContent = 'Телефон';
        selectItem2.classList.add('addClient_modal_form_addContact_select_item');
        selectItem2.textContent = 'Доп. телефон';
        selectItem3.classList.add('addClient_modal_form_addContact_select_item');
        selectItem3.textContent = 'Email';
        selectItem4.classList.add('addClient_modal_form_addContact_select_item');
        selectItem4.textContent = 'Vk';
        selectItem5.classList.add('addClient_modal_form_addContact_select_item');
        selectItem5.textContent = 'Facebook';

        inputBlock.classList.add('addClient_modal_form_addContact_inputBlock');
        input.classList.add('addClient_modal_form_addContact_input');
        input.setAttribute('placeholder', 'Введите данные контакта');
        inputDelete.classList.add('addClient_modal_form_addContact_delete');
        inputDeleteImg.classList.add('addClient_modal_form_addContact_deleteImg');

        inputDelete.addEventListener('click', deleteSelect);

        selectBody.appendChild(selectItem1);
        selectBody.appendChild(selectItem2);
        selectBody.appendChild(selectItem3);
        selectBody.appendChild(selectItem4);
        selectBody.appendChild(selectItem5);
        selectIcon.appendChild(selectIconImg);
        selectHeader.appendChild(selectCurrent);
        selectHeader.appendChild(selectIcon);
        select.appendChild(selectHeader);
        select.appendChild(selectBody);
        inputDelete.appendChild(inputDeleteImg);
        inputBlock.appendChild(input);
        inputBlock.appendChild(inputDelete)
        contact.appendChild(select);
        contact.appendChild(inputBlock);
        base.appendChild(contact);

        selectHeader.addEventListener('click', () => {
            select.classList.toggle('active');
        });

        let selects = document.querySelectorAll('.addClient_modal_form_addContact_select_item');
        for (i = 0; i < selects.length; i++) {
            let select = selects[i]
            select.addEventListener('click', () => {
                let text = select.innerText;
                selectCurrent.textContent = text;
                select.classList.toggle('active');
            })
        }

        // Фильтрация

        input.addEventListener('input', () => {
            if (input.value == '') {
                inputDelete.classList.remove('active');
            } else {
                inputDelete.classList.add('active')
            }
        });
        base.classList.add('buff')
        valueContacts();
    }

    function deleteSelect() {
        this.parentNode.parentNode.outerHTML = '';
        valueContacts();
    }

    function valueContacts() {
        const selects = document.querySelectorAll('.addClient_modal_form_addContact_contact');
        if (selects.length >= 10) {
            changeContactBtn.classList.add('invis')
            addContactBtn.classList.add('invis')
        } else if (selects.length == 0) {
            changeContact.classList.remove('buff');
            addContact.classList.remove('buff');
        } else {
            changeContactBtn.classList.remove('invis')
            addContactBtn.classList.remove('invis')
        }
    }

    // Добавление в таблицу
    const saveClientBtn = document.querySelector('.addClient_modal_form_save');
    let addClient = function () {
        event.preventDefault();
        const clientSurname = document.querySelector('.addClient_modal_form_input_surname');
        const clientName = document.querySelector('.addClient_modal_form_input_name');
        const clientMiddleName = document.querySelector('.addClient_modal_form_input_middleName');
        const contactType = document.querySelectorAll('.addClient_modal_form_addContact_select_current');
        const contactValue = document.querySelectorAll('.addClient_modal_form_addContact_input');
        const clientValidateText = document.querySelector('.addClient_modal_form_validateText');
        if ((clientSurname.value == '') || (clientName.value == '') || (clientMiddleName.value == '')) {
            clientValidateText.textContent = 'Все поля должны быть заполнены';
            clientValidateText.classList.add('active');
        } else {
            clientValidateText.classList.remove('active');
            let contacts = []
            for (i = 0; i < contactType.length; i++) {
                let contact = { type: contactType[i].textContent, value: contactValue[i].value }
                contacts.push(contact);
            }
            arr.push({ FIO: clientSurname.value + ' ' + clientName.value + ' ' + clientMiddleName.value, contacts: contacts, createdAt: new Date().toISOString(), id: Date.now().toString(), updatedAt: new Date().toISOString() });
            async function createClientBase() {
                fetch('http://localhost:3000/api/clients', {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({
                        surname: clientSurname.value,
                        name: clientName.value,
                        lastName: clientMiddleName.value,
                        contacts: contacts
                    })
                })
                renderClients(arr);
                let selects = document.querySelector('.addClient_modal_form_addContact_selects');
                while (selects.firstChild) {
                    selects.removeChild(selects.firstChild);
                }
                clientName.value = ''
                clientSurname.value = ''
                clientMiddleName.value = ''
            }
            document.getElementById('overlay').classList.remove('active');
            document.getElementById('addClientModal').classList.remove('active');
            createClientBase();
        }

    }
    saveClientBtn.addEventListener('click', addClient);



    // модальное окно изменения клиента
    function changeClient() {
        const id = this.dataset.id;
        const changeContactSelects = document.querySelector('.changeClient_modal_form_addContact_selects');
        const changeModal = document.getElementById('changeClient');
        const surname = document.querySelector('.changeClient_modal_form_input_surname');
        const name = document.querySelector('.changeClient_modal_form_input_name');
        const middleName = document.querySelector('.changeClient_modal_form_input_middleName');
        changeModal.classList.add('active');
        Overlay.classList.add('active');
        document.querySelector('.changeClient_id').textContent = 'ID: ' + id;

        for (i of arr) {
            if (i.id == id) {
                text = i.FIO.split(' ')
                surname.value = text[0];
                name.value = text[1];
                middleName.value = text[2];
                let n = 0
                for (x of i.contacts) {
                    createSelect(x.type, changeContactSelects);
                    const selects = document.querySelectorAll('.addClient_modal_form_addContact_input');
                    selects[n].nextSibling.classList.add('active');
                    selects[n].value = x.value;
                    n += 1;
                }
            }
        }

        changeContactBtn.addEventListener('click', () => createSelect('Телефон', changeContactSelects));
        valueContacts();

        // Изменение клиента
        const changeClientBtn = document.querySelector('.changeClient_modal_form_save');
        let cnahgeClientAPI = function () {
            event.preventDefault();
            const clientSurname = document.querySelector('.changeClient_modal_form_input_surname');
            const clientName = document.querySelector('.changeClient_modal_form_input_name');
            const clientMiddleName = document.querySelector('.changeClient_modal_form_input_middleName');
            const contactType = document.querySelectorAll('.addClient_modal_form_addContact_select_current');
            const contactValue = document.querySelectorAll('.addClient_modal_form_addContact_input');
            const changeClientValidateText = document.querySelector('.changeClient_modal_form_validateText');
            if ((clientSurname.value == '') || (clientName.value == '') || (clientMiddleName.value == '')) {
                changeClientValidateText.textContent = 'Все поля должны быть заполнены';
                changeClientValidateText.classList.add('active');
            } else {
                changeClientValidateText.classList.remove('active');
                let contacts = []
                for (i = 0; i < contactType.length; i++) {
                    let contact = { type: contactType[i].textContent, value: contactValue[i].value }
                    contacts.push(contact);
                }
                for (i in arr) {
                    if (arr[i].id == id) {
                        arr.splice(i, 1, { FIO: clientSurname.value + ' ' + clientName.value + ' ' + clientMiddleName.value, contacts: contacts, createdAt: arr[i].createdAt, id: arr[i].id, updatedAt: new Date().toISOString() });
                    }
                }
                async function createClientBase() {
                    await fetch(`http://localhost:3000/api/clients/${id}`, {
                        method: 'PATCH',
                        headers: { 'Content-Type': 'application/json' },
                        body: JSON.stringify({
                            surname: clientSurname.value,
                            name: clientName.value,
                            lastName: clientMiddleName.value,
                            contacts: contacts
                        })
                    });
                }
                renderClients(arr);
                createClientBase();
                document.getElementById('changeClient').classList.remove('active');
                document.getElementById('overlay').classList.remove('active');
            }

        }
        changeClientBtn.addEventListener('click', cnahgeClientAPI);
    }

    // Удаление клиента

    async function removeClient() {
        const id = this.dataset.id;
        const deleteModal = document.getElementById('deleteClient');

        deleteModal.classList.add('active');
        Overlay.classList.add('active');

        async function removeClientBase() {
            fetch(`http://localhost:3000/api/clients/${id}`, {
                method: 'DELETE',
                headers: { 'Content-Type': 'application/json' }
            });
            document.getElementById('deleteClient').classList.remove('active');
            document.getElementById('overlay').classList.remove('active');
            for (i in arr) {
                if (arr[i].id == id) {
                    arr.splice(i, 1);
                }
            }

            renderClients(arr);
        }
        document.querySelector('.delete_modal_yes').addEventListener('click', removeClientBase);
    }

    // Отрисовка таблици

    function renderClients(arr) {
        const table = document.querySelector('.clients_table_body');
        while (table.firstChild) {
            table.removeChild(table.firstChild);
        }
        for (i = 0; i < arr.length; i++) {
            const row = document.createElement('tr');
            const id = document.createElement('td');
            const FIO = document.createElement('td');
            const create = document.createElement('td');
            const createDate = document.createElement('p');
            const createTime = document.createElement('p');
            const lastChanges = document.createElement('td');
            const lastDate = document.createElement('p');
            const lastTime = document.createElement('p');
            const contacts = document.createElement('td');
            const actionsBlock = document.createElement('div');
            const actions = document.createElement('td');
            const change = document.createElement('button');
            const changeImg = document.createElement('span');
            const remove = document.createElement('button');
            const removeImg = document.createElement('span');

            let y = 0
            if (arr[i].contacts.length > 0) {
                for (x of arr[i].contacts) {
                    const contact = document.createElement('div');
                    const popup = document.createElement('div');
                    const popupText = document.createElement('div');
                    const popupType = document.createElement('span');
                    const popupValue = document.createElement('span');
                    popup.classList.add('clients_table_body_contacts_popup');
                    popupText.classList.add('clients_table_body_contacts_popup_text');
                    popupType.classList.add('clients_table_body_contacts_popup_type');
                    popupValue.classList.add('clients_table_body_contacts_popup_value');
                    popupType.textContent = x.type + ': ';
                    popupValue.textContent = x.value;
                    popupText.appendChild(popupType);
                    popupText.appendChild(popupValue);
                    popup.appendChild(popupText);
                    contact.appendChild(popup);
                    if (x.type == 'Телефон') {
                        contact.classList.add('clients_table_body_contacts_phone');
                    }
                    if (x.type == 'Доп. телефон') {
                        contact.classList.add('clients_table_body_contacts_exPhone');
                    }
                    if (x.type == 'Email') {
                        contact.classList.add('clients_table_body_contacts_email');
                    }
                    if (x.type == 'Vk') {
                        contact.classList.add('clients_table_body_contacts_vk');
                    }
                    if (x.type == 'Facebook') {
                        contact.classList.add('clients_table_body_contacts_facebook');
                    }
                    y += 1
                    if (y == 5) {
                        contact.classList.add('moreBtn');
                        contact.textContent = `+${(arr[i].contacts.length - 4)}`
                        contact.addEventListener('click', () => {
                            contact.classList.remove('moreBtn');
                            contact.textContent = '';
                            for (i of contacts.childNodes) {
                                i.style.display = 'inline-block';
                            }
                        });
                    } else if (y > 5) {
                        contact.style.display = 'none'
                    }
                    contacts.appendChild(contact);
                }
            }

            row.classList.add('clients_table_body_row');
            id.classList.add('clients_table_body_id');
            FIO.classList.add('clients_table_body_FIO');
            create.classList.add('clients_table_body_create');
            createDate.classList.add('clients_table_body_create_date');
            createTime.classList.add('clients_table_body_create_time');
            lastChanges.classList.add('clients_table_body_lastChanges');
            lastDate.classList.add('clients_table_body_lastChanges_date');
            lastTime.classList.add('clients_table_body_lastChanges_time');
            contacts.classList.add('clients_table_body_contacts');
            actionsBlock.classList.add('clients_table_body_actions_block');
            actions.classList.add('clients_table_body_actions');
            change.classList.add('clients_table_body_actions_change');
            changeImg.classList.add('clients_table_body_actions_changeImg');
            remove.classList.add('clients_table_body_actions_remove');
            removeImg.classList.add('clients_table_body_actions_removeImg');

            id.textContent = arr[i].id;
            FIO.textContent = arr[i].FIO;
            createDate.textContent = arr[i].createdAt.slice(8, 10) + '.' + arr[i].createdAt.slice(5, 7) + '.' + arr[i].createdAt.slice(0, 4);
            createTime.textContent = arr[i].createdAt.slice(11, 16);
            lastDate.textContent = arr[i].updatedAt.slice(8, 10) + '.' + arr[i].updatedAt.slice(5, 7) + '.' + arr[i].updatedAt.slice(0, 4);
            lastTime.textContent = arr[i].updatedAt.slice(11, 16);
            change.textContent = 'Изменить';
            change.setAttribute('data-id', arr[i].id);
            remove.textContent = 'Удалить';
            remove.setAttribute('data-id', arr[i].id);


            change.addEventListener('click', changeClient);
            remove.addEventListener('click', removeClient);

            create.appendChild(createDate);
            create.appendChild(createTime);
            lastChanges.appendChild(lastDate);
            lastChanges.appendChild(lastTime);
            change.appendChild(changeImg);
            actionsBlock.appendChild(change);
            remove.appendChild(removeImg);
            actionsBlock.appendChild(remove);
            actions.appendChild(actionsBlock);
            row.appendChild(id);
            row.appendChild(FIO);
            row.appendChild(create);
            row.appendChild(lastChanges);
            row.appendChild(contacts);
            row.appendChild(actions);
            table.appendChild(row);
        }
    }

    const Overlay = document.getElementById('overlay');
    const addClientBtn = document.getElementById('addClientBtn');
    const addClientModal = document.getElementById('addClientModal');
    const changeClientModal = document.getElementById('changeClient');
    const removeClientModal = document.getElementById('deleteClient');
    const clientSurname = document.querySelector('.addClient_modal_form_input_surname');
    const clientName = document.querySelector('.addClient_modal_form_input_name');
    const clientMiddleName = document.querySelector('.addClient_modal_form_input_middleName');
    const clientSurnameText = document.querySelector('.addClient_text_surname');
    const clientNameText = document.querySelector('.addClient_text_name');
    const clientMiddleNameText = document.querySelector('.addClient_text_middleName');
    clientSurname.addEventListener('input', () => {
        if (clientSurname.value != '') {
            clientSurnameText.classList.add('active');
        } else {
            clientSurnameText.classList.remove('active');
        }
    });
    clientName.addEventListener('input', () => {
        if (clientName.value != '') {
            clientNameText.classList.add('active');
        } else {
            clientNameText.classList.remove('active');
        }
    });
    clientMiddleName.addEventListener('input', () => {
        if (clientMiddleName.value != '') {
            clientMiddleNameText.classList.add('active');
        } else {
            clientMiddleNameText.classList.remove('active');
        }
    });
    const deleteClient = function () {
        event.preventDefault();
        changeClientModal.classList.remove('active');
        addClientModal.classList.remove('active');
        removeClientModal.classList.remove('active');
        Overlay.classList.remove('active');
        clientSurname.value = ''
        clientName.value = ''
        clientMiddleName.value = ''
        const contact = document.querySelectorAll('.addClient_modal_form_addContact_contact');
        const addContact = document.querySelector('.addClient_modal_form_addContact');
        addContact.classList.remove('buff');
        for (let i = 0; i < contact.length; i++) {
            contact[i].outerHTML = '';
        }
    }
    addClientBtn.addEventListener('click', () => {
        document.body.style.position = 'fixed'
        addClientModal.classList.add('active');
        Overlay.classList.add('active');
    });

    async function searchClient(value) {
        const response = await fetch(`http://localhost:3000/api/clients?search=${value}`);
        const data = await response.json();
        arr = []
        for (i in data) {
            arr.push({ contacts: data[i].contacts, createdAt: data[i].createdAt, id: data[i].id, FIO: data[i].surname + ' ' + data[i].name + ' ' + data[i].lastName, updatedAt: data[i].updatedAt });
        }
        renderClients(arr);
    }

    const search = document.querySelector('.header_search');
    let interval
    search.addEventListener('input', () => {
        interval = clearTimeout(interval);
        interval = setTimeout(searchClient(search.value), 3000);
    });

    Overlay.addEventListener('click', deleteClient);
    document.querySelector('.addClient_modal_form_close').addEventListener('click', deleteClient);
    document.querySelector('.addClient_modal_form_cansel').addEventListener('click', deleteClient);
    document.querySelector('.changeClient_modal_form_cansel').addEventListener('click', deleteClient);
    document.querySelector('.changeClient_modal_form_close').addEventListener('click', deleteClient);
    document.querySelector('.delete_modal_cansel').addEventListener('click', deleteClient);
    document.querySelector('.delete_modal_close').addEventListener('click', deleteClient);

    const addContactBtn = document.querySelector('.addClient_modal_form_addContact_btn');
    const addContact = document.querySelector('.addClient_modal_form_addContact');
    const addContactSelects = document.querySelector('.addClient_modal_form_addContact_selects');
    const changeContact = document.querySelector('.changeClient_modal_form_addContact');
    const changeContactBtn = document.querySelector('.changeClient_modal_form_addContact_btn');
    addContactBtn.addEventListener('click', () => createSelect('Телефон', addContactSelects));
});