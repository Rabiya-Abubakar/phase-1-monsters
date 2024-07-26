console.log('hi');

const URL_PREFIX = 'http://localhost:3000/';
let page = 1;
let loadingMore = false; // Flag to prevent multiple requests

// Function to get monsters from the API
const getMonsters = (page) => {
    if (loadingMore) return; // Prevent new fetch if already loading
    
    loadingMore = true; // Set flag to indicate loading

    fetch(URL_PREFIX + `monsters/?_limit=50&_page=${page}`)
        .then(response => response.json())
        .then(monsters => {
            // Append monsters to the existing list
            const container = document.querySelector('#monster-container');
            monsters.forEach(monster => {
                console.log('monster', monster);
                createMonsterCard(monster);
            });

            // Show or hide the "Load More" button
            if (monsters.length > 0) {
                showLoadMoreButton();
            } else {
                hideLoadMoreButton();
            }
        })
        .catch(error => console.error('Error fetching monsters:', error))
        .finally(() => {
            loadingMore = false; // Reset flag after loading
        });
};

// Function to create a monster card and append it to the DOM
const createMonsterCard = (monster) => {
    let card = document.createElement('div'),
        name = document.createElement('h2'),
        age = document.createElement('h4'),
        description = document.createElement('p');
    name.innerHTML = `${monster.name}`;
    age.innerHTML = `Age: ${monster.age}`;
    description.innerHTML = `Bio: ${monster.description}`;
    card.appendChild(name);
    card.appendChild(age);
    card.appendChild(description);
    document.querySelector('#monster-container').appendChild(card);
};

// Function to create and show the "Load More" button
const showLoadMoreButton = () => {
    const buttonContainer = document.getElementById('load-more-container');
    if (!document.getElementById('load-more')) {
        let button = document.createElement('button');
        button.id = 'load-more';
        button.innerHTML = 'Load More';
        button.addEventListener('click', loadMoreMonsters);
        buttonContainer.innerHTML = ''; // Clear previous button if any
        buttonContainer.appendChild(button);
    }
};

// Function to hide the "Load More" button
const hideLoadMoreButton = () => {
    const buttonContainer = document.getElementById('load-more-container');
    buttonContainer.innerHTML = ''; // Clear the button
};

// Function to handle "Load More" button click
const loadMoreMonsters = () => {
    if (!loadingMore) {
        page++;
        getMonsters(page);
    }
};

// Function to create the monster form and add it to the DOM
const createMonsterForm = () => {
    const form = document.createElement('form'),
          nameInput = document.createElement('input'),
          ageInput = document.createElement('input'),
          descriptionInput = document.createElement('input'),
          submitButton = document.createElement('button');
    
    form.id = 'monster-form';
    nameInput.id = 'name';
    ageInput.id = 'age';
    descriptionInput.id = 'description';
    
    nameInput.placeholder = 'name...';
    ageInput.placeholder = 'age...';
    descriptionInput.placeholder = 'description...';
    
    submitButton.innerHTML = 'Create';
    
    form.appendChild(nameInput);
    form.appendChild(ageInput);
    form.appendChild(descriptionInput);
    form.appendChild(submitButton);
    
    document.getElementById('create-monster').appendChild(form);
    
    addSubmitEventListener();
};

// Function to add submit event listener to the monster form
const addSubmitEventListener = () => {
    document.querySelector('#monster-form').addEventListener('submit', event => {
        event.preventDefault();
        console.log('submitted', getFormData());
        postNewMonster(getFormData());
        clearForm();
    });
};

// Function to get form data
const getFormData = () => {
    let name = document.querySelector('#name').value,
        age = parseFloat(document.querySelector('#age').value),
        description = document.querySelector('#description').value;
    return { name, age, description };
};

// Function to post a new monster to the API
const postNewMonster = (monster) => {
    let url = URL_PREFIX + 'monsters',
        options = {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Accept': 'application/json'
            },
            body: JSON.stringify(monster)
        };
    
    fetch(url, options)
        .then(response => response.json())
        .then(newMonster => console.log('new monster', newMonster));
};

// Function to clear the form inputs
const clearForm = () => {
    document.querySelector('#monster-form').reset();
};

// Function to initialize the application
const init = () => {
    getMonsters(page);
    createMonsterForm();
    addNavListeners();
};

// Function to add navigation event listeners
const addNavListeners = () => {
    let backButton = document.querySelector('#back'),
        forwardButton = document.querySelector('#forward');
    
    if (backButton) backButton.addEventListener('click', pageDown);
    if (forwardButton) forwardButton.addEventListener('click', pageUp);
};

// Function to handle "Forward" button click
const pageUp = () => {
    if (!loadingMore) {
        page++;
        getMonsters(page);
    }
};

// Function to handle "Back" button click
const pageDown = () => {
    if (page > 1) {
        page--;
        getMonsters(page);
    } else {
        alert('No more pages to go back');
    }
};

document.addEventListener('DOMContentLoaded', init);
