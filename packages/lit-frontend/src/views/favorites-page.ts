import { PropertyValueMap, css, html, unsafeCSS } from "lit";
import { customElement, property } from "lit/decorators.js";
import * as App from "../app";
import "../components/header-component";
import "../components/meal-card";
import resetCSS from "../styles/reset.css?inline";
import pageCSS from "../styles/page.css?inline";
import { consume } from "@lit/context";
import { authContext } from "./login-page";
import { APIUser } from "../rest";
import { Recipe } from "ts-models";

@customElement("favorites-page")
class FavoritesPageElement extends App.View {
    @consume({ context: authContext, subscribe: true })
    @property({ attribute: false })
    user = new APIUser();

    @property({ type: Array })
    favoriteRecipes: Recipe[] = [];

    connectedCallback() {
        super.connectedCallback();
        this.fetchProfile();
    }

    // protected updated(_changedProperties: PropertyValueMap<any> | Map<PropertyKey, unknown>): void {
    //     if(_changedProperties.has("user")) {
    //         this.fetchProfile();
    //     }
    // }

    fetchProfile() {
        fetch(`http://localhost:3000/profiles/${this.user.username}`)
            .then((response) => response.json())
            .then((data) => {
                console.log(data);
                this.fetchRecipeDetails(data.favorites); // Fetch details for each favorite recipe
                this.requestUpdate();
            })
            .catch((error) => console.error("Error fetching profile:", error));
    }

    fetchRecipeDetails(favorites: string[]) {
        favorites.forEach((favorite) => {
            fetch(`http://localhost:3000/recipes/id/${favorite}`)
                .then((response) => response.json())
                .then((recipe) => {
                    console.log(recipe);
                    this.favoriteRecipes.push(recipe);
                    this.requestUpdate();
                })
                .catch((error) =>
                    console.error("Error fetching profile:", error)
                );
        });
    }
    render() {
        return html`
            <section class="body-content">
                <ul>
                    ${this.favoriteRecipes.map(
                        (favorite) =>
                            html`<meal-card
                                favorited="favorite"
                                .recipe=${favorite}
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
