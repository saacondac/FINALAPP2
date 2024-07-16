const nameInput = document.getElementById("name-input");
const numberInput = document.getElementById("number-input");
const emailInput = document.getElementById("email-input");
const groupInput = document.getElementById("group-input");
const listContainer = document.getElementById("list-container");
const totalContacts = document.getElementById("total-contacts");
const contactSelect = document.getElementById("contact-select");
const groupSelectInput = document.getElementById("group-select-input");
const searchInput = document.getElementById("search-input");

async function fetchContacts() {
    const response = await fetch('http://localhost:3000/contacts');
    const contacts = await response.json();
    return contacts;
}

async function addContact() {
    if (nameInput.value === '' || numberInput.value === '' || emailInput.value === '') {
        alert("You must fill all the fields!");
        return;
    }

    const contact = {
        name: nameInput.value,
        number: numberInput.value,
        email: emailInput.value,
        group: groupInput.value || 'No Group'
    };

    const response = await fetch('http://localhost:3000/addContact', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(contact)
    });

    if (response.ok) {
        updateContactList();
        nameInput.value = '';
        numberInput.value = '';
        emailInput.value = '';
        groupInput.value = '';
    }
}

async function removeContact(contactId) {
    await fetch('http://localhost:3000/removeContact', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({ id: contactId })
    });
    updateContactList();
}

async function addToGroup() {
    const selectedContactName = contactSelect.value;
    const newGroup = groupSelectInput.value;

    const contact = (await fetchContacts()).find(c => c.name === selectedContactName);
    if (contact) {
        await fetch('http://localhost:3000/updateContact', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ id: contact.id, group: newGroup || 'No Group' })
        });
        updateContactList();
    }
}

async function removeFromGroup() {
    const selectedContactName = contactSelect.value;

    const contact = (await fetchContacts()).find(c => c.name === selectedContactName);
    if (contact) {
        await fetch('http://localhost:3000/updateContact', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ id: contact.id, group: 'No Group' })
        });
        updateContactList();
    }
}

async function updateContactList() {
    const contacts = await fetchContacts();
    listContainer.innerHTML = '';
    contacts.forEach(contact => {
        let li = document.createElement("li");
        li.innerHTML = `Name: ${contact.name}, Number: ${contact.number}, Email: ${contact.email}, Group: ${contact.group_name} <button onclick="removeContact(${contact.id})">Remove</button>`;
        listContainer.appendChild(li);
    });
    updateTotalContacts();
    updateContactSelect(contacts);
}

function updateTotalContacts() {
    totalContacts.textContent = listContainer.children.length;
}

function updateContactSelect(contacts) {
    contactSelect.innerHTML = '<option value="">Select a contact</option>';
    contacts.forEach(contact => {
        let option = document.createElement("option");
        option.value = contact.name;
        option.text = contact.name;
        contactSelect.appendChild(option);
    });
}

function searchContacts() {
    const searchQuery = searchInput.value.toLowerCase();
    fetchContacts().then(contacts => {
        const filteredContacts = contacts.filter(contact => contact.name.toLowerCase().includes(searchQuery));
        listContainer.innerHTML = '';
        filteredContacts.forEach(contact => {
            let li = document.createElement("li");
            li.innerHTML = `Name: ${contact.name}, Number: ${contact.number}, Email: ${contact.email}, Group: ${contact.group_name} <button onclick="removeContact(${contact.id})">Remove</button>`;
            listContainer.appendChild(li);
        });
    });
}

searchInput.addEventListener('input', searchContacts);

document.addEventListener('DOMContentLoaded', updateContactList);
