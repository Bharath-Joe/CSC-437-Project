import { PropertyValueMap, css, html, unsafeCSS } from "lit";
import { customElement, property } from "lit/decorators.js";
import * as App from "../app";
import "../components/header-component";
import "../components/meal-card";
import resetCSS from "../styles/reset.css?inline";
import pageCSS from "../styles/page.css?inline";

@customElement("meal-page")
class MealPageElement extends App.View {
    @property({ attribute: false })
    location?: Location;

    @property({ type: String })
    name?: string = this.location?.pathname.replace("/app/", "");

    @property({ type: String })
    description: string = "";

    @property({ type: String })
    cuisine: string = "";

    @property({ type: String })
    cost: string = "";

    @property({ type: String })
    src: string = "";

    @property({ type: Number })
    time: number = NaN;

    @property({ type: Array })
    ingredients: string[] = [];

    @property({ type: Array })
    utensils: string[] = [];

    @property({ type: Array })
    steps: string[] = [];

    costMapping: Record<number, string> = {
        0: "Low",
        1: "Low to Moderate",
        2: "Moderate",
        3: "Moderate to High",
        4: "High",
    };

    protected updated(
        _changedProperties: PropertyValueMap<any> | Map<PropertyKey, unknown>
    ): void {
        if (_changedProperties.has("location")) {
            const name = this.location?.pathname.replace("/app/", "");
            fetch(`http://localhost:3000/recipes/${name}`)
                .then((response) => response.json())
                .then((data) => {
                    console.log(data);
                    this.name = data.name;
                    this.description = data.description;
                    this.ingredients = data.ingredients;
                    this.utensils = data.utensils;
                    this.steps = data.steps;
                    this.cuisine = data.cuisine;
                    this.cost = this.costMapping[data.cost] || "Unknown";
                    this.time = data.time;
                    this.src = data.src;
                    this.requestUpdate();
                })
                .catch((error) =>
                    console.error("Error fetching recipe:", error)
                );
        }
    }

    render() {
        return html`
            <section class="body-content">
                <section class="meal-header">
                    <h1>${this.name} - <span>${this.cuisine}</span></h1>
                    <svg class="icon">
                        <use href="/icons/icons.svg#favorite" />
                    </svg>
                </section>
                <p class="meal-description">
                    <b>Description: </b>${this.description}
                </p>
                <p class="meal-description"><b>Cost: </b>${this.cost}</p>
                <p class="meal-description">
                    <b>Preperation Time: </b>${this.time} minutes
                </p>
                <section class="meal-body">
                    <section class="image-ingredients">
                        <img src=${this.src} />
                        <section class="ingredients">
                            <h2>Ingredients:</h2>
                            <ul>
                                ${this.ingredients.map(
                                    (ingredient) => html`<li>${ingredient}</li>`
                                )}
                            </ul>
                        </section>
                        <section class="utensils">
                            <h2>Utensils:</h2>
                            <ul>
                                ${this.utensils.map(
                                    (utensil) => html`<li>${utensil}</li>`
                                )}
                            </ul>
                        </section>
                    </section>
                    <section class="steps">
                        <h2>Steps:</h2>
                        <ol>
                            ${this.steps.map((step) => html`<li>${step}</li>`)}
                        </ol>
                    </section>
                </section>
            </section>
        `;
    }

    static styles = [
        unsafeCSS(resetCSS),
        unsafeCSS(pageCSS),
        css`
            h1 {
                color: var(--color-text-invert);
                font-size: 35px;
            }

            h2 {
                color: var(--color-text-invert);
            }

            .body-content {
                width: 100%;
                padding: 40px;
            }

            .meal-header {
                display: flex;
                justify-content: space-between;
                color: var(--color-text-invert);
                padding-bottom: var(--size-spacing-extra-small);
                border-bottom: 2px solid var(--color-border);
            }

            .meal-body {
                display: flex;
                flex-direction: column;
                margin-top: var(--size-spacing-medium);
                gap: var(--size-spacing-medium);
            }

            .image-ingredients {
                display: flex;
                gap: var(--size-spacing-medium);
            }

            ul,
            ol {
                display: flex;
                flex-direction: column;
                gap: var(--size-spacing-extra-small);
            }

            .steps,
            .ingredients,
            .utensils {
                display: flex;
                flex-direction: column;
                gap: var(--size-spacing-extra-small);
            }

            .ingredients,
            .utensils {
                height: 350px;
                overflow: auto;
            }

            .meal-description {
                padding-top: var(--size-spacing-extra-small);
            }

            svg.icon {
                width: 2.5rem;
                height: 2.5rem;
            }

            img {
                width: 350px;
                height: 350px;
                border-radius: 10px;
                overflow: hidden;
                object-fit: cover;
            }
        `,
    ];
}
