import { css, html, unsafeCSS } from "lit";
import { customElement } from "lit/decorators.js";
import * as App from "../app";
import "../components/header-component";
import resetCSS from "../styles/reset.css?inline";
import pageCSS from "../styles/page.css?inline";

interface RecipeType {
    name: string;
    description: string;
}

@customElement("filters-page")
class FlitersPageElement extends App.View {
    types: RecipeType[] = [
        {
            name: "Vegan",
            description:
                "Excludes all animal products, including meat, dairy, eggs, and honey.",
        },
        {
            name: "Vegetarian",
            description: "Excludes meat, but may include dairy and eggs.",
        },
        {
            name: "Non-Vegetarian",
            description: "Includes both meat and other animal products.",
        },
    ];

    cuisines: string[] = [
        "Italian",
        "Mexican",
        "Japanese",
        "Chinese",
        "Indian",
        "French",
        "Thai",
        "Greek",
        "Mediterranean",
        "American",
        "Spanish",
        "Korean",
        "Vietnamese",
        "Brazilian",
        "Middle Eastern",
        "Caribbean",
        "African",
        "Russian",
        "German",
    ];

    selectedType: string = "";
    selectedCuisines: string[] = [];
    excludedIngredients: string[] = [];
    selectedPrice: number = 2;
    selectedMinTime: number = 0;
    selectedMaxTime: number = 0;
    defaultTextArea: string = "";

    handleCuisineClick(cuisine: string) {
        const index = this.selectedCuisines.indexOf(cuisine);
        if (index === -1) {
            this.selectedCuisines.push(cuisine);
        } else {
            this.selectedCuisines.splice(index, 1);
        }
        this.requestUpdate();
    }

    handleTypeClick(typeName: string) {
        if (typeName === this.selectedType) {
            this.selectedType = "";
        } else {
            this.selectedType = typeName;
        }
        this.requestUpdate();
    }

    handleExcludedIngredientsChange(event: InputEvent) {
        const textarea = event.target as HTMLTextAreaElement;
        const excludedIngredientsText = textarea.value;
        const ingredientsArray = excludedIngredientsText.split("\n");
        this.excludedIngredients = ingredientsArray.filter(
            (ingredient) => ingredient.trim() !== ""
        );
        this.requestUpdate();
    }

    handlePriceChange(event: InputEvent) {
        const rangeInput = event.target as HTMLInputElement;
        this.selectedPrice = parseInt(rangeInput.value);
        this.requestUpdate();
    }

    handleMinTimeChange(event: InputEvent) {
        const timeInput = event.target as HTMLInputElement;
        this.selectedMinTime = parseInt(timeInput.value);
        this.requestUpdate();
    }

    handleMaxTimeChange(event: InputEvent) {
        const timeInput = event.target as HTMLInputElement;
        this.selectedMaxTime = parseInt(timeInput.value);
        this.requestUpdate();
    }

    handleSubmit() {
        console.log(
            "Type: " + this.selectedType + "\n",
            "Cusines: " + this.selectedCuisines + "\n",
            "Excluded Ingredients: " + this.excludedIngredients + "\n",
            "Selected Price: " + this.selectedPrice + "\n",
            "Selected Min Time: " + this.selectedMinTime + "\n",
            "Selected Max Time: " + this.selectedMaxTime
        );
        this.saveFiltersToLocalStorage();
    }

    handleClearAll() {
        localStorage.removeItem("savedFilters");
        this.selectedType = "";
        this.selectedCuisines = [];
        this.excludedIngredients = [];
        this.selectedPrice = 2;
        this.selectedMinTime = 0;
        this.selectedMaxTime = 0;
        this.requestUpdate();
    }

    connectedCallback() {
        super.connectedCallback();
        const savedFilters = localStorage.getItem("savedFilters");
        if (savedFilters) {
            const parsedFilters = JSON.parse(savedFilters);
            if (parsedFilters.excludedIngredients) {
                const excludedIngredientsString =
                    parsedFilters.excludedIngredients.join("\n");
                this.defaultTextArea = excludedIngredientsString;
            }

            Object.assign(this, parsedFilters);
            this.requestUpdate();
        }
    }

    saveFiltersToLocalStorage() {
        const filtersToSave = {
            selectedType: this.selectedType,
            selectedCuisines: this.selectedCuisines,
            excludedIngredients: this.excludedIngredients,
            selectedPrice: this.selectedPrice,
            selectedMinTime: this.selectedMinTime,
            selectedMaxTime: this.selectedMaxTime,
        };
        localStorage.setItem("savedFilters", JSON.stringify(filtersToSave));
    }

    render() {
        return html`
            <section class="body-content">
                <p class="Title">Filters</p>
                <hr />
                <section class="Filter-Options">
                    <section class="filter">
                        <b>Type of Recipe</b>
                        <section class="content">
                            ${this.types.map(
                                (type) =>
                                    html`
                                        <section
                                            class="type-option ${type.name ===
                                            this.selectedType
                                                ? "selected"
                                                : []}"
                                            @click=${() =>
                                                this.handleTypeClick(type.name)}
                                        >
                                            <b>${type.name}</b>
                                            <span>${type.description}</span>
                                        </section>
                                    `
                            )}
                        </section>
                    </section>
                    <section class="filter">
                        <b>Cuisine</b>
                        <section class="content">
                            ${this.cuisines.map(
                                (cuisine) =>
                                    html`
                                        <p
                                            class="cuisine-option ${this.selectedCuisines.includes(
                                                cuisine
                                            )
                                                ? "selected"
                                                : ""}"
                                            @click=${() =>
                                                this.handleCuisineClick(
                                                    cuisine
                                                )}
                                        >
                                            ${cuisine}
                                        </p>
                                    `
                            )}
                        </section>
                    </section>
                    <section class="filter">
                        <b>Excluded Ingredients</b>
                        <textarea
                            id="ingredients"
                            rows="4"
                            placeholder="Enter each excluded ingredient on a new line."
                            @input=${(event: InputEvent) =>
                                this.handleExcludedIngredientsChange(event)}
                        >${this.defaultTextArea}
                        </textarea>
                    </section>
                    <section class="filter">
                        <b>Price</b>
                        <section class="content">
                            <span>Low</span>
                            <input
                                type="range"
                                min="0"
                                max="4"
                                value=${this.selectedPrice}
                                @input=${(event: InputEvent) =>
                                    this.handlePriceChange(event)}
                            />
                            <span>High</span>
                        </section>
                    </section>
                    <section class="filter">
                        <b>Preperation Time</b>
                        <section class="content">
                            <section class="option">
                                <p>Minimum Time</p>
                                <span
                                    ><input
                                        type="number"
                                        value=${this.selectedMinTime}
                                        @input=${(event: InputEvent) =>
                                            this.handleMinTimeChange(event)}
                                    />min.</span
                                >
                            </section>
                            <section class="option">
                                <p>Maximum Time</p>
                                <span
                                    ><input
                                        type="number"
                                        value=${this.selectedMaxTime}
                                        @input=${(event: InputEvent) =>
                                            this.handleMaxTimeChange(event)}
                                    />min.</span
                                >
                            </section>
                        </section>
                    </section>
                </section>
                <hr />
                <section class="Filter-Footer">
                    <button @click=${() => this.handleClearAll()}>
                        <p>Clear all</p>
                    </button>
                    <button class="special" @click=${() => this.handleSubmit()}>
                        Apply Filters
                    </button>
                </section>
            </section>
        `;
    }

    static styles = [
        css`
            .body-content {
                width: 100%;
                padding: 40px;
                color: var(--color-body-text);
            }

            input[type="range"] {
                width: 25vw;
            }

            input[type="number"] {
                border-radius: 7px;
                padding: 10px;
                border: 1px solid var(--color-border);
            }

            input {
                font-family: var(--font-family-body);
            }

            textarea {
                width: 44vw;
                padding: 10px 0px 0px 10px;
                border-radius: 10px;
            }

            .Title {
                display: flex;
                align-items: center;
                justify-content: space-between;
                margin-bottom: var(--size-spacing-medium);
            }

            .filter {
                display: flex;
                flex-direction: column;
                gap: var(--size-spacing-medium);
            }

            .content {
                display: flex;
                gap: var(--size-spacing-large);
                flex-wrap: wrap;
                width: fit-content;
            }
            .type-option {
                display: flex;
                padding: var(--size-spacing-extra-small);
                border: 1px solid var(--color-border);
                border-radius: 10px;
                flex-direction: column;
                max-width: 21vw;
                gap: var(--size-spacing-extra-small);
                cursor: pointer;
            }

            .type-option.selected {
                background-color: var(--color-background);
                color: var(--color-text);
                border: none;
            }

            .option {
                display: flex;
                padding: var(--size-spacing-extra-small);
                flex-direction: column;
                gap: var(--size-spacing-extra-small);
            }

            .option span {
                display: flex;
                gap: var(--size-spacing-extra-small);
                align-items: center;
            }

            .type-option span {
                font-weight: 300;
                font-size: 14px;
            }

            .Filter-Options {
                display: flex;
                flex-direction: column;
                gap: var(--size-spacing-large);
                margin-top: var(--size-spacing-medium);
                margin-bottom: var(--size-spacing-medium);
            }

            .Filter-Footer {
                display: flex;
                justify-content: space-between;
                margin-top: var(--size-spacing-medium);
                align-items: center;
            }

            button {
                background: none;
                padding: 10px 15px 10px 15px;
                border: 1px solid var(--color-border);
                border-radius: 50px;
                font-size: 15px;
                font-family: var(--font-family-body);
            }

            .special {
                background: var(--color-background);
                border: none;
                color: var(--color-text);
            }

            .cuisine-option,
            .price-option {
                padding: 10px;
                border: 1px solid var(--color-border);
                border-radius: 10px;
                cursor: pointer;
            }

            .cuisine-option.selected {
                background-color: var(--color-background);
                color: var(--color-text);
                border: none;
            }
        `,
        unsafeCSS(resetCSS),
        unsafeCSS(pageCSS),
    ];
}
