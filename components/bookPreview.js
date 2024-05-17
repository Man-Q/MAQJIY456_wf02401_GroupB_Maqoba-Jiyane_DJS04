// Define a custom HTML element for the book preview dialog
class BookPreview extends HTMLElement {
    constructor() {
        super();
    }

    // Invoked when the element is added to the document's DOM
    connectedCallback() {
        // Set the inner HTML for the book preview dialog
        this.innerHTML = `
            <dialog class="overlay" data-list-active>
                <div class="overlay__preview">
                    <img class="overlay__blur" data-list-blur src=""/>
                    <img class="overlay__image" data-list-image src=""/>
                </div>
                <div class="overlay__content">
                    <h3 class="overlay__title" data-list-title></h3>
                    <div class="overlay__data" data-list-subtitle></div>
                    <p class="overlay__data overlay__data_secondary" data-list-description></p>
                </div>

                <!-- Action button for closing the preview dialog -->
                <div class="overlay__row">
                    <button class="overlay__button overlay__button_primary" data-list-close>Close</button>
                </div>
            </dialog>
        `;
    }
}

// Register the custom element with the browser
customElements.define('book-preview-component', BookPreview);