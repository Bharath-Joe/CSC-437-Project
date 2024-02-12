import { css, html, LitElement } from "lit";
import { customElement } from "lit/decorators.js";

@customElement("search-bar")
class SearchBar extends LitElement {
    _handleSearch(event: InputEvent) {
        const searchTerm = (
            event.target as HTMLInputElement
        ).value.toLowerCase();
        const mealCards = document.querySelectorAll("meal-card");

        mealCards.forEach((mealCard) => {
            const mealName = (mealCard.textContent || "").toLowerCase();
            if (mealName.includes(searchTerm)) {
                (mealCard as HTMLElement).style.display = "block";
            } else {
                (mealCard as HTMLElement).style.display = "none";
            }
        });
    }

    render() {
        return html`
            <section class="Search-Container">
                <input
                    class="Search-Bar"
                    type="text"
                    placeholder="Search"
                    @input="${this._handleSearch}"
                />
            </section>
        `;
    }

    static styles = css`
        .Search-Bar {
            display: flex;
            font-size: 17px;
            align-items: center;
            border: 2px solid var(--color-border);
            border-radius: 5px;
            padding: 5px 10px 5px 10px;
            margin-top: var(--size-spacing-medium);
            background-color: transparent;
            font-weight: bold;
            color: var(--color-text);
        }
    `;
}
