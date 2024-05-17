

// Define a custom HTML element for the not found message
class NotFound extends HTMLElement {
    constructor() {
        super();
    }

    // Invoked when the element is added to the document's DOM
    connectedCallback() {
        // Set the inner HTML for the not found message
        this.innerHTML = `
        <main class="list">
        <div class="list__items" data-list-items></div>
        <div class="list__message" data-list-message>No results found. Your filters might be too narrow.</div>
        <button class="list__button" data-list-button></button>
      </main>
        `;
    }
}

// Register the custom element with the browser
customElements.define('not-found-component', NotFound);