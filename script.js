const bookmarksContainer = document.getElementById('bookmarks-container');
const bookmarkForm = document.getElementById('bookmark-form');

const websiteNameElement = document.getElementById('website-name');
const websiteURLElement = document.getElementById('website-url');

const modal = document.getElementById('modal');
const modalDisplay = document.getElementById('show-modal');
const modalClose = document.getElementById('close-modal');

// Global variabel for stored bookmarks
let bookmarks = [];


// Event listeners
modalDisplay.addEventListener('click', displayModal);
modalClose.addEventListener('click', () => modal.classList.remove('show-modal'));
// Now we store bookmark after user enters value
bookmarkForm.addEventListener('submit', storeBookmark);
// Remove modal if user click on the modal container
window.addEventListener('click', (e) => (e.target === modal ? modal.classList.remove('show-modal') : false));


// Show modal, focus on first input in the form
function displayModal() {
    modal.classList.add('show-modal');
    websiteNameElement.focus();
}

// Handle data from form input
function storeBookmark(e) {
    e.preventDefault();
    // Set variables for value from input form
    const nameValue = websiteNameElement.value;
    let urlValue = websiteURLElement.value;
    // Match http / https
    if (!urlValue.includes('http://', 'https://')) {
        urlValue = `https://${urlValue}`;
    }
    // If nameValue and URL is not formated correctly, dismiss
    if (!validate(nameValue, urlValue)) {
        return false;
    }

    // Store each bookmark object and push it inside the bookmarks array
    const bookmark = {
        name: nameValue,
        url: urlValue,
    };
    bookmarks.push(bookmark);
    // Reset the form from inputs after storing the values from form input
    bookmarkForm.reset();
    websiteNameElement.focus();
    // Local Storage
    localStorage.setItem('bookmarks', JSON.stringify(bookmarks));
    fetchBookmarks();
}

// Validate url adress and validate name value from form to be filled
function validate(nameValue, urlValue) {
    // Regex expression function for URL, match and see if pattern is correct
    const expression = /https?:\/\/(www\.)?[-a-zA-Z0-9@:%._\+~#=]{1,256}\.[a-zA-Z0-9()]{1,6}\b([-a-zA-Z0-9()@:%_\+.~#?&//=]*)/g;
    const regex = new RegExp(expression);
    if (!urlValue.match(regex)) {
        alert('Please provide a valid web adress');
        return false;
    }
    if (urlValue.match(regex)) {
        console.log('Match');
    }
    // If input is empty dismiss
    if (!nameValue || !urlValue) {
        alert('Please submit values for both fields');
        return false;
    }
    // If all is valid and successfull
    return true;
}

// Build bookmarks DOM for each item
function buildBookmarks() {
    // Reset bookmark elements
    bookmarksContainer.textContent = ''; // Remove everything from the container before updating 
    // Build each bookmark
    bookmarks.forEach((bookmark) => {
        const { name, url } = bookmark;
        // Item
        const item = document.createElement('div');
        item.classList.add('item');
        // Close icon, DOM + Delete function
        const closeIcon = document.createElement('i');
        closeIcon.classList.add('fas', 'fa-times');
        closeIcon.setAttribute('title', 'Delete Bookmark');
        closeIcon.setAttribute('onclick', `deleteBookmark('${url}')`);
        // Favicon / Link container
        const linkInformation = document.createElement('div');
        linkInformation.classList.add('name');
        // Favicon
        const favicon = document.createElement('img');
        favicon.setAttribute('src', `https://s2.googleusercontent.com/s2/favicons?domain=${url}`);
        favicon.setAttribute('alt', 'Favicon');

        // Link the bookmark to open in a new window
        const link = document.createElement('a');
        link.href = `${url}`;
        link.target = '_blank';
        link.textContent = name;

        // Append to bookmarks container
        linkInformation.append(favicon, link);
        item.append(closeIcon, linkInformation);
        bookmarksContainer.appendChild(item);
    });
}


// Delete a bookmark, target specific indexed bookmark
function deleteBookmark(url) {
    bookmarks.forEach((bookmark, index) => {
        if (bookmark.url === url) {
            bookmarks.splice(index, 1);
        }
    });
    // Update the bookmark array in localStorage, update the DOM
    localStorage.setItem('bookmarks', JSON.stringify(bookmarks));
    fetchBookmarks();
}

// Fetch Bookmarks
function fetchBookmarks() {
    // Get bookmarks from localStorage if available
    if (localStorage.getItem('bookmarks')) {
        bookmarks = JSON.parse(localStorage.getItem('bookmarks'));
    } else {
        // Create bookmarks array in localStorage
        bookmarks = [
            {
                name: 'Google',
                url: 'https://google.com',
            },
        ];
        localStorage.setItem('bookmarks', JSON.stringify(bookmarks));
    }
    buildBookmarks();
}

// On website load
fetchBookmarks();