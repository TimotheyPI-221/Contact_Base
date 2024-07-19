(() => {
  const nameValue = document.getElementById("name-add");
  const surnameValue = document.getElementById("surname-add");
  const lastnameValue = document.getElementById("lastname-add");
  const addButton = document.querySelector(".addButton");
  const modalSaveButton = document.getElementById("add-save");
  const cancelButton = document.querySelector('.modal-cancel-button');
  const cancelDeleteButton = document.querySelector('.modal-delete-cancel-button');
  const modalAddContactButton = document.getElementById('add-add-contact');
  const modalChangeContactButton = document.getElementById('change-add-contact');
  const deleteButtonId = document.getElementById('button-id');
  const changeSaveButton = document.getElementById('change-save');
  const modalOverlay = document.querySelector('.modal-overlay');
  const closeChange = document.getElementById('close-change');
  const closeAdd = document.getElementById('close-add');
  const closeDelete = document.getElementById('close-delete');

  let contactsArr = [];
  let client = [];
  // let result = [];
  let i = 0;

  let currentSort = { property: 'id', direction: 'asc' };
  
  closeAdd.addEventListener('click', () => {
    modalOverlay.classList.add('hidden');
    document.querySelector(`.modal-add`).classList.add("hidden");
    clearInput('add');
  });

  closeChange.addEventListener('click', () => {
    modalOverlay.classList.add('hidden');
    document.querySelector(`.modal-change`).classList.add("hidden");
    clearInput('change')
  });

  closeDelete.addEventListener('click', () => {
    modalOverlay.classList.add('hidden');
    document.querySelector(`.modal-delete`).classList.add("hidden");
  });

  modalOverlay.addEventListener('click', () => {
    modalOverlay.classList.add('hidden');
    document.querySelector(`.modal-add`).classList.add("hidden");
    document.querySelector(`.modal-change`).classList.add("hidden");
    document.querySelector(`.modal-delete`).classList.add("hidden");
    clearInput('add');
    clearInput('change');
  });

  deleteButtonId.onclick = async () => {
    const idClient = document.querySelector('.modal-span').textContent.split(': ')[1];
    await deleteClient(idClient);
    clearTable();
    hideModal('change');
    await addClient();
  };

  changeSaveButton.addEventListener('click', async (e) => {
    e.preventDefault();

    const idClient = document.querySelector('.modal-span').textContent.split(': ')[1];
    const surnameChange = document.getElementById('surname');
    const nameChange = document.getElementById('name');
    const lastnameChange = document.getElementById('lastname');
    
    contactsArr = contactsArrPush('change');
    await changeClient(idClient, surnameChange, nameChange, lastnameChange, contactsArr);
    clearInput('change');
    hideModal('change');
    clearTable();
    await addClient();  
  });

  cancelDeleteButton.addEventListener('click', (e) => {
    e.preventDefault();
    hideModal('delete');
  });

  cancelButton.addEventListener('click', (e) => {
    e.preventDefault();
    clearInput('add');
    hideModal('add');
  });
  
  function addContactButton(modal, event) {
    createContact(`${modal}`);
    document.getElementById(`${modal}-contact-div`).classList.add('after');
    document.getElementById(`${modal}-add-contact`).classList.add('after');
    i++;
    console.log(i)
    if (i === 10) {
      if (event.target === modalAddContactButton) {
        modalAddContactButton.classList.add('hidden');
      } else if (event.target === modalChangeContactButton) {
        modalChangeContactButton.classList.add('hidden');
      }
    }
  }

  modalChangeContactButton.addEventListener('click', (event) => {
    addContactButton('change', event);
  })

  modalAddContactButton.addEventListener('click', (event) => {
    addContactButton('add', event);
  });  
  
  addButton.addEventListener("click", async (event) => {
    event.preventDefault();
    showModal('add')
  });
  
  modalSaveButton.addEventListener("click", async (event) => {
    event.preventDefault();
    contactsArr = contactsArrPush('add');
    createClients(nameValue, surnameValue, lastnameValue, contactsArr);
    clearInput('add');
    hideModal('add');
    clearTable();
    await addClient();
  });
  
  const sortButton = document.querySelectorAll('.table-button');
  sortButton.forEach(button => {
    button.addEventListener('click', (event) => {
      const property = event.target.dataset.property;
      sortButton.forEach(item => {
        item.classList.remove('asc', 'desc');
        if(event.target.dataset.property !== 'surname'){
          document.querySelector('.button-FIO-span').classList.remove('asc', 'desc');
          document.querySelector('.button-FIO-span').textContent = 'А-Я';
        }
      });

      if (currentSort.property === property) {
        currentSort.direction = currentSort.direction === 'asc' ? 'desc':'asc';
      } else {
        currentSort.property = property;
        currentSort.direction = 'asc';
      }

      if(currentSort.direction === 'asc'){
        event.target.classList.add('asc');
            if(event.target.dataset.property === 'surname'){
              document.querySelector('.button-FIO-span').classList.remove('desc');
              document.querySelector('.button-FIO-span').classList.add('asc');
              document.querySelector('.button-FIO-span').textContent = 'А-Я';
            }
      } 
      else {
        event.target.classList.add('desc');
        if(event.target.dataset.property === 'surname'){
          document.querySelector('.button-FIO-span').classList.add('desc');
          document.querySelector('.button-FIO-span').textContent = 'Я-А';
        }
      }
      clearTable();
      addClient();
    });
  });

  function createContact(modal) {
    const contactDiv = document.createElement('div');
    const contactType = document.createElement('select');
    const contactInput = document.createElement('input');
    const contactButton = document.createElement('button');
    const phoneOption = document.createElement('option');
    const vkOption = document.createElement('option');
    const emailOption = document.createElement('option');
    const facebookOption = document.createElement('option');
    const otherOption = document.createElement('option');
    
    contactDiv.classList.add('contact-div');
    contactType.classList.add('contact-type');
    contactInput.classList.add('contact-input');
    contactButton.classList.add('contact-button');
    contactButton.setAttribute('type', 'button');

    phoneOption.classList.add('option-contact');
    vkOption.classList.add('option-contact');
    emailOption.classList.add('option-contact');
    facebookOption.classList.add('option-contact');
    otherOption.classList.add('option-contact');
    
    phoneOption.setAttribute('value', 'Телефон');
    vkOption.setAttribute('value', 'VK');
    emailOption.setAttribute('value', 'Email');
    facebookOption.setAttribute('value', 'Facebook');
    otherOption.setAttribute('value', 'Другое');
    
    phoneOption.textContent = 'Телефон';
    vkOption.textContent = 'VK';
    emailOption.textContent = 'Email';
    facebookOption.textContent = 'Facebook';
    otherOption.textContent = 'Другое';
    
    contactInput.setAttribute('placeholder', 'Введите данные контакта');
    
    contactType.append(phoneOption, vkOption, emailOption, facebookOption, otherOption);
    contactDiv.append(contactType, contactInput, contactButton);
    
    document.getElementById(`${modal}-contact-div`).prepend(contactDiv);
    
    contactButton.addEventListener('click', (event) => { 
      if(i === 10){
        modalAddContactButton.classList.remove('hidden');
        modalChangeContactButton.classList.remove('hidden');
      }
      i = i-1;
      if(i === 0){
        document.getElementById(`${modal}-contact-div`).classList.remove('after');
        document.getElementById(`${modal}-add-contact`).classList.remove('after');
      }   
      
      event.target.parentNode.remove();
    });

  }
  
  function contactsArrPush (modal) {
    const contactTypes = document.querySelectorAll(`#${modal}-contact-div select`);
    const contactValues = document.querySelectorAll(`#${modal}-contact-div .contact-input`);
    const tempArr =[];

    contactTypes.forEach((type, index) => {
      if (contactValues[index].value) {
        tempArr.push({
          type: type.value,
          value: contactValues[index].value
        });
      }
    });
    return tempArr;
  }

  function clearInput(modal) {
    nameValue.value = '';
    surnameValue.value = '';
    lastnameValue.value = '';
    contactsArr = [];
    while(document.getElementById(`${modal}-contact-div`).firstChild === document.getElementById(`${modal}-contact-div`).querySelector('.contact-div')){
      document.getElementById(`${modal}-contact-div`).firstChild.remove();
    }
    document.getElementById(`add-contact-div`).classList.remove('after');
    document.getElementById(`add-add-contact`).classList.remove('after');
    i = 0;
  }

  async function changeButtonClick(event) {
    const idClient = event.target.id;
    let arrClient = await getFromServerById(idClient);
    showModal('change');
    document.querySelector(".modal-span").textContent = `ID: ${idClient}`;

    const surnameChange = document.getElementById('surname');
    const nameChange = document.getElementById('name');
    const lastnameChange = document.getElementById('lastname');
    
    surnameChange.value = arrClient.surname;
    nameChange.value = arrClient.name;
    lastnameChange.value = arrClient.lastName;
    
    arrClient.contacts.forEach(() => {
      createContact('change');
      i++;
    })

    if(arrClient.contacts.length > 0){
        document.getElementById(`change-contact-div`).classList.add('after');
        document.getElementById(`change-add-contact`).classList.add('after');
    } else {
      document.getElementById(`change-contact-div`).classList.remove('after');
      document.getElementById(`change-add-contact`).classList.remove('after'); 
    }
    console.log(arrClient.contacts.length)

    const typesContact = document.querySelectorAll('#change-contact-div select');
    const valuesContact = document.querySelectorAll('#change-contact-div .contact-input');

    typesContact.forEach((type, index) => {
      type.value = arrClient.contacts[index].type;
      valuesContact[index].value = arrClient.contacts[index].value;
    });
  }
  
  function deleteButtonClick(event) {
    event.preventDefault();
    showModal('delete');
    const idClient = event.target.id;
    const modalDeleteButton = document.getElementById("delete-delete");
    modalDeleteButton.onclick = async (e) => {
      e.preventDefault();
      await deleteClient(idClient);
      clearTable();
      hideModal('delete');
      await addClient();
    };
  }

  function hideModal(modal) {
    document.querySelector(".modal-overlay").classList.add("hidden");
    document.querySelector(`.modal-${modal}`).classList.add("hidden");
  }

  function showModal(modal) {
    document.querySelector(".modal-overlay").classList.remove("hidden");
    document.querySelector(`.modal-${modal}`).classList.remove("hidden");
  }

  function showIndicator() {
    document.querySelector(".load").classList.remove("hidden");
    document.querySelector(".load-row").classList.remove("hidden");
  }

  function hideIndicator() {
    document.querySelector(".load").classList.add("hidden");
    document.querySelector(".load-row").classList.add("hidden");
  }

  function createTableRow() {
    const tbody = document.querySelector("tbody");
    const row = document.createElement("tr");
    tbody.appendChild(row);

    const ClientId = document.createElement("td");
    const ClientFIO = document.createElement("td");
    const ClientCreateTime = document.createElement("td");
    const ClientChangeTime = document.createElement("td");
    const ClientContacts = document.createElement("td");
    const ClientAction = document.createElement("td");

    const dateCreateDiv = document.createElement("div");
    const timeCreateDiv = document.createElement("div");
    const dateChangeDiv = document.createElement("div");
    const timeChangeDiv = document.createElement("div");

    const createTimeContainer = document.createElement("div");
    const changeTimeContainer = document.createElement("div");
    const actionContainer = document.createElement("div");

    timeCreateDiv.classList.add("gray-time");
    timeChangeDiv.classList.add("gray-time");

    createTimeContainer.classList.add("row-time-container");
    changeTimeContainer.classList.add("row-time-container");
    actionContainer.classList.add("row-action");

    ClientId.classList.add("table-row", "table-row-id");
    ClientFIO.classList.add("table-row", "table-row-FIO");
    ClientCreateTime.classList.add("table-row");
    ClientChangeTime.classList.add("table-row");
    ClientContacts.classList.add("table-row", "table-row-contact");
    ClientAction.classList.add("table-row");

    createTimeContainer.append(dateCreateDiv, timeCreateDiv);
    changeTimeContainer.append(dateChangeDiv, timeChangeDiv);
    ClientCreateTime.appendChild(createTimeContainer);
    ClientChangeTime.appendChild(changeTimeContainer);
    ClientAction.appendChild(actionContainer);

    row.append(
      ClientId,
      ClientFIO,
      ClientCreateTime,
      ClientChangeTime,
      ClientContacts,
      ClientAction
    );

    return row;
  }

  function populateTableRow(row, client) {
    row.children[0].textContent = client.id;
    row.children[1].textContent = `${client.surname} ${client.name} ${client.lastName}`;

    const currentDate = client.createdAt;
    const changeDate = client.updatedAt;

    row.children[2].querySelector(
      ".row-time-container div:nth-child(1)"
    ).textContent = formateDate(currentDate);
    row.children[2].querySelector(
      ".row-time-container div:nth-child(2)"
    ).textContent = formateTime(currentDate);
    row.children[3].querySelector(
      ".row-time-container div:nth-child(1)"
    ).textContent = formateDate(changeDate);
    row.children[3].querySelector(
      ".row-time-container div:nth-child(2)"
    ).textContent = formateTime(changeDate);

    client.contacts.forEach((contact) => {
      const icon = createContactIcon(contact);
      row.children[4].appendChild(icon);
    });

    const changeButton = document.createElement("button");
    const deleteButton = document.createElement("button");

    changeButton.classList.add(
      "change-button",
      "action-img",
      "action-img-change"
    );
    deleteButton.classList.add(
      "delete-button",
      "action-img",
      "action-img-delete"
    );

    deleteButton.textContent = "Удалить";
    changeButton.textContent = "Изменить";

    changeButton.setAttribute("id", client.id);
    deleteButton.setAttribute("id", client.id);

    row.querySelector(".row-action").append(changeButton, deleteButton);

    changeButton.addEventListener("click", changeButtonClick);
    deleteButton.addEventListener("click", deleteButtonClick);
  }

  function createContactIcon(contact) {
    const icon = document.createElement("span");
    icon.classList.add("contact-icon");
    const iconText = document.createElement("span");

    switch (contact.type) {
      case "VK":
        icon.classList.add("icon-vk");
        // iconText.textContent = `${contact.type}: ${contact.value}`;
        break;
      case "Телефон":
        icon.classList.add("icon-phone");
        // iconText.textContent = `${contact.value}`;
        break;
      case "Email":
        icon.classList.add("icon-email");
        // iconText.textContent = `${contact.type}: ${contact.value}`;
        break;
      case "Facebook":
        icon.classList.add("icon-facebook");
        // iconText.textContent = `${contact.type}: ${contact.value}`;
        break;
      default:
        icon.classList.add("icon-default");
        // iconText.textContent = `${contact.type}: ${contact.value}`;
        break;
    }
    // iconText.classList.add("icon-text");
    icon.appendChild(iconText);

    tippy(icon, {
    content: `${contact.type}: ${contact.value}`,
    placement: 'top',
    animation: 'fade',
    theme: 'light',
  });

    return icon;
  }

  function sort(arr, property, direction) {
    arr.sort((a, b) => {
      if(a[property] < b[property]){
        return direction === 'asc' ? -1 : 1;
      }
      else if (a[property] > b[property]){
        return direction === 'asc' ? 1 : -1;
      }
      return 0;
    });
    return arr;
  }

  function formateDate(dateString) {
    const date = new Date(dateString);

    let day = String(date.getDate()).padStart(2, '0');
    let month = String(date.getMonth() + 1).padStart(2, '0');
    let year = String(date.getFullYear());

    return `${day}.${month}.${year}`;
  }

  function formateTime(dateString) {
    const date = new Date(dateString);

    let hours = String(date.getHours()).padStart(2, '0');
    let minute = String(date.getMinutes()).padStart(2, '0');

    return `${hours}:${minute}`;
  }

  async function getFromServer() {
    await new Promise((resolve) => setTimeout(resolve, 1000));
    const response = await fetch("http://localhost:3001/api/clients");
    const arrClients = await response.json();
    return arrClients;
  }

  async function getFromServerById(idClient) {
    await new Promise((resolve) => setTimeout(resolve, 1000));
    const response = await fetch(`http://localhost:3001/api/clients/${idClient}`);
    const arrClient = await response.json();
    return arrClient;
  }

  function clearTable() {
    const tbody = document.querySelector('.tbody');
    while(tbody.lastChild !== document.querySelector('.load-row')){
      tbody.lastChild.remove();
    }
  }

  // function clearTable() {
  //   const tbody = document.querySelector('tbody');
  //   tbody.innerHTML = '<tr class="load-row"><td colspan="6" class="load hidden">Загрузка...</td></tr>';
  // }

  async function addClient() {
    try {
      showIndicator();
      const arrClients = await getFromServer();
      sort(arrClients, currentSort.property, currentSort.direction)
      client = arrClients;
      arrClients.forEach((client) => {
        const row = createTableRow();
        populateTableRow(row, client);
      });
      hideIndicator();
    } catch (error) {
      console.error("Ошибка при загрузке данных:", error);
      hideIndicator();
    }
  }

  async function createClients(name, surname, lastname, arr) {
    fetch("http://localhost:3001/api/clients", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        name: name.value,
        surname: surname.value,
        lastName: lastname.value,
        contacts: arr,
      }),
    });
  }

  async function deleteClient(idClient) {
    fetch(`http://localhost:3001/api/clients/${idClient}`, {
      method: "DELETE",
    });
  }

  async function changeClient(idClient, name, surname, lastname, arr) {
    fetch(`http://localhost:3001/api/clients/${idClient}`, {
      method: "PATCH", 
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        name: name.value,
        surname: surname.value,
        lastName: lastname.value,
        contacts: arr,
      }),
    });
  }

  function renderResult(result) {
    const container = document.querySelector('.filter-arr');
    container.innerHTML = '';  // Очищаем контейнер
  
    if (result.length === 0) {
      const noResultsMessage = document.createElement('div');
      noResultsMessage.textContent = 'Нет результатов для поиска';
      noResultsMessage.classList.add('message-filter')
      container.append(noResultsMessage);
    } else {
      result.forEach(client => {
        const clientButton = document.createElement('button');
        clientButton.classList.add('client-button');
        clientButton.textContent = `id: ${client.id}, ФИО: ${client.surname} ${client.name} ${client.lastName}`;
        container.append(clientButton);
      });
    }
  }

  function filterClients(arr, value) {
    const searchTerms = value.trim().toLowerCase().split(/\s+/);

    let result = arr.filter(client => {
      return searchTerms.every(term =>
      client.name.toLowerCase().includes(term) || 
      client.surname.toLowerCase().includes(term) ||
      client.lastName.toLowerCase().includes(term) ||
      client.id.includes(term)
      );
    });
    renderResult(result)
  }
  
  document.addEventListener("DOMContentLoaded", async () => {
    document.querySelector('.button-id').classList.add('asc');
    await addClient();
    let timeOut;
    document.querySelector('.filter-input').addEventListener('input', () => {
      clearTimeout(timeOut);
      timeOut = setTimeout(() => {
        let inputValue = document.querySelector('.filter-input').value.toLowerCase();
        if(inputValue === '') document.querySelector('.filter-arr').innerHTML = '';
        else filterClients(client, inputValue); 
      }, 300); 
    })
  });
})();
