import { css, html, unsafeCSS } from "lit";
import { customElement, property } from "lit/decorators.js";
import * as App from "../app";
import "../components/header-component";
import "../components/meal-card";
import resetCSS from "../styles/reset.css?inline";
import pageCSS from "../styles/page.css?inline";

@customElement("meal-page")
class MealPageElement extends App.View {
    @property({ type: String })
    meal_name: string = "Spaghetti Bolognese";

    @property({ type: String })
    meal_description: string = `Spaghetti Bolognese is a hearty and 
    flavorful Italian pasta dish featuring a rich meat sauce served over 
    cooked spaghetti. This traditional recipe combines ground meat, tomatoes, 
    vegetables, and aromatic herbs to create a satisfying and comforting meal.`;

    @property({ type: Array })
    ingredients: string[] = [
        "1 lb (450g) ground beef or a mix of beef and pork",
        "1 onion, finely chopped",
        "2 carrots, diced",
        "2 celery stalks, diced",
        "3 cloves garlic, minced",
        "1 can (28 oz) crushed tomatoes",
        "1 cup beef or vegetable broth",
        "1/2 cup red wine (optional)",
        "2 tablespoons tomato paste",
        "2 teaspoons dried oregano",
        "1 teaspoon dried basil",
        "1 teaspoon dried thyme",
        "Salt and pepper to taste",
        "Olive oil",
        "1 lb (450g) spaghetti",
        "Grated Parmesan cheese for serving (optional)",
    ];

    @property({ type: Array })
    utensils: string[] = [
        "Large pot or Dutch oven",
        "Spoon (for stirring)",
        "Chopping board",
        "Knife",
        "Measuring cups and spoons",
        "Can opener",
        "Grater (Parmesan cheese, optional)",
        "Cooking spoon or spatula",
        "Colander (for draining spaghetti)",
        "Optional: Wine opener (if using red wine)",
        "Optional: Cheese grater (Parmesan, if desired)"
    ];

    @property({ type: Array })
    steps: string[] = [
        "Heat a large pot or Dutch oven over medium heat. Add a splash of olive oil, and sauté the chopped onions, carrots, and celery until softened.",
        "Add the minced garlic and cook for an additional minute until fragrant.",
        "Increase the heat to medium-high and add the ground meat. Break it apart with a spoon and cook until browned.",
        "Stir in the tomato paste and cook for 2-3 minutes to enhance its flavor.",
        "Pour in the red wine (if using) and let it simmer for a few minutes, allowing the alcohol to cook off.",
        "Add the crushed tomatoes, beef broth, dried oregano, basil, thyme, salt, and pepper. Bring the mixture to a boil, then reduce the heat and let it simmer uncovered for at least 30 minutes to allow the flavors to meld. Stir occasionally.",
        "While the sauce is simmering, cook the spaghetti according to the package instructions. Drain and set aside.",
        "Taste the Bolognese sauce and adjust the seasoning if needed. If the sauce is too thick, you can add a bit more broth.",
        "Serve the Bolognese sauce over the cooked spaghetti. Garnish with grated Parmesan cheese if desired.",
    ];

    render() {
        return html`
            <section class="body-content">
                <section class="meal-header">
                    <h1>${this.meal_name}</h1>
                    <svg class="icon">
                        <use href="/icons/icons.svg#add" />
                    </svg>
                </section>
                <p class="meal-description">${this.meal_description}</p>
                <section class="meal-body">
                    <section class="image-ingredients">
                        <img src="../images/Spaghetti-Bolognese.webp" />
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
