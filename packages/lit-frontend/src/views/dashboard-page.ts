import { PropertyValueMap, css, html, unsafeCSS } from "lit";
import { customElement, property } from "lit/decorators.js";
import * as App from "../app";
import "../components/header-component";
import "../components/meal-card";
import resetCSS from "../styles/reset.css?inline";
import pageCSS from "../styles/page.css?inline";
import { Recipe } from "ts-models";
import { consume } from "@lit/context";
import { authContext } from "./login-page";
import { APIUser, AuthenticatedUser } from "../rest";

@customElement("dashboard-page")
class DashboardPageElement extends App.View {
    @property({ type: Array })
    mealData: Recipe[] = [];

    @property({ type: Array })
    favorites: string[] = [];

    @consume({ context: authContext, subscribe: true })
    @property({ attribute: false })
    user = new APIUser();

    @property({ type: String })
    name: string = "";

    // protected updated(_changedProperties: PropertyValueMap<any> | Map<PropertyKey, unknown>): void {
    //     if(_changedProperties.has("user")) {
    //         this.fetchAndSetRecipes();
    //         this.fetchProfile();
    //     }
    // }

    connectedCallback() {
        super.connectedCallback();
        this.fetchAndSetRecipes();
        this.fetchProfile();
    }

    fetchProfile() {
        fetch(`http://localhost:3000/profiles/${this.user.username}`)
            .then((response) => response.json())
            .then((data) => {
                this.name = data.name;
                this.favorites = data.favorites;
                this.requestUpdate();
            })
            .catch((error) => console.error("Error fetching profile:", error));
    }

    fetchAndSetRecipes() {
        const savedFiltersJSON = localStorage.getItem("savedFilters");
        const savedFilters = savedFiltersJSON
            ? JSON.parse(savedFiltersJSON)
            : {};

        const queryString = Object.keys(savedFilters)
            .map((key) => `${key}=${encodeURIComponent(savedFilters[key])}`)
            .join("&");

        const url = `http://localhost:3000/recipes?${queryString}`;
        var token = (this.user as AuthenticatedUser).token;

        fetch(url, {
            headers: {
                "Content-Type": "application/json",
                Authorization: `Bearer ${token}`,
            },
        })
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

    isFavorite(recipe: Recipe): boolean {
        return this.favorites.some((favorite) => favorite === recipe._id);
    }

    render() {
        return html`
            <section class="body-content">
                <section class="name-refresh">
                    <p>Hello, ${this.name}! What are we cooking today?</p>
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
                                favorited="${this.isFavorite(meal)
                                    ? "favorite"
                                    : "not"}"
                                .recipe=${meal}
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
                color: var(--color-body-text);
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
