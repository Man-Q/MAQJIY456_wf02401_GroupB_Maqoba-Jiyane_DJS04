// Import necessary data and constants from data.js
import { books, authors, genres, BOOKS_PER_PAGE } from './data.js'

// Initialize global variables
let page = 0; // Current page number
let matches = books; // Array of books matching the search criteria
let count = 1; // Counter for debugging

// Utility function to select an element and optionally append a child
function selectAndOrAppend(selector, append) {
    count++; // Increment counter
    console.log(`append ${append}`);
    if (append === null) {
        return document.querySelector(selector);
    } else if (append === undefined) {
        console.log(`error caused by ${count} of selectAndOrAppend`);
    }
    return document.querySelector(selector).appendChild(append);
}

// Function to initialize the page with initial data and settings
function initializePage() {
    const theme = localStorage.getItem('theme'); // Retrieve the theme from localStorage
    const starting = document.createDocumentFragment(); // Create a document fragment for book previews
    
    // Populate the initial book previews
    for (const { author, id, image, title } of matches.slice(0, BOOKS_PER_PAGE)) {
        const element = document.createElement('button');
        element.classList = 'preview';
        element.setAttribute('data-preview', id);
    
        element.innerHTML = `
            <img class="preview__image" src="${image}" />
            <div class="preview__info">
                <h3 class="preview__title">${title}</h3>
                <div class="preview__author">${authors[author]}</div>
            </div>
        `;
    
        starting.appendChild(element);
    }
    
    // Populate genre options
    const genreHtml = document.createDocumentFragment();
    const firstGenreElement = document.createElement('option');
    firstGenreElement.value = 'any';
    firstGenreElement.innerText = 'All Genres';
    genreHtml.appendChild(firstGenreElement);
    
    for (const [id, name] of Object.entries(genres)) {
        const element = document.createElement('option');
        element.value = id;
        element.innerText = name;
        genreHtml.appendChild(element);
    }
    
    // Populate author options
    const authorsHtml = document.createDocumentFragment();
    const firstAuthorElement = document.createElement('option');
    firstAuthorElement.value = 'any';
    firstAuthorElement.innerText = 'All Authors';
    authorsHtml.appendChild(firstAuthorElement);
    
    for (const [id, name] of Object.entries(authors)) {
        const element = document.createElement('option');
        element.value = id;
        element.innerText = name;
        authorsHtml.appendChild(element);
    }
    
    // Apply the selected theme
    if (theme === 'night') {
        document.querySelector('[data-settings-theme]').value = 'night';
        document.documentElement.style.setProperty('--color-dark', '255, 255, 255');
        document.documentElement.style.setProperty('--color-light', '10, 10, 20');
    } else {
        document.documentElement.style.setProperty('--color-dark', '10, 10, 20');
        document.documentElement.style.setProperty('--color-light', '255, 255, 255');
    }
    
    // Execute on window load
    window.onload = function() {
        selectAndOrAppend('[data-list-items]', starting); // Append the previews to the list items
        selectAndOrAppend('[data-list-button]', null).innerText = `Show more (${books.length - BOOKS_PER_PAGE})`;
        selectAndOrAppend('[data-list-button]', null).disabled = (matches.length - (page * BOOKS_PER_PAGE)) > 0;
        selectAndOrAppend('[data-list-button]', null).innerHTML = `
            <span>Show more</span>
            <span class="list__remaining"> (${(matches.length - (page * BOOKS_PER_PAGE)) > 0 ? (matches.length - (page * BOOKS_PER_PAGE)) : 0})</span>
        `;
        selectAndOrAppend('[data-search-genres]', genreHtml); // Append genres to the search genres dropdown
        selectAndOrAppend('[data-search-authors]', authorsHtml); // Append authors to the search authors dropdown
        addEventListeners(); // Add event listeners for interactive elements
    };
}

// Function to add event listeners to various elements
function addEventListeners() {
    // Cancel search overlay
    selectAndOrAppend('[data-search-cancel]', null).addEventListener('click', () => {
        selectAndOrAppend('[data-search-overlay]', null).open = false;
    });
    
    // Cancel settings overlay
    selectAndOrAppend('[data-settings-cancel]', null).addEventListener('click', () => {
        selectAndOrAppend('[data-settings-overlay]', null).open = false;
    });
    
    // Open search overlay
    selectAndOrAppend('[data-header-search]', null).addEventListener('click', () => {
        selectAndOrAppend('[data-search-overlay]', null).open = true;
        selectAndOrAppend('[data-search-title]', null).focus();
    });
    
    // Open settings overlay
    selectAndOrAppend('[data-header-settings]', null).addEventListener('click', () => {
        selectAndOrAppend('[data-settings-overlay]', null).open = true;
    });
    
    // Close book list overlay
    selectAndOrAppend('[data-list-close]', null).addEventListener('click', () => {
        selectAndOrAppend('[data-list-active]', null).open = false;
    });
    
    // Handle settings form submission
    selectAndOrAppend('[data-settings-form]', null).addEventListener('submit', (event) => {
        event.preventDefault();
        const formData = new FormData(event.target);
        const { theme } = Object.fromEntries(formData);
    
        localStorage.setItem('theme', theme);

        // Apply the selected theme
        if (theme === 'night') {
            document.documentElement.style.setProperty('--color-dark', '255, 255, 255');
            document.documentElement.style.setProperty('--color-light', '10, 10, 20');
        } else {
            document.documentElement.style.setProperty('--color-dark', '10, 10, 20');
            document.documentElement.style.setProperty('--color-light', '255, 255, 255');
        }
        
        selectAndOrAppend('[data-settings-overlay]', null).open = false;
    });
    
    // Handle search form submission
    selectAndOrAppend('[data-search-form]', null).addEventListener('submit', (event) => {
        event.preventDefault();
        const formData = new FormData(event.target);
        const filters = Object.fromEntries(formData);
        const result = [];
    
        // Filter books based on search criteria
        for (const book of books) {
            let genreMatch = filters.genre === 'any';
    
            for (const singleGenre of book.genres) {
                if (genreMatch) break;
                if (singleGenre === filters.genre) { genreMatch = true; }
            }
    
            if (
                (filters.title.trim() === '' || book.title.toLowerCase().includes(filters.title.toLowerCase())) && 
                (filters.author === 'any' || book.author === filters.author) && 
                genreMatch
            ) {
                result.push(book);
            }
        }
    
        page = 1;
        matches = result;
    
        // Display message if no results are found
        if (result.length < 1) {
            selectAndOrAppend('[data-list-message]', null).classList.add('list__message_show');
        } else {
            selectAndOrAppend('[data-list-message]', null).classList.remove('list__message_show');
        }
    
        // Update book list with new search results
        selectAndOrAppend('[data-list-items]', null).innerHTML = '';
        const newItems = document.createDocumentFragment();
    
        for (const { author, id, image, title } of result.slice(0, BOOKS_PER_PAGE)) {
            const element = document.createElement('button');
            element.classList = 'preview';
            element.setAttribute('data-preview', id);
        
            element.innerHTML = `
                <img class="preview__image" src="${image}" />
                <div class="preview__info">
                    <h3 class="preview__title">${title}</h3>
                    <div class="preview__author">${authors[author]}</div>
                </div>
            `;
    
            newItems.appendChild(element);
        }
    
        selectAndOrAppend('[data-list-items]', newItems); // Append new items to the list
        selectAndOrAppend('[data-list-button]', null).disabled = (matches.length - (page * BOOKS_PER_PAGE)) < 1;
    
        selectAndOrAppend('[data-list-button]', null).innerHTML = `
            <span>Show more</span>
            <span class="list__remaining"> (${(matches.length - (page * BOOKS_PER_PAGE)) > 0 ? (matches.length - (page * BOOKS_PER_PAGE)) : 0})</span>
        `;
    
        window.scrollTo({top: 0, behavior: 'smooth'}); // Scroll to the top
        selectAndOrAppend('[data-search-overlay]', null).open = false; // Close search overlay
    });
    
    // Handle "Show more" button click to load more books
    selectAndOrAppend('[data-list-button]', null).addEventListener('click', () => {
        const fragment = document.createDocumentFragment();
    
        for (const { author, id, image, title } of matches.slice(page * BOOKS_PER_PAGE, (page + 1) * BOOKS_PER_PAGE)) {
            const element = document.createElement('button');
            element.classList = 'preview';
            element.setAttribute('data-preview', id);
        
            element.innerHTML = `
                <img class="preview__image" src="${image}" />
                <div class="preview__info">
                    <h3 class="preview__title">${title}</h3>
                    <div class="preview__author">${authors[author]}</div>
                </div>
            `;
    
            fragment.appendChild(element);
        }
    
        selectAndOrAppend('[data-list-items]', fragment); // Append more items to the list
        page += 1; // Increment the page number
    });
    
    // Handle book preview click to display book details
    selectAndOrAppend('[data-list-items]', null).addEventListener('click', (event) => {
        const pathArray = Array.from(event.path || event.composedPath());
        let active = null;
    
        for (const node of pathArray) {
            if (active) break;
    
            if (node?.dataset?.preview) {
                let result = null;
        
                for (const singleBook of books) {
                    if (result) break;
                    if (singleBook.id === node?.dataset?.preview) result = singleBook;
                } 
            
                active = result;
            }
        }
        
        if (active) {
            // Display book details in the overlay
            selectAndOrAppend('[data-list-active]', null).open = true;
            selectAndOrAppend('[data-list-blur]', null).src = active.image;
            selectAndOrAppend('[data-list-image]', null).src = active.image;
            selectAndOrAppend('[data-list-title]', null).innerText = active.title;
            selectAndOrAppend('[data-list-subtitle]', null).innerText = `${authors[active.author]} (${new Date(active.published).getFullYear()})`;
            selectAndOrAppend('[data-list-description]', null).innerText = active.description;
        }
    });
}

// Initialize the page when the script loads
initializePage();
