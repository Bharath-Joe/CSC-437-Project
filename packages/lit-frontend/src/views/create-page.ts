import { css, html, unsafeCSS } from "lit";
import { customElement, property } from "lit/decorators.js";
import * as App from "../app";
import "../components/header-component";
import resetCSS from "../styles/reset.css?inline";
import pageCSS from "../styles/page.css?inline";
import { APIUser, AuthenticatedUser } from "../rest";
import { consume } from "@lit/context";
import { authContext } from "./login-page";

@customElement("create-page")
class CreatePageElement extends App.View {
    @consume({ context: authContext, subscribe: true })
    @property({ attribute: false })
    user = new APIUser();

    name: string = "";
    description: string = "";
    type: string = "";
    cuisine: string = "";
    time: number = 0;
    ingredients: string[] = [];
    utensils: string[] = [];
    steps: string[] = [];
    cost: number = 2;
    link: string = "";

    handleNameChange(event: InputEvent) {
        const input = event.target as HTMLInputElement;
        this.name = input.value;
        this.requestUpdate();
    }

    handleCuisineChange(event: InputEvent) {
        const input = event.target as HTMLInputElement;
        this.cuisine = input.value;
        this.requestUpdate();
    }

    handleTypeChange(event: Event) {
        const select = event.target as HTMLInputElement;
        this.type = select.value;
        this.requestUpdate();
    }

    handleDescriptionChange(event: InputEvent) {
        const textarea = event.target as HTMLTextAreaElement;
        this.description = textarea.value;
        this.requestUpdate();
    }

    handleTimeChange(event: InputEvent) {
        const input = event.target as HTMLInputElement;
        this.time = parseInt(input.value);
        this.requestUpdate();
    }

    handleCostChange(event: InputEvent) {
        const input = event.target as HTMLInputElement;
        this.cost = parseInt(input.value);
        this.requestUpdate();
    }

    handleIngredientsChange(event: InputEvent) {
        const textarea = event.target as HTMLTextAreaElement;
        const textList = textarea.value;
        const ingredientsArray = textList.split("\n");
        this.ingredients = ingredientsArray.filter(
            (ingredient) => ingredient.trim() !== ""
        );
        this.requestUpdate();
    }

    handleUtensilsChange(event: InputEvent) {
        const textarea = event.target as HTMLTextAreaElement;
        const textList = textarea.value;
        const utensilsArray = textList.split("\n");
        this.utensils = utensilsArray.filter(
            (utensil) => utensil.trim() !== ""
        );
        this.requestUpdate();
    }

    handleStepsChange(event: InputEvent) {
        const textarea = event.target as HTMLTextAreaElement;
        const textList = textarea.value;
        const stepsArray = textList.split("\n");
        this.steps = stepsArray.filter((step) => step.trim() !== "");
        this.requestUpdate();
    }

    handleLinkChange(event: InputEvent) {
        const input = event.target as HTMLInputElement;
        this.link = input.value;
        this.requestUpdate();
    }

    handleCreate(event: Event) {
        const target = event.target as HTMLInputElement;
        const form = target.closest("form") as HTMLFormElement;
        const newRecipe = {
            name: this.name,
            description: this.description,
            type: this.type,
            cuisine: this.cuisine,
            time: this.time,
            cost: this.cost,
            ingredients: this.ingredients,
            utensils: this.utensils,
            steps: this.steps,
            src: this.link,
        };

        var token = (this.user as AuthenticatedUser).token;
        fetch("http://localhost:3000/recipes", {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                Authorization: `Bearer ${token}`,
            },
            body: JSON.stringify(newRecipe),
        })
            .then((response) => {
                if (!response.ok) {
                    throw new Error("Failed to create recipe");
                }
                return response.json();
            })
            .then((createdRecipe) => {
                console.log("Recipe created:", createdRecipe);
                this.name = "";
                this.description = "";
                this.type = "";
                this.cuisine = "";
                this.time = 0;
                this.cost = 2;
                this.ingredients = [];
                this.utensils = [];
                this.steps = [];
                this.link = "";
                alert("Recipe successfully created!");
                this.requestUpdate();
            })
            .catch((error) => {
                console.error("Error creating recipe:", error);
            });
    }

    render() {
        return html`
            <form class="body-content">
                <section class="create-item">
                    <label for="name">Recipe Name:</label>
                    <input
                        id="name"
                        type="text"
                        value=${this.name}
                        @input=${(event: InputEvent) =>
                            this.handleNameChange(event)}
                    />
                </section>
                <section class="create-item">
                    <label for="description">Recipe Description:</label>
                    <textarea
                        id="description"
                        rows="4"
                        @input=${(event: InputEvent) =>
                            this.handleDescriptionChange(event)}
                    ></textarea>
                </section>
                <section class="create-item">
                    <label for="type">Type:</label>
                    <select
                        id="type"
                        @change=${(event: Event) =>
                            this.handleTypeChange(event)}
                    >
                        <option value="">Select an option</option>
                        <option
                            value="Vegan"
                            ?selected=${this.type === "Vegan"}
                        >
                            Vegan
                        </option>
                        <option
                            value="Vegetarian"
                            ?selected=${this.type === "Vegetarian"}
                        >
                            Vegetarian
                        </option>
                        <option
                            value="Non-Vegetarian"
                            ?selected=${this.type === "Non-Vegetarian"}
                        >
                            Non-Vegetarian
                        </option>
                    </select>
                </section>
                <section class="create-item">
                    <label for="cuisine">Cuisine:</label>
                    <input
                        id="cuisine"
                        type="text"
                        value=${this.cuisine}
                        @input=${(event: InputEvent) =>
                            this.handleCuisineChange(event)}
                    />
                </section>
                <section class="create-item">
                    <label for="time"
                        >Preperation Time <span>(min.)</span>:</label
                    >
                    <input
                        id="time"
                        type="number"
                        value=${this.time}
                        @input=${(event: InputEvent) =>
                            this.handleTimeChange(event)}
                    />
                </section>
                <section class="create-item">
                    <label for="cost">Recipe Cost:</label>
                    <section id="cost">
                        <span>Low</span>
                        <input
                            type="range"
                            min="0"
                            max="4"
                            value=${this.cost}
                            @input=${(event: InputEvent) =>
                                this.handleCostChange(event)}
                        />
                        <span>High</span>
                    </section>
                </section>
                <section class="create-pair">
                    <section class="create-item">
                        <label for="ingredients">Ingredients:</label>
                        <textarea
                            id="ingredients"
                            rows="4"
                            placeholder="Enter each ingredient on a new line"
                            @input=${(event: InputEvent) =>
                                this.handleIngredientsChange(event)}
                        ></textarea>
                    </section>
                    <section class="create-item">
                        <label for="utensils">Utensils:</label>
                        <textarea
                            id="utensils"
                            rows="4"
                            placeholder="Enter each utensil on a new line"
                            @input=${(event: InputEvent) =>
                                this.handleUtensilsChange(event)}
                        ></textarea>
                    </section>
                </section>
                <section class="create-item">
                    <label for="steps">Steps:</label>
                    <textarea
                        id="steps"
                        rows="4"
                        placeholder="Enter each step on a new line"
                        @input=${(event: InputEvent) =>
                            this.handleStepsChange(event)}
                    ></textarea>
                </section>
                <section class="create-item">
                    <label for="link">Image Link Address:</label>
                    <input
                        type="link"
                        value=${this.link}
                        @input=${(event: InputEvent) =>
                            this.handleLinkChange(event)}
                    />
                </section>
                <section
                    class="button"
                    @click=${(event: Event) => this.handleCreate(event)}
                >
                    <button>Create</button>
                </section>
            </form>
        `;
    }

    static styles = [
        unsafeCSS(resetCSS),
        unsafeCSS(pageCSS),
        css`
            .button {
                display: flex;
                justify-content: center;
            }

            #cost {
                display: flex;
                align-items: center;
                gap: 10px;
            }

            button {
                background: var(--color-background);
                color: var(--color-text);
                font-size: 15px;
                font-family: var(--font-family-body);
                border: none;
                border-radius: 50px;
                padding: 5px 15px 5px 15px;
            }
            .body-content {
                display: flex;
                flex-direction: column;
                padding: 40px;
                gap: var(--size-spacing-medium);
                color: var(--color-body-text);
            }

            .create-item span {
                font-size: 12px;
            }

            input,
            select {
                padding: 5px 10px 5px 10px;
                border-radius: 10px;
                border: 1px solid black;
                width: 40vw;
                font-family: var(--font-family-body);
            }

            textarea {
                padding: 10px 0px 0px 10px;
                border-radius: 10px;
                border: 1px solid black;
            }

            .create-pair {
                display: flex;
                gap: var(--size-spacing-large);
            }

            .create-pair .create-item {
                width: 100%;
            }

            .create-item {
                display: flex;
                flex-direction: column;
                gap: var(--size-spacing-extra-small);
                width: 40vw;
            }
        `,
    ];
}
