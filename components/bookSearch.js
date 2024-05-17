// Define a custom HTML element for the book search dialog
class BookSearch extends HTMLElement {
    constructor() {
        super();
    }

    // Invoked when the element is added to the document's DOM
    connectedCallback() {
        // Set the inner HTML for the search dialog
        this.innerHTML = `
            <dialog class="overlay" data-search-overlay>
                <div class="overlay__content">
                    <form class="overlay__form" data-search-form id="search">
                        <!-- Title input field -->
                        <label class="overlay__field">
                            <div class="overlay__label">Title</div>
                            <input class="overlay__input" data-search-title name="title" placeholder="Any"></input>
                        </label>

                        <!-- Genre selection dropdown -->
                        <label class="overlay__field">
                            <div class="overlay__label">Genre</div>
                            <select class="overlay__input overlay__input_select" data-search-genres name="genre"></select>
                        </label>

                        <!-- Author selection dropdown -->
                        <label class="overlay__field">
                            <div class="overlay__label">Author</div>
                            <select class="overlay__input overlay__input_select" data-search-authors name="author"></select>
                        </label>
                    </form>

                    <!-- Action buttons for the search dialog -->
                    <div class="overlay__row">
                        <button class="overlay__button" data-search-cancel>Cancel</button>
                        <button class="overlay__button overlay__button_primary" type="submit" form="search">Search</button>
                    </div>
                </div>
            </dialog>
        `;
    }
}

// Register the custom element with the browser
customElements.define('book-search-component', BookSearch);