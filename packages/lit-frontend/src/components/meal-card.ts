import { css, html, LitElement, render, unsafeCSS } from "lit";
import { customElement, property } from "lit/decorators.js";
import resetCSS from "../styles/reset.css?inline";
import pageCSS from "../styles/page.css?inline";
import { consume } from "@lit/context";
import { authContext } from "../views/login-page";
import { APIUser, AuthenticatedUser } from "../rest";
import { Recipe } from "ts-models";

@customElement("meal-card")
class MealElement extends LitElement {
    @property({ type: String })
    favorited: string = "";

    @property({ type: Object })
    recipe: Recipe = {
        name: "",
        cuisine: "",
        description: "",
        type: "",
        ingredients: [],
        utensils: [],
        steps: [],
        cost: 0,
        time: 0,
        src: "",
    };

    @consume({ context: authContext, subscribe: true })
    @property({ attribute: false })
    user = new APIUser();

    // Handle the click event on the heart icon
    private handleFavoriteClick(newRecipe: Recipe) {
        console.log(newRecipe);
        const newFavoritedState =
            this.favorited === "favorite" ? "" : "favorite";
        this.favorited = newFavoritedState;
        if (newFavoritedState === "favorite") {
            this.addToFavorites(newRecipe);
        } else {
            this.removeFromFavorites(newRecipe);
        }
    }

    private removeFromFavorites(newRecipe: Recipe) {
        var token = (this.user as AuthenticatedUser).token;
        fetch(
            `http://localhost:3000/profiles/favorites/remove/${this.user.username}`,
            {
                method: "PUT",
                headers: {
                    "Content-Type": "application/json",
                    Authorization: `Bearer ${token}`,
                },
                body: JSON.stringify(newRecipe),
            }
        )
            .then((response) => {
                if (!response.ok) {
                    throw new Error("Failed to add to favorites");
                }
                return response.json();
            })
            .then((profile) => {
                console.log("Added to favorites:", profile);
            })
            .catch((error) => {
                console.error("Error adding to favorites:", error);
            });
    }

    private addToFavorites(newRecipe: Recipe) {
        var token = (this.user as AuthenticatedUser).token;
        fetch(
            `http://localhost:3000/profiles/favorites/${this.user.username}`,
            {
                method: "PUT",
                headers: {
                    "Content-Type": "application/json",
                    Authorization: `Bearer ${token}`,
                },
                body: JSON.stringify(newRecipe),
            }
        )
            .then((response) => {
                if (!response.ok) {
                    throw new Error("Failed to add to favorites");
                }
                return response.json();
            })
            .then((profile) => {
                console.log("Added to favorites:", profile);
            })
            .catch((error) => {
                console.error("Error adding to favorites:", error);
            });
    }

    render() {
        return html`
            <li class="card">
                <section class="card-contents">
                    <section class="card-header">
                        ${this.recipe.name}
                        ${this.favorited === "favorite"
                            ? html`<svg
                                  class="icon"
                                  @click="${() =>
                                      this.handleFavoriteClick(this.recipe)}"
                              >
                                  <use href="/icons/icons.svg#heart-filled" />
                              </svg>`
                            : html`<svg
                                  class="icon"
                                  @click="${() =>
                                      this.handleFavoriteClick(this.recipe)}"
                              >
                                  <use href="/icons/icons.svg#heart-outline" />
                              </svg>`}
                    </section>
                    <a class="card-body" href="/app/${this.recipe.name}">
                        <img src=${this.recipe.src} />
                    </a>
                </section>
            </li>
        `;
    }

    static styles = [
        unsafeCSS(resetCSS),
        unsafeCSS(pageCSS),
        css`
            img {
                width: 275px;
                height: 275px;
                border-radius: 10px;
                overflow: hidden;
                object-fit: cover;
            }
            .card {
                padding: 15px;
                // border: 2px solid var(--color-border);
                border-radius: 10px;
                color: var(--color-body-text);
                font-family: var(--font-family-header);
                width: 300px;
                box-shadow: rgba(100, 100, 111, 0.2) 0px 7px 29px 0px;
            }
            .card-contents {
                display: flex;
                flex-direction: column;
                gap: var(--size-spacing-large);
                text-decoration: none;
                color: var(--color-body-text);
            }

            .card-header {
                display: flex;
                align-items: baseline;
                justify-content: space-between;
                gap: var(--size-spacing-medium);
                font-size: 1.5rem;
                font-weight: bold;
                height: 50px;
            }

            .card-body {
                display: flex;
                justify-content: center;
            }

            svg.icon {
                fill: var(--color-background);
                stroke: var(--color-background);
            }
        `,
    ];
}
