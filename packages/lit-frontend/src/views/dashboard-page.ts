import { css, html, unsafeCSS } from "lit";
import { customElement, property } from "lit/decorators.js";
import * as App from "../app";
import "../components/header-component";
import "../components/meal-card";
import resetCSS from "../styles/reset.css?inline";
import pageCSS from "../styles/page.css?inline";
import { Recipe } from "ts-models";

@customElement("dashboard-page")
class DashboardPageElement extends App.View {
    @property({ type: Array })
    mealData: Recipe[] = [];

    connectedCallback() {
        super.connectedCallback();
        this.fetchAndSetRecipes();
    }

    fetchAndSetRecipes() {
        const savedFiltersJSON = localStorage.getItem("savedFilters");
        const savedFilters = savedFiltersJSON
            ? JSON.parse(savedFiltersJSON)
            : {};

        // Include saved filters in the request URL
        const queryString = Object.keys(savedFilters)
            .map((key) => `${key}=${encodeURIComponent(savedFilters[key])}`)
            .join("&");

        const url = `http://localhost:3000/recipes?${queryString}`;
        fetch(url)
            .then((response) => response.json())
            .then((data) => {
                if (data && data.length > 0) {
                    let sortedData = data.sort(() => Math.random() - 0.5);
                    switch (this.selectedSortID) {
                        case "A-Z":
                            this.mealData = sortedData.sort(
                                (a: { name: string }, b: { name: any }) =>
                                    a.name.localeCompare(b.name)
                            );
                            break;
                        case "Z-A":
                            this.mealData = sortedData.sort(
                                (a: { name: any }, b: { name: string }) =>
                                    b.name.localeCompare(a.name)
                            );
                            break;
                        case "Random":
                            this.mealData = sortedData;
                            break;
                        default:
                            break;
                    }
                    this.requestUpdate();
                }
            })
            .catch((error) => console.error("Error fetching recipes:", error));
    }

    handleRefreshClick() {
        this.fetchAndSetRecipes();
    }

    sortOptions = [
        {
            name: "Random Order",
            id: "Random",
        },
        {
            name: "Ascending order",
            id: "A-Z",
        },
        {
            name: "Descending order",
            id: "Z-A",
        },
    ];

    selectedSortID: string = "Random";
    handleSortSelect(sortID: string) {
        this.selectedSortID = sortID;
        this.fetchAndSetRecipes();
    }
    render() {
        return html`
            <section class="body-content">
                <section class="name-refresh">
                    <p>Hello, Bharath! What are we cooking today?</p>
                    <svg class="icon" @click=${() => this.handleRefreshClick()}>
                        <use href="/icons/icons.svg#refresh" />
                    </svg>
                </section>
                <label class="sort">
                    Sort by:
                    <section class="sort-options">
                        ${this.sortOptions.map(
                            (sort) =>
                                html`<span
                                    id=${sort.id}
                                    class=${sort.id === this.selectedSortID
                                        ? "selected"
                                        : ""}
                                    @click=${() =>
                                        this.handleSortSelect(sort.id)}
                                    >${sort.name}</span
                                >`
                        )}
                    </section>
                </label>
                <ul>
                    ${this.mealData.map(
                        (meal) =>
                            html`<meal-card
                                src=${meal.src}
                                name=${meal.name}
                            ></meal-card>`
                    )}
                </ul>
            </section>
        `;
    }

    static styles = [
        unsafeCSS(resetCSS),
        unsafeCSS(pageCSS),
        css`
            .body-content {
                width: 100%;
                padding: 40px;
            }

            svg.icon {
                display: inline;
                height: 2em;
                width: 2em;
                vertical-align: top;
                fill: currentColor;
                stroke: currentColor;
                cursor: pointer;
            }

            .name-refresh {
                display: flex;
                align-items: center;
                justify-content: space-between;
                margin-bottom: var(--size-spacing-large);
            }

            .sort-options {
                margin-top: var(--size-spacing-small);
                margin-bottom: var(--size-spacing-large);
                width: max-content;
                border-radius: 10px;
                display: flex;
                border: 2px solid var(--color-border);
            }

            #Random {
                padding: 10px;
                border-right: 2px solid var(--color-border);
            }

            #Random.selected {
                color: var(--color-text);
                border-radius: 8px 0 0 8px;
                background-color: var(--color-background);
            }

            #A-Z {
                padding: 10px;
                border-right: 2px solid var(--color-border);
            }

            #A-Z.selected {
                background-color: var(--color-background);
                color: var(--color-text);
            }

            #Z-A {
                padding: 10px;
            }

            #Z-A.selected {
                color: var(--color-text);
                border-radius: 0 8px 8px 0;
                background-color: var(--color-background);
            }

            .body-content ul {
                padding: 0;
                margin: 0;
                display: flex;
                text-decoration: none;
                list-style: none;
                gap: var(--size-spacing-large);
                flex-wrap: wrap;
                width: fit-content;
                justify-content: space-between;
            }
        `,
    ];
}
